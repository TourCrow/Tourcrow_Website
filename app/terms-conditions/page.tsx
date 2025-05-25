import React from 'react';
import { Scale, FileText, Shield, AlertCircle, Users, Globe } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <Scale className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Please read our terms of service carefully before using our travel services.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4 mb-8">
            <p className="text-brand-dark font-medium">
              <strong>Last Updated:</strong> January 2024 | <strong>Effective Date:</strong> January 1, 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-brand-yellow" />
              Introduction & Acceptance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to TourCrow! These Terms and Conditions ("Terms") govern your use of our website, services, and travel packages. By accessing our website or booking our services, you agree to be bound by these Terms. If you do not agree with any part of these terms, please do not use our services.
            </p>
            <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4">
              <p className="text-brand-dark font-medium">
                <AlertCircle className="w-5 h-5 inline mr-2" />
                <strong>Important:</strong> These terms constitute a legally binding agreement between you and TourCrow. Please read them carefully.
              </p>
            </div>
          </div>

          {/* Service Terms */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-brand-yellow" />
              Service Terms
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Service Scope</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <ul className="space-y-2 text-gray-700">
                    <li>• TourCrow acts as an intermediary between travelers and service providers</li>
                    <li>• We arrange travel services including accommodation, transportation, and activities</li>
                    <li>• Our services include tour planning, booking, and customer support</li>
                    <li>• We provide travel consultation and advisory services</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Booking Process</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Booking Confirmation</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Bookings confirmed upon payment receipt</li>
                      <li>• Written confirmation sent via email</li>
                      <li>• Booking reference number provided</li>
                      <li>• Terms specific to your booking apply</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Payment Terms</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Full payment or deposit required</li>
                      <li>• Accepted payment methods specified</li>
                      <li>• Currency conversion charges apply</li>
                      <li>• Payment security guaranteed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traveler Responsibilities */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-brand-yellow" />
              Traveler Responsibilities
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Documentation</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Valid passport and travel documents</li>
                      <li>• Appropriate visas and permits</li>
                      <li>• Travel insurance (highly recommended)</li>
                      <li>• Health certificates if required</li>
                      <li>• Emergency contact information</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Conduct & Behavior</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Respect local laws and customs</li>
                      <li>• Follow guide instructions and safety protocols</li>
                      <li>• Maintain respectful behavior toward staff and locals</li>
                      <li>• Arrive on time for scheduled activities</li>
                      <li>• Report issues promptly to our representatives</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Important Notice</h4>
                <p className="text-red-700 text-sm">
                  Travelers are solely responsible for ensuring they have proper documentation. 
                  TourCrow is not liable for denied entry, deportation, or other consequences of improper documentation.
                </p>
              </div>
            </div>
          </div>

          {/* Liability & Insurance */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-brand-yellow" />
              Liability & Insurance
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Limitation of Liability</h3>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    TourCrow acts as an agent for various service providers and is not liable for their acts, omissions, or defaults. 
                    Our liability is limited to the amount paid for services, and we exclude liability for:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Personal injury, illness, or death (except where legally required)</li>
                    <li>• Loss or damage to personal property</li>
                    <li>• Delays, cancellations by third parties</li>
                    <li>• Force majeure events</li>
                    <li>• Acts of terrorism, war, or political unrest</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Travel Insurance</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm leading-relaxed">
                    <strong>Strongly Recommended:</strong> We highly recommend purchasing comprehensive travel insurance 
                    to protect against trip cancellation, medical emergencies, baggage loss, and other unforeseen circumstances. 
                    Travel insurance should be purchased at the time of booking for maximum coverage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Intellectual Property Rights</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Our Content</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Website content, design, and layout</li>
                      <li>• TourCrow logos and branding</li>
                      <li>• Travel itineraries and descriptions</li>
                      <li>• Photography and multimedia content</li>
                      <li>• Software and technology</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Usage Rights</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Personal, non-commercial use only</li>
                      <li>• No reproduction without permission</li>
                      <li>• No modification or distribution</li>
                      <li>• Respect third-party rights</li>
                      <li>• Report copyright violations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Force Majeure */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Force Majeure</h2>
            
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <p className="text-gray-700 leading-relaxed mb-4">
                TourCrow shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including but not limited to:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Natural disasters (earthquakes, floods, storms)</li>
                  <li>• Pandemic or health emergencies</li>
                  <li>• Government regulations or travel restrictions</li>
                  <li>• Terrorism or security threats</li>
                </ul>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Labor strikes or industrial action</li>
                  <li>• Infrastructure failures</li>
                  <li>• Supplier bankruptcies or closures</li>
                  <li>• Other events beyond reasonable control</li>
                </ul>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-100 border border-brand-yellow rounded">
                <p className="text-brand-dark text-sm font-medium">
                  In such cases, we will work to provide alternative arrangements or issue appropriate refunds as circumstances permit.
                </p>
              </div>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Dispute Resolution</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Resolution Process</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-brand-dark font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-brand-dark mb-2">Direct Resolution</h4>
                    <p className="text-sm text-gray-700">Contact our customer service team first for direct resolution</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-brand-dark font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-brand-dark mb-2">Mediation</h4>
                    <p className="text-sm text-gray-700">Attempt mediation through neutral third party if needed</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-brand-dark font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-brand-dark mb-2">Legal Action</h4>
                    <p className="text-sm text-gray-700">Legal proceedings as last resort under Indian jurisdiction</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4">
                <h4 className="font-semibold text-brand-dark mb-2">Governing Law</h4>
                <p className="text-gray-700 text-sm">
                  These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction 
                  of the courts in Mumbai, Maharashtra. The United Nations Convention on Contracts for the International 
                  Sale of Goods does not apply to these Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Modifications & Updates */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Terms Modifications</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                TourCrow reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting 
                on our website. Your continued use of our services after changes constitutes acceptance of the new Terms.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-brand-dark mb-2">Notification of Changes</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Major changes will be communicated via email</li>
                  <li>• Updates posted on our website</li>
                  <li>• Effective date clearly indicated</li>
                  <li>• Previous versions available upon request</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-xl p-8 text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact our legal department:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@tourcrow.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Address:</strong> 123 Travel Street, Tourism District, Mumbai, Maharashtra 400001, India</p>
              <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
