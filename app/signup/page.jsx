"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please provide all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        router.push("/login");
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "An error occurred during signup",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-up error:", error);
      toast({
        title: "Error",
        description: "An error occurred during Google sign-up",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              placeholder="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>or</span>
          <Button onClick={handleGoogleSignUp} variant="outline">
            Sign up with Google
          </Button>
          <Link href="/login">Already have an account? Log In</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;