'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, User, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useRouter, usePathname } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [websiteId, setWebsiteId] = useState("");
  const [websites, setWebsites] = useState([]);
  const [currentWebsiteName, setCurrentWebsiteName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [testCases, setTestCases] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchWebsites();
  }, [pathname]);

  useEffect(() => {
    if (websiteId) {
      fetchTestCases(websiteId);
    }
  }, [websiteId]);

  const fetchWebsites = async () => {
    try {
      const response = await axios.get('/api/website');
      const userData = response.data;
      if (userData) {
        setWebsites(userData.websites);
        const id = pathname.split("/")[2];
        setWebsiteId(id);
        const currentWebsite = userData.websites.find((site) => site._id === id);
        if (currentWebsite) {
          setCurrentWebsiteName(currentWebsite.name);
        }
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  };

  const fetchTestCases = async (websiteId) => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/test-cases', { params: { websiteId } });
      setTestCases(response.data.map(tc => ({ ...tc, status: 'idle', lastRun: new Date(tc.lastRun).toLocaleString() })));
    } catch (error) {
      console.error('Error fetching test cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteChange = (newWebsiteId) => {
    router.push(`/dashboard/${newWebsiteId}`);
  };

  const runTestCases = async () => {
    setIsRunningTests(true);
    setProgress(0);
    const totalTests = testCases.length;
    let completedTests = 0;

    const updatedTestCases = [...testCases];

    for (let i = 0; i < updatedTestCases.length; i++) {
      updatedTestCases[i].status = 'running';
      setTestCases(updatedTestCases);

      // Simulate test running
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      updatedTestCases[i].status = Math.random() > 0.3 ? 'passed' : 'failed';
      updatedTestCases[i].lastRun = new Date().toLocaleString();
      completedTests++;
      setProgress((completedTests / totalTests) * 100);
      setTestCases([...updatedTestCases]);
    }

    setIsRunningTests(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link className="flex items-center space-x-2" href={`/dashboard/${websiteId}`}>
              <span className="text-2xl font-bold">Webster</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Select onValueChange={handleWebsiteChange} value={websiteId}>
              <SelectTrigger className="w-[200px]" id="website">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
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
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r bg-gray-50 dark:bg-gray-800 md:sticky md:block">
          <SidebarContent />
        </aside>
        <main className="flex w-full flex-col overflow-hidden p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">{currentWebsiteName} Dashboard</h2>
              <Button
                onClick={runTestCases}
                disabled={isRunningTests}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Run Test Cases
                  </>
                )}
              </Button>
            </div>

            {isRunningTests && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center mt-2">{Math.round(progress)}% Complete</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testCases.map((testCase) => (
                <Card key={testCase._id} className={`
                  overflow-hidden transition-all duration-300 hover:shadow-lg
                  ${testCase.status === 'passed' ? 'bg-green-50 dark:bg-green-900' : 
                    testCase.status === 'failed' ? 'bg-red-50 dark:bg-red-900' : 
                    'bg-white dark:bg-gray-800'}
                `}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {testCase.name}
                    </CardTitle>
                    {testCase.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {testCase.status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                    {testCase.status === 'running' && <Loader2 className="h-4 w-4 animate-spin" />}
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last Run: {testCase.lastRun}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}