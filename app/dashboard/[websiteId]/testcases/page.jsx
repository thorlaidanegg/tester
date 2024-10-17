'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Menu, User, Edit2, Save, X, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarContent from '@/components/Sidebar';

export default function TestCasesPage() {
  const { toast } = useToast();
  const [testCases, setTestCases] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [websiteId, setWebsiteId] = useState('');
  const [websites, setWebsites] = useState([]);
  const [currentWebsiteUrl, setCurrentWebsiteUrl] = useState('');
  const [currentWebsiteName, setCurrentWebsiteName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchWebsites();
  }, []);

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
          setCurrentWebsiteUrl(currentWebsite.url);
          setCurrentWebsiteName(currentWebsite.name);
        }
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast({
        title: "Error",
        description: "Failed to fetch websites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestCases = async (websiteId) => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/test-cases', { params: { websiteId } });
      setTestCases(response.data);
    } catch (error) {
      console.error('Error fetching test cases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch test cases",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openTestCaseRecording = async () => {
    try {
      const url = currentWebsiteUrl;
      await axios.get(`/api/start-recording?url=${encodeURIComponent(url)}`);
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Test case recording has begun",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    try {
      const response = await axios.post('/api/stop-recording', {
        websiteName: currentWebsiteName,
        websiteUrl: currentWebsiteUrl,
        websiteId,
      });

      if (response.status === 200) {
        setGeneratedScript(response.data.script);
        setIsRecording(false);
        fetchTestCases(websiteId);
        toast({
          title: "Recording Stopped",
          description: "Test case has been saved",
        });
      } else {
        console.error('Error stopping recording:', response.data.error);
        toast({
          title: "Error",
          description: "Failed to stop recording",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      if (error.response && error.response.status === 400) {
        setIsRecording(false);
      }
      fetchTestCases(websiteId);
      toast({
        title: "Error",
        description: "An error occurred while stopping the recording",
        variant: "destructive",
      });
    }
  };

  const handleWebsiteChange = (newWebsiteId) => {
    router.push(`/dashboard/${newWebsiteId}/testcases`);
  };

  const startEditingTestCase = (testCase) => {
    setEditingTestCase({ ...testCase });
  };

  const saveTestCaseName = async () => {
    try {
      await axios.put(`/api/test-cases`, {
        id: editingTestCase._id,
        name: editingTestCase.name,
      });
      setTestCases(testCases.map(tc => 
        tc._id === editingTestCase._id ? { ...editingTestCase } : tc
      ));
      setEditingTestCase(null);
      toast({
        title: "Success",
        description: "Test case name updated",
      });
    } catch (error) {
      console.error('Error updating test case name:', error);
      toast({
        title: "Error",
        description: "Failed to update test case name",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-800 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link className="flex items-center space-x-2 mx-5" href={`/dashboard/${websiteId}`}>
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
                <Button  className="relative h-8 w-8 rounded-full">
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

      <div className="flex-1 items-start md:grid md:grid-cols-[240px_1fr]">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r bg-gray-100 dark:bg-gray-800 md:sticky md:block">
          <SidebarContent />
        </aside>

        <main className="flex w-full flex-col overflow-hidden p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Test Cases</h2>
              <Button onClick={isRecording ? stopRecording : openTestCaseRecording} className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900">
                {isRecording ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add Test Case
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testCases.map((testCase) => (
                <Card key={testCase._id} className="overflow-hidden transition-shadow hover:shadow-lg dark:bg-gray-800">
                  <CardHeader className=" dark:bg-gray-700">
                    {editingTestCase && editingTestCase._id === testCase._id ? (
                      <div className="flex items-center">
                        <Input
                          value={editingTestCase.name}
                          onChange={(e) => setEditingTestCase({ ...editingTestCase, name: e.target.value })}
                          className="mr-2 flex-grow bg-white"
                        />
                        <Button size="icon" onClick={saveTestCaseName} className="mr-1">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingTestCase(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">{testCase.name}</CardTitle>
                        <Button size="icon" variant="ghost" onClick={() => startEditingTestCase(testCase)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[200px] w-full rounded-b-lg">
                      <pre className="p-4 text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">{testCase.script}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>

            {generatedScript && (
              <Card className="mt-8 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Generated Playwright Script</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border dark:border-gray-700">
                    <pre className="p-4 text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">{generatedScript}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}