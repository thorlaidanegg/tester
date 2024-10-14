import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarContent = () => {
  const pathname = usePathname(); // Get the current route

  // Extract the base route (everything before the last segment)
  const basePath = pathname.split('/').slice(0, 3).join('/');

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 font-medium text-md">
          <Link
            href={`${basePath}/testcases`}  // Replace the last segment with 'testcases'
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            Test Cases
          </Link>
          <Link
            href={`${basePath}/history`}  // Replace the last segment with 'history'
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            History
          </Link>
          <Link
            href={`${basePath}/schedule`}  // Replace the last segment with 'schedule'
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            Schedule
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default SidebarContent;
