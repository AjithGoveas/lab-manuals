---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 11
title: "AWS Account Setup & Security Guide"
description: "Step-by-step instructions to create an AWS Free Tier account, enable MFA, and establish billing alerts."
tags: ["AWS", "IAM", "Setup", "Security", "Free Tier"]
dataset: "AWS Identity"
vivaQuestions:
  - question: "Why is it critical to enable MFA for the AWS Root Account immediately?"
    answer: "The Root Account has full administrative power and billing access. If compromised, attackers can spawn massive instances for cryptomining, leading to huge financial liabilities."
  - question: "What is a Billing Alarm and why is it important for students?"
    answer: "A Billing Alarm alerts you via email/SMS if your estimated monthly charges cross a specific threshold (e.g. $5.00), preventing unexpected charges from running services."
---

Many experiments in this lab manual utilize **Amazon Web Services (AWS)**. This guide outlines the steps to set up your AWS account and secure it correctly.

---

## 💳 Creating an AWS Free Tier Account

AWS offers a 12-month free tier for new accounts, which is sufficient for completing the experiments in this manual.

1. Go to the [AWS Free Tier Page](https://aws.amazon.com/free/).
2. Click **Create a Free Account**.
3. Enter your email address and an account name, then verify your email.
4. Set a strong password for your **Root User**.
5. Provide contact information (select **Personal** for your account type).
6. Enter credit/debit card information. AWS will make a temporary charge of $1 (or equivalent currency) to verify identity, which is refunded.
7. Complete identity verification via SMS or voice call.
8. Select the **Basic Support - Free** plan.
9. Wait for activation confirmation email (can take up to 24 hours, but usually occurs within minutes).

---

## 🔒 Post-Setup Security Recommendations

> [!WARNING]
> Your AWS Root Account has unrestricted access to all resources and billing. If compromised, it can lead to massive unexpected charges. Follow these steps immediately after sign-up:

### 1. Enable Multi-Factor Authentication (MFA)
1. Log in to the [AWS Console](https://console.aws.amazon.com/) as the **Root User**.
2. Click your account name in the top right and select **My Security Credentials**.
3. Under **Multi-factor authentication (MFA)**, click **Assign MFA device**.
4. Choose an authenticator app (like Google Authenticator or Authy) on your phone and complete the setup.

### 2. Set Up a Billing Alarm
To avoid unexpected charges:
1. In the search bar at the top, search for **Billing**.
2. Click **Billing Preferences** on the left menu.
3. Check the box for **Receive Billing Alerts** and save.
4. Go to **CloudWatch** in the console.
5. Navigate to **Alarms** ➔ **All Alarms** ➔ **Create Alarm**.
6. Select the metric: **Billing** ➔ **Total Estimated Charge**.
7. Set the threshold (e.g., alert if estimated charges exceed $5.00) and link it to an email address via Amazon SNS.
