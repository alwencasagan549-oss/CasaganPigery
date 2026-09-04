import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sprout, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate("/admin");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm px-6 relative">
      <div className="absolute top-8 left-8 z-50">
        <a href="/" className="inline-flex items-center gap-2 text-leaf font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft className="size-4" /> Return to Homepage
        </a>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/assets/logo.png" className="size-32 opacity-10 object-contain" alt="Logo" />
      </div>
      <div className="w-full max-w-md animate-fade-in z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="size-16 rounded-full overflow-hidden shadow-leaf mb-4">
            <img src="/assets/logo.png" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <h1 className="font-display text-3xl font-bold text-leaf">CasaganPigery</h1>
          <p className="text-rattan font-medium uppercase tracking-widest text-xs mt-2">Admin Portal</p>
        </div>

        <Card className="border-straw shadow-card overflow-hidden">
          <CardHeader className="bg-white">
            <CardTitle className="text-earth font-display text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-earth/60">
              Sign in to manage your farm inventory and inquiries.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-6 bg-white">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-leaf font-semibold">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@casaganpigery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-sun/30 border-straw focus-visible:ring-leaf"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-leaf font-semibold">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-sun/30 border-straw focus-visible:ring-leaf"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-white pb-8">
              <Button 
                type="submit" 
                className="w-full bg-leaf hover:bg-leaf-deep text-sun font-semibold py-6 rounded-xl shadow-soft hover:shadow-leaf transition-all flex gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="size-5" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-earth/40 text-sm">
          &copy; {new Date().getFullYear()} CasaganPigery Farm. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
