'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import Link from "next/link"
import { Plus, Trash2, Code, Menu, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import SidebarContent from '@/components/Sidebar'

export default function TestCasesPage() {
  const [websiteId, setWebsiteId] = useState("")
  const [testCases, setTestCases] = useState([])
  const [newTestCase, setNewTestCase] = useState({ name: "", script: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const pathname = usePathname()

  useEffect(() => {
    const id = pathname.split("/")[2]
    setWebsiteId(id)
    if (id) {
      fetchTestCases(id)
    }
  }, [pathname])

  const fetchTestCases = async (websiteId) => {
    try {
      const response = await axios.get('/api/test-cases', { params: { websiteId } })
      setTestCases(response.data)
    } catch (error) {
      console.error("Error fetching test cases:", error)
    }
  }

  const addTestCase = async () => {
    try {
      await axios.post('/api/test-cases', {
        name: newTestCase.name,
        script: newTestCase.script,
        websiteId,
      })
      fetchTestCases(websiteId)
      setNewTestCase({ name: "", script: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding test case:", error)
    }
  }

  const deleteTestCase = async (testCaseId) => {
    try {
      await axios.delete('/api/test-cases', {
        data: { id: testCaseId, websiteId },
      })
      fetchTestCases(websiteId)
    } catch (error) {
      console.error("Error deleting test case:", error)
    }
  }

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
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-between space-x-5 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Select>
                <SelectTrigger className="w-full md:w-[200px]" id="website">
                  <SelectValue placeholder="Select Website" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website1">Website 1</SelectItem>
                  <SelectItem value="website2">Website 2</SelectItem>
                  <SelectItem value="website3">Website 3</SelectItem>
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
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Test Cases</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Test Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Test Case</DialogTitle>
                      <DialogDescription>
                        Create a new test case for your website. Add a name and the test script.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                          Name
                        </label>
                        <Input
                          id="name"
                          value={newTestCase.name}
                          onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="script" className="text-right">
                          Script
                        </label>
                        <Textarea
                          id="script"
                          value={newTestCase.script}
                          onChange={(e) => setNewTestCase({ ...newTestCase, script: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addTestCase}>Add Test Case</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {testCases.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-xl mb-4">No test cases found for this website.</p>
                    <p className="text-muted-foreground mb-6">Start by adding your first test case!</p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Test Case
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {testCases.map((testCase) => (
                    <Card key={testCase._id}>
                      <CardHeader>
                        <CardTitle>{testCase.name}</CardTitle>
                        <CardDescription>Test Case ID: {testCase._id}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4" />
                          <p className="text-sm text-muted-foreground">Script Preview</p>
                        </div>
                        <pre className="mt-2 rounded bg-muted p-4 text-sm">
                          {testCase.script.length > 100
                            ? `${testCase.script.slice(0, 100)}...`
                            : testCase.script}
                        </pre>
                      </CardContent>
                      <CardFooter>
                        <Button variant="destructive" onClick={() => deleteTestCase(testCase._id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}