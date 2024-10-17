'use client';

import * as React from "react";
import { ChevronDown, Menu, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useRouter } from "next/navigation"; // for programmatic navigation
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [websiteId, setWebsiteId] = React.useState("");
  const [websites, setWebsites] = React.useState([]);
  const [currentWebsiteName, setCurrentWebsiteName] = React.useState("");
  const pathname = usePathname();
  const router = useRouter(); // for changing route

  const fetchWebsites = async () => {
    try {
      const response = await axios.get('/api/website');
      const userData = response.data;
      if (userData) {
        setWebsites(userData.websites);
        const id = pathname.split("/")[2]; // Assuming the ID is part of the URL
        setWebsiteId(id); // Update websiteId based on current URL
        // Find the current website name based on the URL ID
        const currentWebsite = userData.websites.find((site) => site._id === id);
        if (currentWebsite) {
          setCurrentWebsiteName(currentWebsite.name); // Set current website name
        }
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  };

  React.useEffect(() => {
    fetchWebsites();
  }, [pathname]); // Re-run the effect when the pathname changes

  const handleWebsiteChange = (newWebsiteId) => {
    router.push(`/dashboard/${newWebsiteId}`); // Change the route to the new website ID
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href={`/dashboard/${websiteId}`}>
              <span className="hidden text-xl font-bold sm:inline-block mx-10">Webster</span>
            </Link>
          </div>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SidebarContent id={websiteId} />
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-between space-x-5 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Select onValueChange={handleWebsiteChange}>
                <SelectTrigger className="w-full md:w-[200px]" id="website">
                  <SelectValue placeholder={currentWebsiteName || "Select Website"} />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((website) => (
                    <SelectItem key={website._id} value={website._id}>
                      {website.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant=""
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr]">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <SidebarContent />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="container relative">
            <section className="mx-auto py-8 sm:py-16 lg:py-20">
              <h2 className="text-3xl font-bold tracking-tight">{currentWebsiteName}</h2>
              <p className="mt-4 text-muted-foreground">
                Your main dashboard content goes here. You can add charts, tables, or any other
                components as needed.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
