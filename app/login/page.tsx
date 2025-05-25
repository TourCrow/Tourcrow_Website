"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show loading if auth is still checking
  if (loading) {
    return (
      <AuthLayout title="Loading..." subtitle="Checking authentication status">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
        </div>
      </AuthLayout>
    );
  }

  // Don't render if user is logged in (will redirect)
  if (user) {
    return null;
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setError(error.message);
      } else {
        // Success - AuthContext will handle the state update
        // No need to manually redirect, useEffect will handle it
        console.log("Login successful", data);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    setResetError("");
    setIsResetLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        setResetError(error.message);
      } else {
        setResetMsg("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      setResetError("An unexpected error occurred");
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={showForgot ? "Reset Password" : "Welcome Back"} 
      subtitle={showForgot ? "Enter your email to receive a reset link" : "Sign in to your account"}
    >
      {showForgot ? (
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <AuthInput
            type="email"
            placeholder="Enter your email address"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            error={resetError}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
            required
          />
          
          {resetMsg && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {resetMsg}
              </div>
            </div>
          )}
          
          <AuthButton type="submit" isLoading={isResetLoading} className="w-full">
            Send Reset Link
          </AuthButton>
          
          <AuthButton 
            type="button" 
            variant="ghost" 
            className="w-full" 
            onClick={() => setShowForgot(false)}
          >
            ← Back to Login
          </AuthButton>
        </form>
      ) : (
        <>
          <form onSubmit={handleLogin} className="space-y-6">
            <AuthInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && error.toLowerCase().includes('email') ? error : undefined}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
              required
            />
            
            <AuthInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error && !error.toLowerCase().includes('email') ? error : undefined}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              }
              required
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-brand-yellow focus:ring-brand-yellow/50" />
                <span>Remember me</span>
              </label>
              
              <button
                type="button"
                className="text-sm text-brand-yellow hover:text-yellow-400 transition-colors"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            </div>
            
            <AuthButton type="submit" isLoading={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </AuthButton>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-brand-yellow hover:text-yellow-400 transition-colors font-semibold">
                Sign up
              </Link>
            </p>
          </div>
          
          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <AuthButton variant="secondary" className="w-full">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </AuthButton>
              
              <AuthButton variant="secondary" className="w-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </AuthButton>
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
