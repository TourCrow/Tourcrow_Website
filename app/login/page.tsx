"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    setResetError("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) setResetError(error.message);
    else setResetMsg("Password reset email sent! Check your inbox.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black/60 to-transparent">
      <div className="bg-black/80 border-2 border-brand-yellow rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-brand-yellow">Login</h1>
        {showForgot ? (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-5 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
              required
            />
            {resetError && <div className="text-red-500 text-center">{resetError}</div>}
            {resetMsg && <div className="text-green-500 text-center">{resetMsg}</div>}
            <button type="submit" className="bg-brand-yellow text-black font-bold p-3 rounded-lg shadow hover:bg-yellow-400 transition-colors">Send Reset Link</button>
            <button type="button" className="text-brand-yellow underline mt-2" onClick={() => setShowForgot(false)}>Back to Login</button>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
                required
              />
              {error && <div className="text-red-500 text-center">{error}</div>}
              <button type="submit" className="bg-brand-yellow text-black font-bold p-3 rounded-lg shadow hover:bg-yellow-400 transition-colors">Login</button>
            </form>
            <button type="button" className="text-brand-yellow underline mt-4" onClick={() => setShowForgot(true)}>
              Forgot password?
            </button>
            <p className="mt-6 text-brand-yellow">Don't have an account? <a href="/signup" className="underline hover:text-yellow-400 transition-colors">Sign up</a></p>
          </>
        )}
      </div>
    </div>
  );
}
