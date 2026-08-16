---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 4
title: "Cloud Application Development with Apex"
description: "Develop Apex classes and execute anonymous blocks in the Salesforce cloud Developer Console."
tags: ["Salesforce", "Apex", "SaaS", "PaaS", "Developer Console"]
dataset: "Salesforce Cloud"
vivaQuestions:
  - question: "What is Apex in the context of Salesforce?"
    answer: "Apex is a strongly-typed, object-oriented programming language that allows developers to execute flow and transaction control statements on Salesforce servers in conjunction with calls to the API."
  - question: "What does multitenancy mean, and how does it relate to Governor Limits?"
    answer: "Multitenancy means multiple customers (tenants) share the same underlying physical server hardware and database instances. Governor limits are runtime limits enforced by the Apex engine to ensure runaway Apex code doesn't monopolize shared resources."
  - question: "What is the difference between standard execution and *Execute Anonymous*?"
    answer: "Standard execution runs compiled, saved classes (often triggered by events or schedules). *Execute Anonymous* allows you to compile and run scratchpad code snippets on the fly without saving them permanently as part of your Org metadata."
  - question: "How do you view debug statement outputs in the Developer Console?"
    answer: "By checking the *Debug Only* filter option in the Execution Log view, which suppresses system event lines and only shows System.debug() printouts."
---

| Option | Value |
| :--- | :--- |
| **Prerequisites** | Salesforce Developer Org Account |
| **Estimated Time**| 25 minutes |
| **Technology** | Salesforce Platform, Apex (Proprietary Cloud Language), Developer Console |

---

## 🎯 Aim
To set up a Salesforce Developer Environment, create a custom Apex Class, compile it on the Salesforce Cloud, and execute it using the Developer Console's Anonymous Execution Window to view debug logs.

---

## 📖 Theoretical Background

### Salesforce.com Platform & Apex
Salesforce is a leading cloud-based Customer Relationship Management (CRM) platform. It provides Platform as a Service (PaaS) capabilities through its proprietary programming language, **Apex**.

### Key Characteristics of Apex:
* **Cloud-based**: Apex is compiled and executed entirely on Salesforce's multitenant cloud servers. It is not run locally.
* **Object-Oriented**: The syntax is highly similar to Java or C#.
* **Strongly-typed & Database-integrated**: Apex integrates directly with the Salesforce database (SOQL/SOSL queries and DML operations can be written directly within the language).
* **Governor Limits**: Because Apex runs in a shared multitenant environment, Salesforce enforces strict "Governor Limits" (e.g., maximum CPU time, maximum SOQL queries) to prevent a single user's script from hogging shared system resources.

---

## 🛠️ Requirements & Setup
- An active Salesforce Developer Org. If you do not have one, refer to the [Salesforce Developer Org Setup Guide](../../docs/salesforce-setup.md).

---

## 🚶 Step-by-Step Procedure

### Phase A: Setting up and Accessing the Console
1. **Sign In**: Navigate to [login.salesforce.com](https://login.salesforce.com/) and enter your Developer Org credentials.
2. **Launch Developer Console**:
   - In the Lightning Experience interface, click the **Gear Icon** (Setup) in the top-right corner.
   - Select **Developer Console** from the dropdown menu. A separate IDE window will open.

---

### Phase B: Writing the Apex Class
1. **Create Class**: In the Developer Console, go to **File** ➔ **New** ➔ **Apex Class**.
2. **Name Class**: In the prompt box, enter the class name `HelloWorldApp` and click **OK**.
3. **Write Code**: Replace the default generated code structure with the following:
   ```apex
   public class HelloWorldApp {
       public static void sayHello() {
           System.debug('WELCOME TO APEX PROGRAMMING');
       }
   }
   ```
4. **Save and Compile**: Go to **File** ➔ **Save** (or press `Ctrl` + `S`). The Developer Console will compile the code on the cloud. Check the *Problems* tab at the bottom to ensure there are no compilation errors.

---

### Phase C: Executing the Class
1. **Open Anonymous Window**: In the Developer Console, click on the **Debug** menu at the top, then select **Open Execute Anonymous Window** (or press `Ctrl` + `E`).
2. **Write execution script**: In the dialog box, type the following Apex statement to invoke the static method:
   ```apex
   HelloWorldApp.sayHello();
   ```
3. **Execute**: Ensure the **Open Log** checkbox is checked at the bottom right, and click the **Execute** button.

---

## 🧪 Expected Output & Verification
- The **Log Inspector** window will load automatically showing details of the execution.
- Check the **Debug Only** checkbox in the bottom filter panel.
- The log list will filter down to display your output statement:
  ```text
  |USER_DEBUG|[3]|DEBUG|WELCOME TO APEX PROGRAMMING
  ```


