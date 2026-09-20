import { Bell, Home, Mail, User, FileText, Lock, type LucideIcon } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

function DefaultDemo() {
  const tabs: { title: string; icon: LucideIcon }[] = [
    { title: "Dashboard", icon: Home },
    { title: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs tabs={tabs} />
    </div>
  );
}

function CustomColorDemo() {
  const tabs: { title: string; icon: LucideIcon }[] = [
    { title: "Profile", icon: User },
    { title: "Messages", icon: Mail },
    { title: "Documents", icon: FileText },
    { title: "Privacy", icon: Lock },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs
        tabs={tabs}
        activeColor="text-blue-500"
        className="border-blue-200 dark:border-blue-800"
      />
    </div>
  );
}

export { DefaultDemo, CustomColorDemo };
