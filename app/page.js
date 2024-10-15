'use client'

import React,{useState,useEffect} from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code, BarChart, Clock, Zap, Globe, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { signOut } from 'next-auth/react'


export default function LandingPage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const res = await axios.get("/api/isLoggedIn");
      console.log(res.data.status);
      setIsLoggedIn(res.data.status);
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  checkLoginStatus();
}, []);


  const handleClick = () => {

    if (isLoggedIn) {
      // If user is logged in, navigate to dashboard
      router.push('/dashboard')
    } else {
      // If user is not logged in, navigate to login
      router.push('/login')
    }
  }

  const router = new useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">WebTester</h1>
        </motion.div>
        {!isLoggedIn?(
          <div className="space-x-4">
            <Button variant="ghost" onClick={()=>{router.push('/login')}}>Log In</Button>
            <Button onClick={() => {router.push('/signup')}}>Sign Up</Button>  
          </div>
        ):(
          <div>
            <Button onClick={signOut}>SignOut</Button> 
          </div>
        )}
        
      </header>

      <main className="container mx-auto px-4 py-10 text-center">
        <motion.h2
          className="text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Revolutionize Your Web Testing
        </motion.h2>
        <motion.p
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Create, run, and schedule test cases with ease. Get comprehensive reports and never worry about manual testing again. Powered by Playwright for reliable and efficient testing.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button onClick={handleClick} size="lg" className="text-lg px-8 py-6">
            Go to Dashboard <ArrowRight className="ml-2" />
          </Button>
        </motion.div>

        <motion.div
          className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <FeatureCard
            icon={<Code size={40} />}
            title="Easy Test Creation"
            description="Create Playwright test cases quickly with our intuitive interface."
          />
          <FeatureCard
            icon={<Zap size={40} />}
            title="One-Click Execution"
            description="Run your Playwright tests with a single click in our browser environment."
          />
          <FeatureCard
            icon={<Clock size={40} />}
            title="Flexible Scheduling"
            description="Schedule tests to run automatically at set intervals."
          />
          <FeatureCard
            icon={<BarChart size={40} />}
            title="Comprehensive Reports"
            description="Get detailed reports and historical data for all your tests."
          />
        </motion.div>

        <motion.div
          className="mt-40"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-3xl font-bold mb-8">Why Choose WebTester?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe size={40} />}
              title="Cross-Browser Testing"
              description="Test your web applications across multiple browsers with Playwright's multi-browser support."
            />
            <FeatureCard
              icon={<Shield size={40} />}
              title="Reliable Tests"
              description="Playwright's auto-waiting mechanism ensures stable and reliable tests, reducing flakiness."
            />
            <FeatureCard
              icon={<Sparkles size={40} />}
              title="Modern Web Support"
              description="Test modern web apps with support for JavaScript, TypeScript, and popular frameworks."
            />
          </div>
        </motion.div>
      </main>

      <motion.div
        className="mt-40 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto px-4 pb-20 relative z-10">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="bg-muted p-2 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-sm font-medium">WebTester Browser</div>
            </div>
            <div className="p-4">
              <pre className="text-sm text-muted-foreground">
                <code>{`
// Sample Playwright Test Case
import { test, expect } from '@playwright/test';

test('login and check dashboard', async ({ page }) => {
  await page.goto('https://example.com/login');
  
  // Fill in login form
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');

  // Check if redirected to dashboard
  await expect(page).toHaveURL(/.*dashboard/);

  // Verify dashboard elements
  await expect(page.locator('h1')).toHaveText('Welcome to your Dashboard');
  await expect(page.locator('#user-info')).toContainText('testuser');

  // Check for specific dashboard widget
  const analyticsWidget = page.locator('#analytics-widget');
  await expect(analyticsWidget).toBeVisible();
  await expect(analyticsWidget).toContainText('Monthly Traffic');
});
                `}</code>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-muted py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using WebTester to streamline their testing process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-xs"
            />
            <Button size="lg">
              Start Free Trial
            </Button>
          </div>
        </div>
      </motion.div>

      <footer className="bg-background text-muted-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">WebTester</h4>
              <p className="text-sm">Revolutionizing web testing with automation and ease.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Features</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Use Cases</a></li>
                <li><a href="#" className="hover:text-primary">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">API Reference</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted text-center text-sm">
            <p>&copy; 2024 WebTester. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}