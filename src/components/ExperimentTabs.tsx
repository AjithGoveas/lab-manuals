import { type ReactNode } from "react";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

interface ExperimentTabsProps {
  procedure: ReactNode;
  results: ReactNode;
  viva: ReactNode;
}

export default function ExperimentTabs({ procedure, results, viva }: ExperimentTabsProps) {
  return (
    <Tabs defaultValue="procedure" className="w-full">
      <TabsList className="mb-6">
        <TabsTab value="procedure">1.0 Theory & Code</TabsTab>
        <TabsTab value="results">2.0 Observation Results</TabsTab>
        <TabsTab value="viva">3.0 Viva Prep</TabsTab>
      </TabsList>

      <TabsPanel value="procedure">
        {procedure}
      </TabsPanel>

      <TabsPanel value="results">
        {results}
      </TabsPanel>

      <TabsPanel value="viva">
        {viva}
      </TabsPanel>
    </Tabs>
  );
}
