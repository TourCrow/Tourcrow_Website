import React from 'react';
import Link from 'next/link';
import { Shield, Eye, Lock, Users, Cookie, FileText, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4 mb-8">
            <p className="text-brand-dark font-medium">
              <strong>Last Updated:</strong> January 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-brand-yellow" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TourCrow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or engage with us in other ways. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our site or use our services.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-brand-yellow" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Passport information and travel documents</li>
                  <li>Billing and payment information</li>
                  <li>Travel preferences and special requirements</li>
                  <li>Emergency contact information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>IP address and geolocation data</li>
                  <li>Browser type and operating system</li>
                  <li>Pages viewed and time spent on our website</li>
                  <li>Referring website and search terms used</li>
                  <li>Device information and mobile identifiers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-brand-yellow" />
              How We Use Your Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Service Provision</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Process bookings and reservations</li>
                  <li>Arrange travel services and accommodations</li>
                  <li>Handle payments and financial transactions</li>
                  <li>Provide customer support</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Communication</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Send booking confirmations and updates</li>
                  <li>Share travel information and alerts</li>
                  <li>Marketing communications (with consent)</li>
                  <li>Respond to inquiries and requests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-3 text-brand-yellow" />
              Data Security
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-brand-dark mb-2">Technical Measures</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure payment processing</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-brand-dark mb-2">Organizational Measures</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Staff training on data protection</li>
                    <li>• Limited access to personal data</li>
                    <li>• Data retention policies</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies Policy */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <Cookie className="w-6 h-6 mr-3 text-brand-yellow" />
              Cookies and Tracking
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg">
                  <thead className="bg-yellow-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left text-brand-dark">Cookie Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-brand-dark">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-brand-dark">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Essential</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Website functionality and security</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Analytics</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Website performance and usage analysis</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Marketing</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Personalized advertising</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Your Privacy Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Access</h4>
                    <p className="text-sm text-gray-700">Request access to your personal data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Correction</h4>
                    <p className="text-sm text-gray-700">Update or correct inaccurate information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Deletion</h4>
                    <p className="text-sm text-gray-700">Request deletion of your personal data</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Portability</h4>
                    <p className="text-sm text-gray-700">Receive your data in a portable format</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Opt-out</h4>
                    <p className="text-sm text-gray-700">Unsubscribe from marketing communications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Object</h4>
                    <p className="text-sm text-gray-700">Object to certain data processing activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-xl p-8 text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@tourcrow.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Address:</strong> 123 Travel Street, Tourism District, Mumbai, Maharashtra 400001, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
