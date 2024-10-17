'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

export default function TestCasesPage() {
  const { toast } = useToast();
  const [testCases, setTestCases] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [websiteId , setWebsiteId] = useState()
  const [websites, setWebsites] = useState([]);
  const [currentWebsiteUrl , setCurrentWebsiteUrl] = useState()
  const [currentWebsiteName , setCurrentWebsiteName] = useState()
  // const websiteId = '670cf0dbef03e1ca43c3f784'; // Example hardcoded website ID

  useEffect(() => {
    fetchWebsites();
  },[])

  useEffect(() => {
    if (websiteId) {
      fetchTestCases(websiteId);
    }
  }, [websiteId]);

  const fetchTestCases = async (websiteId) => {
    try {
      const response = await axios.get('/api/test-cases', { params: { websiteId } });
      setTestCases(response.data);
    } catch (error) {
      console.error('Error fetching test cases:', error);
      // toast.error('Failed to fetch test cases');
    }
  };

  const openTestCaseRecording = async () => {
    try {
      const url = currentWebsiteUrl || 'https://medlr.in'; // The website you want to test
      const response = await axios.get(`/api/start-recording?url=${encodeURIComponent(url)}`);
      setIsRecording(true);
      // toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      // toast.error('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const response = await axios.get(`/api/stop-recording/${currentWebsiteName}/${currentWebsiteUrl}`);
      if (response.status === 200) {
        setGeneratedScript(response.data.script);
        console.log(response.data.script)
        setIsRecording(false);
        // toast.success('Recording stopped and saved');
        // Fetch updated test cases after stopping recording
        fetchTestCases(websiteId);
      } else {
        console.error('Error stopping recording:', response.data.error);
        // toast.error('Failed to stop recording');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      if (error.response && error.response.status === 400) {
        // toast.error('Recording process not found. The browser might have been closed.');
        setIsRecording(false);
      } else {
        // toast.error('Failed to stop recording');
      }
      // Fetch test cases anyway, in case a new one was saved
      fetchTestCases(websiteId);
    }
  };

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
          setCurrentWebsiteUrl(currentWebsite.url); // Set current website name
        }
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  };

  return (
    <div>
      <header>
        <h2>Test Cases</h2>
        <Button onClick={isRecording ? stopRecording : openTestCaseRecording}>
          {isRecording ? 'Stop Recording' : <><Plus /> Add Test Case</>}
        </Button>
      </header>

      <div>
        {testCases.map((testCase) => (  
          <div key={testCase._id}>
            <h3>{testCase.name}</h3>
            <pre>{testCase.script}</pre>
          </div>
        ))}
      </div>

      {generatedScript && (
        <div>
          <h3>Generated Playwright Script:</h3>
          {/* <pre>{generatedScript}</pre> */}
        </div>
      )}
    </div>
  );
}