---
title: Integrate an Application Gateway with Azure Key Vault
date: 2024-03-27
categories: [Azure, Key Vault]
tags: [azure, kv, key, vault, integrate]
---

## Overview

The following configuration should be the default method of uploading certificates to Application Gateways (AppGW). This will make your SSL renewal tasks much easier with very low/no impact to Production environments.

This will apply to both existing AppGW configurations or new configurations.

With this configuration, we set the AppGW to automatically fetch the required certificate directly from the Keyvault (KV), using a Managed Identity (MID) which has permissions to the Key Vault.

## Scenario

Imagine a scenario where you have 6 AppGWs, each with around 40 HTTPS listeners for their respective wildcard domain, we would usually go and update each listener, which means around 240 changes across the AppGWs.

With the config detailed here, we would just need ONE change, to the cert in the KeyVault, or 6 if each AppGW was referencing a different Keyvault.

## Pre-requisites

- Application Gateway Standard V2 or WAF V2.
- Valid SSL Certificate in PFX format secured with a password. Certificate **MUST** include the full chain of Intermediate certs.
- Keyvault in the same Subscription and Region as the Application Gateway.
- Keyvault will need Purge Protection Enabled.
- Managed Identity with access to the objects within the KeyVault.

> Access to vaults takes place through two interfaces or planes..
>   - **Management Plane (RBAC)** - The management plane is where you manage the Key Vault itself and it is the interface used to create and delete vaults. You can also read key vault properties and manage access policies. But you wont necassarily be able to read/write anything within the Key Vault.
>   - **Data Plane (RBAC or Access Polcies)** - Access to Objects (Keys, Secrets, Certificactes) within the Key Vault, allows you to work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.
{: .prompt-info }

### Confirm if an HTTPS Listener is using an AppGW Installed Cert or a Keyvault referenced Certifcate

You can use the Azure Portal to confirm:

AppGW > Settings > Listeners > Listener TLS certificates

# Process in detail

## Uploading the Certificate to the Keyvault

>  - Azure sometimes complains silently about "#" and "$" characters in Certificate passwords, so avoid using those characters in your PFX passwords.
>  - To upload a certificate to a Key Vault, it must have a password. If you download a Certificate from the Key Vault, it will not have a password.
>  - As mentioned previously, ensure the SSL you are uploading includes the full chain of valid intermeddiate/CA certificates, or your certificate will not function correctly.
{: .prompt-tip }

### For an Existing/Renewed Certificate.

This is how to add new SSL certificates for domains that already have SSLs in your Key Vault, in the case of renewing a SSL.

1. Open Keyvault > Certificates.
2. Select the existing/current/expiring certificate object.
3. Select "New Version".
4. Method of Certificate Creation > "Import".
5. Provide the path to the cert, and password. The cert needs to be password protected and in .PFX format.
6. From here there is nothing further to do, the AppGW will pickup the new SSL version within 4 hours.

> If you want to trigger the AppGW to pick up the renewed certificate immediately, for example if the existing SSL has already expired,  then you will need to make a change on the AppGW to trigger a config refresh.
> Such as changing the polling period on a custom health probe, or response code. Something small that wont impact production but will trigger the AppGW to pull the latest SSL from the Key Vault.
> There is no downtime when renewing existing SSL certificates.
{: .prompt-tip }

### For Completely New Certificate.

This certificate doesnt already exist in your Key Vault, a totally new SSL for a domain.

1. Open Keyvault > Certificates
2. Select "Generate/Import"
3. Method of Certificate Creation > "Import"
4. Specify the Certificate Name: Specify something that is recognizable. **Don't include any expiry info in the Cert Name, this will cause confusion later on, and it's not needed at all.**

   a. Example: If you have a wildcard cert for ***.domain.com**, I have choose the cert name "**wildcard-domain-com**". This will make it easier to identify in the AppGW Config later on.

5. Provide the path to the cert, and password. The cert needs to be password protected and in .PFX format.

## Create User Assigned Managed Identity

This will be the identity which the AppGW will use to access the Keyvault to retrieve the certificate.

1. Open "Managed Identity" in the Azure Portal.
2. Create a new Managed Identity.
3. You can assign the required permissions via one of the two methods below, depending if your KV is uing Access Policies or RBAC for permissions (You can only choose one or the other):

    a. **RBAC** - Select Access control (IAM) and Add a role assignment for the user-assigned managed identity you just created, to the Azure key vault for the role **Key Vault Secrets User**. (This option is not preferred when using the Portal to configure the AppGW)

    b. **Access Policies** - From your Keyvault, Select Access Policies, select + Add Access Policy, select **Get** and **List** for Certificate permissions, and choose your user-assigned managed identity for "Select principal". Then select Save.

### More on the _RBAC_ side of things

