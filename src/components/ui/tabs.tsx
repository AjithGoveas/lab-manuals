import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4 w-full", className)}
      {...props}
    />
  )
}

export function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("inline-flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border/60 self-start", className)}
      {...props}
    />
  )
}

export function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn("px-4 py-1.5 text-xs font-mono text-muted-foreground font-medium rounded-xl transition-all outline-none select-none hover:text-foreground data-selected:bg-card data-selected:text-foreground data-selected:shadow-xs cursor-pointer", className)}
      {...props}
    />
  )
}

export function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("outline-none mt-2", className)}
      {...props}
    />
  )
}
