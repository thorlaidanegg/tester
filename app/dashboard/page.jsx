'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';


const WebsitesPage = () => {
  const [websites, setWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' });
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();  // Correct usage of Next.js router

  // Fetch all websites
  const fetchWebsites = async () => {
    try {
      const response = await axios.get('/api/website');
      const userData = response.data;

      // Access the 'websites' array from the user object
      if (userData && userData.websites) {
        setWebsites(userData.websites);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  };

  // Add a new website
  const addWebsite = async () => {
    try {
      await axios.post('/api/website', newWebsite);
      setNewWebsite({ name: '', url: '' }); // Reset form
      setIsAdding(false); // Hide add form
      fetchWebsites(); // Refresh website list
    } catch (error) {
      console.error('Error adding website:', error);
    }
  };

  // Delete a website
  const deleteWebsite = async (id) => {
    try {
      await axios.delete('/api/website', {
        data: { id },  // Send the ID in the request body
      });
      fetchWebsites(); // Refresh the website list after deletion
    } catch (error) {
      console.error('Error deleting website:', error);
    }
  };

  // Fetch websites when the component mounts
  useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <div>
      <h1>Websites</h1>

      {/* Display websites */}
      {websites.length > 0 ? (
        websites.map((website) => (
          <div key={website._id} className="website-item">
            <p><strong>Name:</strong> {website.name}</p>
            <p><strong>URL:</strong> {website.url}</p>
            <Button onClick={() => router.push(`/dashboard/${website._id}`)}>Open</Button>
            <Button onClick={() => deleteWebsite(website._id)}>Delete</Button>
          </div>
        ))
      ) : (
        <p>No websites available.</p>
      )}

      {/* Add new website */}
      {isAdding ? (
        <div className="add-website-form">
          <Input
            type="text"
            placeholder="Website Name"
            value={newWebsite.name}
            onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Website URL"
            value={newWebsite.url}
            onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
          />
          <Button onClick={addWebsite}>Add Website</Button>
          <Button variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)}>Add Website</Button>
      )}
    </div>
  );
};

export default WebsitesPage;