When you create the KV via the Portal, it suggests that RBAC is the preferred method for managing data plane access. I dont see any noteable advantages of using RBAC over Access Policies, when integrating AppGws to KVs. The access methods/roles are slightly more complicated though, when using RBAC, and something you need to be aware of.

> Specifying Azure Key Vault certificates that are subject to the role-based access control permission model is not supported via the portal.
{: .prompt-info }

This means that adding a New Certifcate Object to the AppGW, that has RBAC access method enabled, is not supported via the portal. You need to use code to add it. Even though the Portal still has the option, it will fail on "_The Managed ID doesnt have access to the KV_" type error when trying to select the cert.

PowerShell - The context ID that is running this code, will need the _Key Vault Administrator_ and _Directory Reader_ RBAC roles. This is the Management Plane level.

``` powershell
# AppGW KV Integration
# Environment Vars
$appgwname = "%AppGwName%"
$appgwnamersg = "%AppGwRsgName%"
$miId = "/subscriptions/%SubId%/resourcegroups/%RsgName%/providers/Microsoft.ManagedIdentity/userAssignedIdentities/%ManagedIdName%"
$vaultname = "%KeyVaultName%"
$certname = "wildcard-domain-com"

# Get the Application Gateway we want to modify
$appgw = Get-AzApplicationGateway -Name $appgwname -ResourceGroupName $appgwnamersg

# Specify the resource id to the user assigned managed identity - This can be found by going to thsee properties of the managed identity
Set-AzApplicationGatewayIdentity -ApplicationGateway $appgw -UserAssignedIdentityId $miId

# Get the secret ID from Key Vault
$secret = Get-AzKeyVaultSecret -VaultName $vaultname -Name $certname
$secretId = $secret.Id.Replace($secret.Version, "") # Remove the secret version so Application Gateway uses the latest version in future syncs

# Specify the secret ID from Key Vault
Add-AzApplicationGatewaySslCertificate -KeyVaultSecretId $secretId -ApplicationGateway $appgw -Name $secret.Name

# Commit the changes to the Application Gateway
Set-AzApplicationGateway -ApplicationGateway $appgw
```

### More on the _Access Policies_ side of things

Access Policies are my preferred method when using AppGws and KVs. Once the permissions are set, you are able to use the Portal to add new Cert Objects to the AppGw's.

PowerShell - The context ID that is running this code, will need the _Key Vault Administrator_ and _Directory Reader_ RBAC roles. This is the Management Plane level.

``` powershell
# Get your Managed Identity
$spId = Get-AzADServicePrincipal -DisplayName $name | Select Id

# If you have a few Key Vaults to manage use the line below, otherwise specify -VaultName and -ResourceGroupName parameters for a single Key Vault.
$kvs = get-azkeyvault

# Set permissions/access to each Keyvault store (Cert/Key/Secret)
# See full details for each set https://docs.microsoft.com/en-us/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy?view=azps-7.1.0#parameters
$ptc = "get","list"

# Loop through each Keyvault and add a policy for the Managed Identity.
foreach ($kv in $kvs) {
    foreach ($spId in $spIds) {
        Set-AzKeyVaultAccessPolicy -VaultName $kv.VaultName -ObjectId $spId.Id -PermissionsToCertificates $ptc
    }
}
```

## Setup AppGW to Retrieve Certificate from Keyvault

Follow this process when you are configuring a new HTTPS Listener on your AppGw.

1. Go to your AppGw > Settings > Listeners > select "**Add Listener**".
2. Provide your Listener Name, IP and choose **HTTPS** protocol.
3. Under the "**Choose a Certificate**" section, select "**Create New**" > "**Choose a certificate from Key Vault**" option
4. Give it a **Certificate Name**, I would advise using the same name as the Certificate name in the Key Vault (My example was _wildcard-domain-com_).
5. Complete the remaining config as per your requirements. I usually set "**Listener Type**" to "**Multi Site**" and specifiy the domain hostname I am setting it up for, example: _www.domain.com_ or _test.domain.com_.

> To switch an existing Listener from AppGW Certificate to Key Vault Certificate
> You can use the same method above to update an existing listener that previously had the certificate uploaded manually to the AppGW, by selecting "Renew or Edit Selected Certificate" option on the listener config.
> Or you can choose the KV certificate which will appear in the drop down if it was previously added to another Listener previously. This is where logical naming conventions come into play, so that you easily select the correct certificate from the list.
{: .prompt-tip }

# Conclusion

Once the AppGW is configured to fetch the Cert from the Keyvault, it will check every 4 hours for a new version of the Certificate. So when it comes to renewing that cert, you do not make any changes to the AppGW itself.

You just need to import the renewed cert as a **New Version** of the existing cert in the Keyvault, as above. From there the AppGW picks up the new version and updates all the listeners that are configured to the Keyvault for that certificate.
