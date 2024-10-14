'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function WebsitesPage() {
  const [websites, setWebsites] = useState([])
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const fetchWebsites = async () => {
    try {
      const response = await axios.get('/api/website')
      const userData = response.data
      if (userData && userData.websites) {
        setWebsites(userData.websites)
      }
    } catch (error) {
      console.error('Error fetching websites:', error)
    }
  }

  const addWebsite = async () => {
    try {
      await axios.post('/api/website', newWebsite)
      setNewWebsite({ name: '', url: '' })
      setIsDialogOpen(false)
      fetchWebsites()
    } catch (error) {
      console.error('Error adding website:', error)
    }
  }

  const deleteWebsite = async (id) => {
    try {
      await axios.delete('/api/website', { data: { id } })
      fetchWebsites()
    } catch (error) {
      console.error('Error deleting website:', error)
    }
  }

  useEffect(() => {
    fetchWebsites()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Websites</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Website
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Website</DialogTitle>
              <DialogDescription>
                Enter the details of the website you want to add for testing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addWebsite}>Add Website</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {websites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-xl mb-4">You haven't added any websites yet.</p>
            <p className="text-muted-foreground mb-6">Let's add a website to start testing!</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Website
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <Card key={website._id}>
              <CardHeader>
                <CardTitle>{website.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">{website.url}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/dashboard/${website._id}`)}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Open
                </Button>
                <Button variant="destructive" onClick={() => deleteWebsite(website._id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}