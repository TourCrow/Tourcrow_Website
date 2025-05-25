import React from 'react';
import Link from 'next/link';
import { Truck, Clock, MapPin, Package, AlertCircle, CreditCard } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <Truck className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Learn about our shipping and delivery procedures for travel documents and materials.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <Package className="w-6 h-6 mr-3 text-brand-yellow" />
              Shipping Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TourCrow provides shipping services for travel documents, tickets, vouchers, and promotional materials. This policy outlines our shipping methods, charges, timelines, and coverage areas.
            </p>
            <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4">
              <p className="text-brand-dark font-medium">
                <AlertCircle className="w-5 h-5 inline mr-2" />
                <strong>Important:</strong> Digital delivery is our preferred method for most documents to ensure faster and more secure delivery.
              </p>
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Truck className="w-6 h-6 mr-3 text-brand-yellow" />
              Delivery Methods
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Digital Delivery</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Timeline:</strong> Instant - 24 hours</p>
                  <p><strong>Cost:</strong> Free</p>
                  <p><strong>Items:</strong> E-tickets, vouchers, itineraries</p>
                  <p><strong>Method:</strong> Email and customer portal</p>
                </div>
              </div>
              
              <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Standard Shipping</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Timeline:</strong> 3-7 business days</p>
                  <p><strong>Cost:</strong> ₹150 - ₹300</p>
                  <p><strong>Items:</strong> Physical documents, materials</p>
                  <p><strong>Method:</strong> Regular postal service</p>
                </div>
              </div>
              
              <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Express Delivery</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Timeline:</strong> 1-3 business days</p>
                  <p><strong>Cost:</strong> ₹500 - ₹800</p>
                  <p><strong>Items:</strong> Urgent documents</p>
                  <p><strong>Method:</strong> Courier services</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-brand-yellow" />
              Shipping Charges
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Delivery Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Within City</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Within State</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Other States</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">International</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">Digital</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">Free</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">Free</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">Free</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">Free</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">Standard</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹150</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹200</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹300</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹1,500</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">Express</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹500</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹600</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹800</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹3,000</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">Emergency</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹1,200</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹1,500</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹2,000</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">₹5,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>* Emergency delivery available only for same-day/next-day requirements</p>
              <p>* International shipping may require additional customs fees</p>
            </div>
          </div>

          {/* Processing Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-brand-yellow" />
              Processing Timeline
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Document Preparation</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Standard documents: 1-2 business days</li>
                    <li>• Custom itineraries: 2-3 business days</li>
                    <li>• Visa applications: 3-5 business days</li>
                    <li>• Travel insurance: Same day</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Quality Check</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Document verification: 4-6 hours</li>
                    <li>• Booking confirmation: 2-4 hours</li>
                    <li>• Final review: 1-2 hours</li>
                    <li>• Packaging: 30 minutes</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4">
                <h4 className="font-semibold text-brand-dark mb-2">Rush Processing Available</h4>
                <p className="text-gray-700 text-sm">
                  For urgent requirements, we offer rush processing services with additional charges. Contact our customer service team for expedited handling.
                </p>
              </div>
            </div>
          </div>

          {/* Coverage Areas */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-brand-yellow" />
              Coverage Areas
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">Domestic Shipping</h3>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Metro Cities</h4>
                    <p className="text-sm text-gray-700">Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Tier 2 Cities</h4>
                    <p className="text-sm text-gray-700">All major cities with express delivery options</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Remote Areas</h4>
                    <p className="text-sm text-gray-700">Standard shipping only, extended delivery time</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">International Shipping</h3>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Express Destinations</h4>
                    <p className="text-sm text-gray-700">USA, UK, Australia, Canada, Singapore, UAE</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Standard Destinations</h4>
                    <p className="text-sm text-gray-700">Europe, Asia-Pacific, Middle East</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-brand-dark mb-2">Restricted Areas</h4>
                    <p className="text-sm text-gray-700">Contact us for availability to specific countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Shipping Terms & Conditions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Liability</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>TourCrow is not liable for delays caused by postal services or customs</li>
                  <li>Insurance is recommended for valuable documents</li>
                  <li>Lost shipments will be re-sent at no additional cost (digital copies)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Tracking</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Tracking numbers provided for express and standard shipping</li>
                  <li>Real-time updates via SMS and email</li>
                  <li>Customer portal access for shipment status</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Address Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Complete and accurate delivery address required</li>
                  <li>Landmark references helpful for remote areas</li>
                  <li>Phone number mandatory for courier deliveries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-xl p-8 text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Shipping Inquiries?</h2>
            <p className="mb-4">
              Have questions about shipping or need to track your package? Contact our shipping department:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> shipping@tourcrow.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
