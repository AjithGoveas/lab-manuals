---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 6
title: "Cloud Infrastructure Simulation & Scheduling"
description: "Model cloud infrastructure datacenters, hosts, virtual machines, and cloudlets, and run resource scheduling simulations using the CloudSim framework in Java."
tags: ["CloudSim", "Simulation", "Resource Scheduling", "Java", "SaaS"]
dataset: "CloudSim Engine"
vivaQuestions:
  - question: "What is a Cloudlet in CloudSim?"
    answer: "A Cloudlet is a model of an application task that runs on a Virtual Machine. It tracks CPU instruction lengths, file input/output sizes, and resource utilization models."
  - question: "What are *CloudletSchedulerSpaceShared* and *CloudletSchedulerTimeShared*?"
    answer: "Space Shared: Tasks run one at a time on a VM processing unit. If another task arrives, it must wait in a queue until the current one finishes. Time Shared: Multiple tasks execute concurrently by sharing the CPU clock cycles (round-robin multiplexing)."
  - question: "What is the advantage of using a Shortest Job First (SJF) scheduler in clouds?"
    answer: "It minimizes the average waiting time for tasks. However, it can lead to starvation for long-running tasks if shorter tasks keep arriving."
  - question: "Why is it important to simulate Cloud environments instead of deploying directly to testing nodes?"
    answer: "Simulation lets researchers and operators test edge-case scheduling logic, massive scaling (e.g., thousands of VMs), and failure tolerance repeatedly without running up massive real-world cloud server bills or provisioning physical networking hardware."
---

| Option | Value |
| :--- | :--- |
| **Prerequisites** | Java Development Kit (JDK 8 or higher), Eclipse IDE or VS Code |
| **Estimated Time**| 45 minutes |
| **Technology** | Java, CloudSim 3.0.3 Simulation Framework |

---

## 🎯 Aim
To simulate a cloud computing environment using the **CloudSim** simulation framework in Eclipse/VS Code, and implement/run a scheduling algorithm (such as Shortest Job First - SJF) that is not pre-packaged in CloudSim.

---

## 📖 Theoretical Background

### Cloud Simulation
Setting up a physical cloud infrastructure for testing and evaluating resource provisioning or scheduling algorithms is highly expensive and time-consuming. **CloudSim** is a library for simulation of cloud scenarios. It supports modeling of data centers, virtual machines (VMs), brokers, hosts, and cloudlets (application tasks).

### Key Entities in CloudSim:
1. **CloudSim**: Initializes and controls the execution of the simulation.
2. **Datacenter**: Represents the cloud hardware infrastructure (hosts, storage, memory, bandwidth).
3. **DatacenterBroker**: Acts on behalf of the customer, negotiating with cloud providers and submitting VMs and Cloudlets for execution.
4. **VM (Virtual Machine)**: Represents the virtualized hardware running on hosts.
5. **Cloudlet**: Represents the application tasks/jobs submitted to the cloud for execution.
6. **CloudletScheduler**: Dictates how multiple tasks share CPU time inside a VM (e.g., Space Shared, Time Shared).

### Custom Scheduling: Shortest Job First (SJF)
By default, CloudSim provides Time-Shared and Space-Shared scheduling policies. In this experiment, we implement a **Shortest Job First (SJF)** scheduling broker. The SJF scheduler sorts the incoming cloudlets based on their lengths (computational sizes) in ascending order before assigning them to the virtual machines, minimizing the average waiting time.

---

## 🛠️ Requirements & Setup

