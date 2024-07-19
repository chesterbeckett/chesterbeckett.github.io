---
title: CrowdStrike VM Mitigation
date: 2024-07-19 10:42:05 +/-TTTT
categories: [Azure, VMs]
tags: [azure, vms, crowdstrike, bsod, loop, boot, restart] # TAG names should always be lowercase
---

## Issue

Crowdstrike issue impacting Virtual Machines running Windows Client and Windows Server, running the CrowdStrike Falcon agent, which may encounter a bug check (BSOD) and get stuck in a restarting state/boot loop.

It's approximated that the impact started around 19:00 UTC on the 18th of July.

## Symptoms

- VMs are stuck in a boot loop, which includes a BSOD.
- Serial Console is not available.

## Resolution

There are a number of scenarios that may apply given the VM type.

> The faulty file may still be present after restore, but CS appears to have replaced it with a non-busted version:
>
> <a href="https://www.crowdstrike.com/blog/statement-on-falcon-content-update-for-windows-hosts/" target="_blank">Statement on Falcon Content Update for Windows Hosts</a>
> - Channel file "C-00000291*.sys" with timestamp of 0527 UTC or later is the reverted (good) version.
> - Channel file "C-00000291*.sys" with timestamp of 0409 UTC is the problematic version.
{: .prompt-info }

### Option 1 - Restore VM from backup
If the VM is used for relatively static workloads and has valid backups, its recommended that you restore from a backup from before 04:09 UTC on the 18th of July.

This option is not recommended for Domain Controllers or Database workloads.

### Option 2 - Repair OS Disk

> Method Works for Gen V1 and V2 VMs, but V2 VMs require additional steps noted below.
{: .prompt-warning }

Pre-requisites for this method require:
- Staging resources (VM/Disks) need to be created in the same Region and Availability Zone as the affected VM.
- Staging VM created in affected VMs Region and Availability Zone, get customer approval as multiple VMs may be required.

### Steps (Azure Portal) for V1 VMs:

1. From the affected VM, go to Disks and take Incremental Snapshot (Not Image) of affected OS Disk.
2. Once the snapshot is created, create a new disk from that Snapshot, same region, RSG, AZ as effected VM OS disk.
3. Attach new disk to Staging VM.
4. Logon to Staging VM.
5. Use Disk Manager to "Online" the disk if its not online already.

![image](/assets/img/crowdstrike/img_1.png)

6. Remove all `C:/Windows/System/System32/Drivers/CrowdStrike/C00000291*.sys` files.
7. Detach new disk from Staging VM.
8. Go to effected VM and SWAP OS Disk to new Disk. VM > Disks > Swap OS Disk.
9. Boot affected server.

### Steps (Azure Portal) for V2 VMs:

1. From the affected VM, go to Disks and take Incremental Snapshot (Not Image) of affected OS Disk.
2. Once the snapshot is created, create a new disk from that Snapshot, same region, RSG, AZ as effected VM OS disk.
3. Attach new disk to Staging VM.
4. Logon to Staging VM.
5. Use Disk Manager to "Online" the disk if its not online already.

![image](/assets/img/crowdstrike/img_2.png)

6. Remove all `C:/Windows/System/System32/Drivers/CrowdStrike/C00000291*.sys` files.
7. We need to assign a drive letter to the boot partition, this is the EFI partition, usually around 95-99mb.

![image](/assets/img/crowdstrike/img_3.png)

8. Open Server Manager > File and Storage Services > Volumes > Disks.
9. Check Disk Management for Disk Number, in this example - Disk 1.

![image](/assets/img/crowdstrike/img_4.png)

10. Set a drive letter with Server Manager, not Disk Management, by right-clicking on the volume > Manage Drive Letter....
11. It can be any available letter but in this example, I used "B:", for boot.

![image](/assets/img/crowdstrike/img_5.png)

12. Open File Explorer and you can now see B: drive mounted. Or whatever drive letter you chose in the previous step.
13. Locate the BSD file and note the path. Typically, it should be: %drive letter%\EFI\Microsoft\Boot. Make a note of the path.

![image](/assets/img/crowdstrike/img_6.png)

14. Make a note of the drive letter for the Windows Partition for the effected drive, in this example, `E:`
15. With the information from step 13, update the following command:

>`bcdedit /store %Drive and Path from step13% /enum /v`
>
>For this example: `bcdedit /store B:\EFI\Microsoft\Boot\bcd /enum /v`

16. Open a command prompt and run the command.
17. Copy the Windows Boot Load Identifier from the output (This example: `3a615177-24a5-11ef-8404-002248498060`):
    
  ![image](/assets/img/crowdstrike/img_7.png)

18. Update the following scripts with the info:
    1.  Set all the paths to your bcd
    2.  In Line 1, Device Partition Drive letter matches letter from step 10.
    3.  In Line 5, Device letter matches letter from step 14.
    4.  In Line 11, Device letter matches letter from step 14.
    5.  Replace `%Boot Load Identifier%` with your Identifier from step 17.
