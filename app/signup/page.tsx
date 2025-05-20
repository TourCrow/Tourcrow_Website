"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // Optionally, insert user profile data into a 'profiles' table
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          mobile,
          occupation
        });
      }
      setSuccess("Signup successful! Please check your email to confirm your account.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black/60 to-transparent">
      <div className="bg-black/80 border-2 border-brand-yellow rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-brand-yellow">Sign Up</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full">
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
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
            required
          />
          <input
            type="text"
            placeholder="Occupation"
            value={occupation}
            onChange={e => setOccupation(e.target.value)}
            className="border border-brand-yellow bg-black/60 text-brand-yellow placeholder:text-brand-yellow/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
            required
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <button type="submit" className="bg-brand-yellow text-black font-bold p-3 rounded-lg shadow hover:bg-yellow-400 transition-colors">Sign Up</button>
        </form>
        <p className="mt-6 text-brand-yellow">Already have an account? <a href="/login" className="underline hover:text-yellow-400 transition-colors">Login</a></p>
      </div>
    </div>
  );
}
