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
