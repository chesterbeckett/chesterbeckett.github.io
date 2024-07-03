---
title: Restarting Web App Instances
date: 2024-07-03 20:42:05 +/-TTTT
categories: [Azure, Web App]
tags: [webapp, appservice, instance, restart]     # TAG names should always be lowercase
---

There are a few ways to seemingly "restart" a Web App (Windows) in Azure. Not all of them are equal, or necassarily doing what you think they are doing. In this post, I detail out some of the more popular methods.

## Hitting Restart on the Web App Overview Page.

This option from the Overview page of the AS will restart ALL the Web App instances and their processes, but not other Web Apps on the App Service Plan.

- Comparable to an IISRESET in Windows.
- Expect downtime, HTTP 503's etc.
- This includes the Kudu Process.

![image](/assets/img/webapprestart/img_1.png)

## Advanced Application Restart of an Instance.

Form the Web App, under _Diagnose and solve problems_, we have the **Advanced Application Restart** diagnostic tool. This allows us to restart each instance individually.

> Advanced application restart lets you restart individual instances of your application as well as intelligently restarting multiple instances. The restart timer lets you specify the time interval in seconds used between restarting individual instances of the app reducing the effect of cold starts. NOTE: If an instance of your app is unresponsive, you may not see it in the list here.
> 
> To mitigate, you may need to do a full restart of your app.  To prevent this from occuring in the future, we recommend setting up Health Check.
{: .prompt-info }

![image](/assets/img/webapprestart/img_2.png)