import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, History, Calendar } from 'lucide-react';

const SidebarContent = () => {
  const pathname = usePathname();
  const basePath = pathname.split('/').slice(0, 3).join('/');

  const isActive = (path) => pathname.includes(path);

  const navItems = [
    { href: `${basePath}/testcases`, label: 'Test Cases', icon: FileText },
    { href: `${basePath}/history`, label: 'History', icon: History },
    { href: `${basePath}/schedule`, label: 'Schedule', icon: Calendar },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-black ${
                isActive(item.href)
                  ? 'bg-blue-50 text-black'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarContent;