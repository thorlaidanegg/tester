"use client";

import { signIn } from "next-auth/react";
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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        toast({
          title: "Login Failed",
          description: "Email or Password is Wrong",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "An error occurred during Google sign-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              placeholder="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Log In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>or</span>
          <Button onClick={handleGoogleSignIn} variant="outline">
            Sign in with Google
          </Button>
          <Link href="/signup">Don't have an account? Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;