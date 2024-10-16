'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TestCasesPage() {
  const [testCases, setTestCases] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const websiteId = '670cf0dbef03e1ca43c3f784'; // Example hardcoded website ID

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
    }
  };

  const openTestCaseRecording = async () => {
    try {
      const url = 'https://medlr.in'; // The website you want to test
      const response = await axios.get(`/api/start-recording?url=${encodeURIComponent(url)}`);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

const stopRecording = async () => {
  try {
    const response = await axios.get('/api/stop-recording');
    if (response.status === 200) {
      setGeneratedScript(response.data.script); // Store the script in state
      setIsRecording(false);
    } else {
      console.error('Error stopping recording:', response.data.error);
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
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
            <p>{testCase.script}</p>
          </div>
        ))}
      </div>

      {/* Display generated Playwright script */}
      {generatedScript && (
        <div>
          <h3>Generated Playwright Script:</h3>
          <pre>{generatedScript}</pre>
        </div>
      )}
    </div>
  );
}
