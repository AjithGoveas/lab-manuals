---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 1
title: "Virtualization - Hypervisor & Guest OS Setup"
description: "Download, install, and configure a Type-2 hypervisor (Oracle VM VirtualBox) and install a guest Linux Operating System (Ubuntu)."
tags: ["Virtualization", "Hypervisor", "VirtualBox", "Ubuntu"]
dataset: "Local Host"
vivaQuestions:
  - question: "What is the difference between a Type-1 and Type-2 hypervisor?"
    answer: "Type-1 hypervisors run directly on the physical hardware, offering better performance and efficiency. Type-2 hypervisors run on top of an operating system, making them easier to set up and ideal for testing or laboratory tasks."
  - question: "What does a guest OS mean in virtualization?"
    answer: "The guest operating system is the OS installed inside the virtual machine, running isolated from the host OS."
  - question: "What is a virtual disk (*.vdi* or *.vmdk*)?"
    answer: "It is a file on the host machine's physical storage that behaves like a physical hard drive to the virtual machine."
  - question: "Why is virtualization important for Cloud Computing?"
    answer: "It enables multitenancy, resource pooling, rapid scaling, and migration of services without worrying about underlying physical hardware changes."
---

![Oracle VM VirtualBox Logo](./image.png)

| Option | Value |
| :--- | :--- |
| **Prerequisites** | A 64-bit host computer, VirtualBox installer, Ubuntu Desktop ISO image |
| **Estimated Time**| 45 minutes |
| **Technology** | Oracle VM VirtualBox, Linux (Ubuntu Desktop/Server) |

---

## 🎯 Aim
To download, install, and configure a Type-2 hypervisor (Oracle VM VirtualBox) and install a guest Linux Operating System (Ubuntu) on top of a Windows host machine.

---

## 📖 Theoretical Background

### Virtualization
Virtualization is the process of creating a software-based (virtual) representation of something physical, such as virtual applications, servers, storage, and networks. It is the core technology powering cloud computing.

### Hypervisor
A **hypervisor** (or Virtual Machine Monitor, VMM) is software that creates and runs virtual machines (VMs). 
* **Type-1 (Bare-Metal)**: Runs directly on the host's hardware (e.g., VMware ESXi, Microsoft Hyper-V).
* **Type-2 (Hosted)**: Runs as an application on top of an existing Operating System (e.g., VirtualBox, VMware Workstation). This lab uses VirtualBox, a Type-2 hypervisor.

```mermaid
graph TD
    subgraph Type-2 Hypervisor Architecture
        A[Hardware] --> B[Host OS: e.g., Windows]
        B --> C[Hypervisor: VirtualBox]
        C --> D[Guest VM 1: Ubuntu Linux]
        C --> E[Guest VM 2: Windows OS]
    end
```

---

## 🛠️ Requirements & Setup
1. **VirtualBox Installer**: Download from the official [VirtualBox Downloads Page](https://www.virtualbox.org/wiki/Downloads) (Select *Windows hosts*).
2. **Guest OS ISO**: Download the [Ubuntu Desktop LTS ISO](https://ubuntu.com/download/desktop).

---

## 🚶 Step-by-Step Procedure

### Phase A: Installing Oracle VM VirtualBox
1. Double-click the downloaded VirtualBox installer executable. On the **Welcome to the Oracle VM VirtualBox Setup Wizard** screen, click **Next**.
   
   ![VirtualBox Setup Step 1](./step_1.png)

2. Keep the default installation features and path unchanged, then click **Next**.
   
   ![VirtualBox Setup Step 2](./step_2.png)

3. Review the shortcut preferences and settings, and click **Next**.
   
   ![VirtualBox Setup Step 3](./step_3.png)

4. A warning about **Network Interfaces** will appear (temporary disconnect during virtual interface setup). Click **Yes** to proceed.
   
   ![VirtualBox Setup Step 4](./step_4.png)

5. Click **Install** to begin the installation process.
   
   ![VirtualBox Setup Step 5](./step_5.png)

6. Once the installation is complete, click **Finish**. The VirtualBox shortcut icon will now appear on your desktop.
   
   ![VirtualBox Setup Complete](./image.png)

---

### Phase B: Creating a New Virtual Machine
1. Open VirtualBox and click the **New** button (Blue Ribbon icon) at the top.
2. In the **Create Virtual Machine** dialog, configure the following details:
   - **Name**: `Ubuntu-Lab`
   - **Folder**: Select the location to store VM files (default is usually fine).
   - **ISO Image**: Browse and select the downloaded Ubuntu ISO file.
   - **Type**: `Linux`
   - **Version**: `Ubuntu (64-bit)`
   - *Optional:* You can check **Skip unattended installation** if you want to manually run through the OS setup screens. Click **Next**.
3. **Hardware Configuration**:
   - **Base Memory (RAM)**: Allocate at least `2048 MB` (2 GB) or `4099 MB` (4 GB) if your host system allows.
   - **Processors**: Assign at least `2 CPUs`. Click **Next**.
4. **Virtual Hard disk**:
   - Select **Create a Virtual Hard Disk Now**.
   - Allocate at least `25 GB` of disk size (dynamically allocated is default and recommended). Click **Next**.
5. Review the summary and click **Finish**.

### Phase C: Installing the Guest OS (Ubuntu)
1. Select your new VM from the left panel and click **Start** (Green arrow).
2. The VM will boot from the ISO. In the GRUB menu, select **Try or Install Ubuntu** and hit Enter.
3. Once the installer loads, select your preferred language and click **Install Ubuntu**.
4. Choose keyboard layout (Default: English US) and click **Continue**.
5. Select **Normal Installation** and check **Download updates while installing Ubuntu**. Click **Continue**.
6. Select **Erase disk and install Ubuntu** (This only erases the virtual hard disk created in Phase B, not your Windows drive). Click **Install Now** and confirm the write changes dialog.
7. Choose your timezone and click **Continue**.
8. Set up your user credentials:
   - **Your Name**: `Lab Student`
   - **Computer Name**: `ubuntu-vm`
   - **Username**: `student`
   - **Password**: Set a secure password.
9. Click **Continue** and wait for the installation to complete.
10. Once prompted, click **Restart Now** and press Enter when asked to remove the installation medium.

---

## 🧪 Expected Output & Verification
- Upon restart, the Ubuntu login screen will load.
- Log in with the password you configured.
- Open a web browser or terminal (`Ctrl` + `Alt` + `T`) inside the virtual machine to verify internet connectivity.


