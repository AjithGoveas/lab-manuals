---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 12
title: "Salesforce Developer Org Setup Guide"
description: "Step-by-step instructions to create a free, lifetime Salesforce Developer Org and access the Developer Console."
tags: ["Salesforce", "PaaS", "Setup", "Apex", "Developer Org"]
dataset: "Salesforce Identity"
vivaQuestions:
  - question: "What is the difference between a Developer Org and a standard Salesforce sandbox?"
    answer: "A Developer Org is a free, standalone, lifetime environment designed for learning and testing. Sandboxes are temporary copies of active corporate production environments used for staging deployments."
  - question: "How do you access the Salesforce Developer Console?"
    answer: "After logging in, click the Gear Icon (Setup) in the top-right corner of the window and select 'Developer Console'."
---

Several experiments in this lab manual utilize **Apex** programming on the **Salesforce** platform. Rather than using a corporate sandbox or production account, Salesforce offers free, lifetime Developer Orgs.

---

## 🚀 Creating a Salesforce Developer Account

1. Open your web browser and go to the [Salesforce Developer Signup Page](https://developer.salesforce.com/signup).
2. Fill out the registration form:
   - **First Name & Last Name**
   - **Email**: Enter a valid email address (this is where activation instructions will be sent).
   - **Role**: Select **Developer**.
   - **Company**: You can enter your school name or "Self".
   - **Country**
   - **Postal Code**
   - **Username**: Must be in the format of an email address (e.g., `yourname@ccsec.lab`) and must be globally unique across all Salesforce systems. It does not need to be a real email address.
3. Check the box to accept the Master Subscription Agreement.
4. Click **Sign me up**.
5. Check your email for an activation link (usually arrives in 2–5 minutes).
6. Click **Verify Account** in the email.
7. Set a password and select a security question.

---

## 🛠️ Navigating to the Developer Console

Once logged in:
1. Look at the top right of the screen for the **Gear Icon** (Setup).
2. Click the gear icon and select **Developer Console**.
3. A separate pop-up window will open. This is where you will write Apex classes, execute anonymous code block executions, run queries, and review debugging logs.
