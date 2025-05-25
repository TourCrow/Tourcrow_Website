"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    mobile: "",
    occupation: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\+?[\d\s-()]{10,}$/.test(formData.mobile)) newErrors.mobile = "Please enter a valid mobile number";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccess("");
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: formData.email, 
        password: formData.password 
      });
      
      if (error) {
        setErrors({ general: error.message });
        return;
      }

      // Insert user profile data
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile: formData.mobile,
          occupation: formData.occupation
        });
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }
      
      setSuccess("Account created successfully! Please check your email to confirm your account.");
      setTimeout(() => router.push("/login"), 3000);
      
    } catch (err) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle={currentStep === 1 ? "Set up your login credentials" : "Complete your profile"}
    >
      <div className="mb-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            currentStep >= 1 ? 'bg-brand-yellow border-brand-yellow text-brand-dark' : 'border-white/20 text-gray-400'
          } transition-all duration-200`}>
            {currentStep > 1 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-sm font-semibold">1</span>
            )}
          </div>
          <div className={`h-1 w-16 rounded-full transition-all duration-200 ${
            currentStep > 1 ? 'bg-brand-yellow' : 'bg-white/20'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            currentStep >= 2 ? 'bg-brand-yellow border-brand-yellow text-brand-dark' : 'border-white/20 text-gray-400'
          } transition-all duration-200`}>
            <span className="text-sm font-semibold">2</span>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Account</span>
          <span>Profile</span>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
          {errors.general}
        </div>
      )}

      {currentStep === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
          <AuthInput
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
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
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            }
            required
          />
          
          <AuthInput
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            }
            required
          />
          
          <AuthButton type="submit" className="w-full">
            Continue →
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
              required
            />
            
            <AuthInput
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
              required
            />
          </div>
          
          <AuthInput
            type="tel"
            placeholder="Mobile number"
            value={formData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={errors.mobile}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            }
            required
          />
          
          <AuthInput
            type="text"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            error={errors.occupation}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            }
            required
          />
          
          <div className="flex gap-4">
            <AuthButton 
              type="button" 
              variant="secondary" 
              className="flex-1" 
              onClick={handlePrevStep}
            >
              ← Back
            </AuthButton>
            <AuthButton type="submit" isLoading={isLoading} className="flex-1">
              {isLoading ? "Creating Account..." : "Create Account"}
            </AuthButton>
          </div>
        </form>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-yellow hover:text-yellow-400 transition-colors font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
