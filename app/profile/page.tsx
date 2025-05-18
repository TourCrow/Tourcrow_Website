"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setEmail(data.user.email || "");
        setAddress(data.user.user_metadata?.address || "");
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Address
  const handleEditAddress = () => { setEditAddress(true); setError(""); setSuccess(""); };
  const handleCancelAddress = () => { setEditAddress(false); setError(""); };
  const handleSaveAddress = async () => {
    setError(""); setSuccess("");
    const { error } = await supabase.auth.updateUser({ data: { address } });
    if (error) setError(error.message);
    else { setEditAddress(false); setSuccess("Address updated!"); }
  };

  // Email
  const handleEditEmail = () => { setEditEmail(true); setError(""); setSuccess(""); };
  const handleCancelEmail = () => { setEditEmail(false); setError(""); };
  const handleSaveEmail = async () => {
    setError(""); setSuccess("");
    const { error } = await supabase.auth.updateUser({ email });
    if (error) setError(error.message);
    else { setEditEmail(false); setSuccess("Email updated! Please check your inbox to confirm."); }
  };

  // Password
  const handleShowPasswordForm = () => { setShowPasswordForm(true); setError(""); setSuccess(""); };
  const handleCancelPassword = () => { setShowPasswordForm(false); setPassword(""); setError(""); };
  const handleSavePassword = async () => {
    setError(""); setSuccess("");
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else { setShowPasswordForm(false); setPassword(""); setSuccess("Password updated!"); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black/60 to-transparent">
      <div className="bg-black/80 border-2 border-brand-yellow rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-brand-yellow">Profile</h1>
        {/* Email */}
        <div className="mb-6 w-full">
          <label className="block font-semibold mb-1 text-brand-yellow">Email:</label>
          {editEmail ? (
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-brand-yellow bg-black/60 text-brand-yellow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEmail} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                <button onClick={handleCancelEmail} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-brand-yellow">{email}</span>
              <button onClick={handleEditEmail} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Edit</button>
            </div>
          )}
        </div>
        {/* Address */}
        <div className="mb-6 w-full">
          <label className="block font-semibold mb-1 text-brand-yellow">Address:</label>
          {editAddress ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="border border-brand-yellow bg-black/60 text-brand-yellow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveAddress} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                <button onClick={handleCancelAddress} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-brand-yellow">{address || <span className="text-gray-400">No address set</span>}</span>
              <button onClick={handleEditAddress} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Edit</button>
            </div>
          )}
        </div>
        {/* Change Password */}
        <div className="mb-6 w-full">
          <label className="block font-semibold mb-1 text-brand-yellow">Password:</label>
          {showPasswordForm ? (
            <div className="flex flex-col gap-2">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="New password"
                className="border border-brand-yellow bg-black/60 text-brand-yellow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow"
              />
              <div className="flex gap-2">
                <button onClick={handleSavePassword} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                <button onClick={handleCancelPassword} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={handleShowPasswordForm} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Change Password</button>
          )}
        </div>
        {/* Error/Success */}
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
        {success && <div className="text-green-500 mt-2 text-center">{success}</div>}
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded mt-4">Log Out</button>
      </div>
    </div>
  );
}