### Step 1: Download CloudSim
1. Download CloudSim project files (JARs and source code) from the official [CloudSim GitHub Releases](https://github.com/Cloudslab/CloudSim/releases) or source repository.
2. Unzip the downloaded archive (e.g., `cloudsim-3.0.3.tar.gz`).

> [!NOTE]
> The unzipped CloudSim directory contains a dedicated `examples/` folder. This folder includes official sample codes (like `CloudSimExample1.java` to `CloudSimExample8.java`) which are excellent resources for understanding basic to advanced cloud simulations.


### Step 2: Open and Configure Project in Eclipse
1. Open Eclipse IDE.
2. Create a new Java Project: **File** ➔ **New** ➔ **Java Project**. Name it `CloudSimLabs`.
3. Right-click the project folder in Eclipse ➔ **Build Path** ➔ **Configure Build Path**.
4. Go to the **Libraries** tab, click **Add External JARs**, and select the CloudSim jar files (e.g., `cloudsim-3.0.3.jar` and dependencies like `commons-math3`).

---

## 🚶 Step-by-Step Procedure

### 1. Structure of a CloudSim Simulation Code
Every CloudSim simulation follows a standard lifecycle:
1. **Initialize the CloudSim library**:
   ```java
   int num_user = 1;
   Calendar calendar = Calendar.getInstance();
   boolean trace_flag = false;
   CloudSim.init(num_user, calendar, trace_flag);
   ```
2. **Create Datacenters**: Resources that host the virtual machines.
3. **Create Datacenter Broker**: The scheduling entity that submits VMs and schedules tasks.
4. **Create Virtual Machines (VMs)**:
   ```java
   Vm vm = new Vm(vmid, brokerId, mips, pesNumber, ram, bw, size, vmm, new CloudletSchedulerTimeShared());
   ```
5. **Create Cloudlets (Tasks)**:
   ```java
   Cloudlet cloudlet = new Cloudlet(id, length, pesNumber, fileSize, outputSize, utilizationModel, utilizationModel, utilizationModel);
   ```
6. **Register entities**: Submit VM and Cloudlet lists to the broker.
7. **Start & Stop Simulation**:
   ```java
   CloudSim.startSimulation();
   CloudSim.stopSimulation();
   ```

---

### 2. Implementing the Custom Shortest Job First (SJF) Scheduler
We can implement the SJF scheduling logic inside a custom broker class extending `DatacenterBroker`. Before executing, it sorts the cloudlets by length.

Save the following source code in your project under `src/SJFSchedulingSimulation.java`:

```java
import org.cloudbus.cloudsim.*;
import org.cloudbus.cloudsim.core.CloudSim;
import org.cloudbus.cloudsim.provisioners.BwProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.PeProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.RamProvisionerSimple;

import java.text.DecimalFormat;
import java.util.*;

// Custom Broker implementing Shortest Job First (SJF) Cloudlet Scheduling
class SJFBroker extends DatacenterBroker {
    
    public SJFBroker(String name) throws Exception {
        super(name);
    }

    // Overriding the method to sort cloudlets by length before submission
    @Override
    public void submitCloudletList(List<? extends Cloudlet> list) {
        // Create a modifiable copy of the cloudlet list
        List<Cloudlet> sortedList = new ArrayList<>(list);
        
        // Sort based on cloudlet length (Shortest Job First)
        sortedList.sort(Comparator.comparingLong(Cloudlet::getCloudletLength));
        
        System.out.println("\n[SJF Broker] Sorting Cloudlets by length (Shortest Job First):");
        for (Cloudlet c : sortedList) {
            System.out.println(" - Cloudlet ID " + c.getCloudletId() + " (Length: " + c.getCloudletLength() + ")");
        }
        System.out.println();
        
        super.submitCloudletList(sortedList);
    }
}

public class SJFSchedulingSimulation {
    private static List<Cloudlet> cloudletList;
    private static List<Vm> vmList;

    public static void main(String[] args) {
        System.out.println("Starting Shortest Job First (SJF) Simulation...");

        try {
            // Step 1: Initialize CloudSim
            int num_user = 1;
            Calendar calendar = Calendar.getInstance();
            boolean trace_flag = false;
            CloudSim.init(num_user, calendar, trace_flag);

            // Step 2: Create Datacenter
            Datacenter datacenter0 = createDatacenter("Datacenter_0");

            // Step 3: Create Custom SJF Broker
            SJFBroker broker = new SJFBroker("SJF_Broker");
            int brokerId = broker.getId();

            // Step 4: Create Virtual Machines
            vmList = new ArrayList<Vm>();
            int vmid = 0;
            int mips = 250;
            long size = 10000; // image size (MB)
            int ram = 512; // vm memory (MB)
            long bw = 1000;
            int pesNumber = 1; // number of CPUs
            String vmm = "Xen";

            Vm vm0 = new Vm(vmid, brokerId, mips, pesNumber, ram, bw, size, vmm, new CloudletSchedulerSpaceShared());
            vmList.add(vm0);
            broker.submitVmList(vmList);

            // Step 5: Create Cloudlets (Tasks) of different lengths
            cloudletList = new ArrayList<Cloudlet>();
            long fileSize = 300;
            long outputSize = 300;
            UtilizationModel utilizationModel = new UtilizationModelFull();

            // Cloudlets with varying lengths (Execution time will be proportional)
            Cloudlet c1 = new Cloudlet(0, 40000, pesNumber, fileSize, outputSize, utilizationModel, utilizationModel, utilizationModel);
            c1.setUserId(brokerId);
            
            Cloudlet c2 = new Cloudlet(1, 10000, pesNumber, fileSize, outputSize, utilizationModel, utilizationModel, utilizationModel);
            c2.setUserId(brokerId);
            
            Cloudlet c3 = new Cloudlet(2, 20000, pesNumber, fileSize, outputSize, utilizationModel, utilizationModel, utilizationModel);
            c3.setUserId(brokerId);

            cloudletList.add(c1);
            cloudletList.add(c2);
            cloudletList.add(c3);

            // Step 6: Submit cloudlet list to the broker (SJF Broker will sort them)
            broker.submitCloudletList(cloudletList);

            // Step 7: Start Simulation
            CloudSim.startSimulation();

            // Step 8: Stop Simulation
            CloudSim.stopSimulation();

            // Print results
            List<Cloudlet> newList = broker.getCloudletReceivedList();
            printCloudletList(newList);

            System.out.println("SJF Simulation finished!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Simulation failed due to an error.");
        }
    }

    private static Datacenter createDatacenter(String name) {
        List<Host> hostList = new ArrayList<Host>();
        List<Pe> peList = new ArrayList<Pe>();

        int mips = 1000;
        peList.add(new Pe(0, new PeProvisionerSimple(mips)));

        int hostId = 0;
        int ram = 2048; // host memory (MB)
        long storage = 1000000; // host storage
        int bw = 10000;

        hostList.add(new Host(
                hostId,
                new RamProvisionerSimple(ram),
                new BwProvisionerSimple(bw),
                storage,
                peList,
                new VmSchedulerTimeShared(peList)
        ));

        String arch = "x86";
        String os = "Linux";
        String vmm = "Xen";
        double time_zone = 10.0;
        double cost = 3.0;
        double costPerMem = 0.05;
        double costPerStorage = 0.001;
        double costPerBw = 0.0;

        DatacenterCharacteristics characteristics = new DatacenterCharacteristics(
                arch, os, vmm, hostList, time_zone, cost, costPerMem, costPerStorage, costPerBw
        );

        Datacenter datacenter = null;
        try {
            datacenter = new Datacenter(name, characteristics, new VmAllocationPolicySimple(hostList), new LinkedList<Storage>(), 0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return datacenter;
    }

    private static void printCloudletList(List<Cloudlet> list) {
        String indent = "    ";
        System.out.println();
        System.out.println("========== OUTPUT ==========");
        System.out.println("Cloudlet ID" + indent + "STATUS" + indent + "Data Center ID" + indent + "VM ID" + indent + "Time" + indent + "Start Time" + indent + "Finish Time");

        DecimalFormat dft = new DecimalFormat("###.##");
        for (Cloudlet cloudlet : list) {
            System.out.print(indent + cloudlet.getCloudletId() + indent + indent);

            if (cloudlet.getCloudletStatus() == Cloudlet.SUCCESS) {
                System.out.print("SUCCESS");
                System.out.println(indent + indent + cloudlet.getResourceId() + indent + indent + indent + cloudlet.getVmId() + indent + indent + dft.format(cloudlet.getActualCPUTime()) + indent + indent + dft.format(cloudlet.getExecStartTime()) + indent + indent + dft.format(cloudlet.getFinishTime()));
            }
        }
    }
}
```

---

## 🧪 Expected Output & Verification
When you run the above file in Eclipse/VS Code, the console output will verify that **SJF sorting** is successful and tasks are executed in order of increasing length:

```text
Starting Shortest Job First (SJF) Simulation...
Initialising...
Starting CloudSim version 3.0
Datacenter_0 is starting...
Broker is starting...
Entities started.

[SJF Broker] Sorting Cloudlets by length (Shortest Job First):
 - Cloudlet ID 1 (Length: 10000)
 - Cloudlet ID 2 (Length: 20000)
 - Cloudlet ID 0 (Length: 40000)

SJF_Broker: Cloud Resource List received with 1 resource(s)
0.0: SJF_Broker: Trying to Create VM #0 in Datacenter_0
0.1: SJF_Broker: VM #0 has been created in Datacenter #2, Host #0
0.1: SJF_Broker: Sending cloudlet 1 to VM #0
0.1: SJF_Broker: Sending cloudlet 2 to VM #0
0.1: SJF_Broker: Sending cloudlet 0 to VM #0
...
========== OUTPUT ==========
Cloudlet ID    STATUS    Data Center ID    VM ID    Time    Start Time    Finish Time
    1          SUCCESS        2             0        40         0.1          40.1
    2          SUCCESS        2             0        80         40.1         120.1
    0          SUCCESS        2             0        160        120.1        280.1
SJF Simulation finished!
```


