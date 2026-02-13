---
title: undefined
date: undefined


---
---
title: Setting a Static Time Window in KQL
date: 2024-02-16 13:12:05 +/-TTTT
categories: [Azure, KQL]
tags: [azure, kql, time, query, log, analytics]     # TAG names should always be lowercase
---

I had a requirement to set the query time frame to minimize the data set to filter on. Due to a requirement to setup an alert that checks for a yearly log entry.

## Log Analytics Contraints

1. You really dont want to query a years worth of log data in LA, at every run of the query. Its ineffecient and will probably get flagged by MSFT.
2. You cannot schedule an alert query to run on a specific date or time period. So in this scenario (Run query once a year on a given day/date), we cannot set it to run once a year or even once a month. Instead we set the KQL to query a specific time window.

![image](/assets/img/statictimekql/img_1.png)

<a href="https://learn.microsoft.com/en-gb/azure/azure-monitor/logs/query-optimization#time-span-of-the-processed-query" target="_blank">Reference article on this point</a>

## KQL

Here is a suggestion on the format of using Time Windows in KQL:

```
// Gets the current year
let currentYear = getyear(datetime(now));

// Set startDate and endDate for use later on, all you need to change here are the day/month values. US format (YYYY-MM-DD) is used below but LA will output in your local format.
let startDate = todatetime(strcat(currentYear,"-09-01 00:00:00"));
let endDate = todatetime(strcat(currentYear,"-09-08 23:59:00"));

// Include the above logic in whatever Log Analytics Log Table you are querying.
%LogTable%
| where TimeGenerated between (startDate .. endDate)

// Set your KQL query.
%logQuery%
```

Here is an example where the Storage Blog Logs are being queried, for the _PUTBLOCKLIST_ operation, for a given time frame:

```
let currentYear = getyear(datetime(now));
let startDate = todatetime(strcat(currentYear,"-09-01 00:00:00"));
let endDate = todatetime(strcat(currentYear,"-09-08 23:59:00"));
let StorageAccountName = "%StorageAccountName%";
let StorageContainerName = "%StorageContainerName%";
StorageBlobLogs
| where TimeGenerated between (startDate .. endDate)
| where OperationName =~ "PutBlockList"
| where AccountName == StorageAccountName
| where ObjectKey has StorageContainerName
| extend %ContainerObjectName% = split(split(ObjectKey, '/')[-1], '_')[0]
| summarize arg_max(TimeGenerated, *) by tostring(%ContainerObjectName%)
| extend Last1YrBackup = iff(TimeGenerated >= ago(366d), 1, 0)
| extend ResourceIdLength = strlen(_ResourceId)
| extend LastResourceIdValueLenth = strlen(split(_ResourceId, '/')[-1])
| extend _ResourceId = strcat(substring(_ResourceId, 0, ResourceIdLength - LastResourceIdValueLenth), %ContainerObjectName%)
| project TimeGenerated, %ContainerObjectName%, ObjectKey, Last1YrBackup, _ResourceId
```