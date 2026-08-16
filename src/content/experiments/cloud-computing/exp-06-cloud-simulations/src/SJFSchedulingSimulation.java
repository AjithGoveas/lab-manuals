import org.cloudbus.cloudsim.*;
import org.cloudbus.cloudsim.core.CloudSim;
import org.cloudbus.cloudsim.provisioners.BwProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.PeProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.RamProvisionerSimple;

import java.text.DecimalFormat;
import java.util.*;

/**
 * A CloudSim example showing how to create a custom DatacenterBroker
 * implementing the Shortest Job First (SJF) scheduling policy.
 */
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
