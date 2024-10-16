// /app/playwright-recorder/[id]/page.jsx
'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const PlaywrightRecorder = ({ params }) => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');  // Retrieve the URL from query params

  useEffect(() => {
    // Open the user's provided URL inside an iframe or handle the Playwright recording here
    console.log('Recording actions for URL:', url);

    // You can either:
    // 1. Show the URL inside an iframe for the user to interact with
    // 2. Trigger Playwright script recording if you're using Playwright with a Node.js server
    
    // Example (for displaying the website in an iframe):
    if (url) {
      window.location.href = url; // or you can redirect this to the user's specified URL
    }
  }, [url]);

  return (
    <div>
      <h1>Recording actions for website: {url}</h1>
      {/* Display or handle the Playwright logic */}
    </div>
  );
};

export default PlaywrightRecorder;
