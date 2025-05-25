import React from 'react';
import Link from 'next/link';
import { RefreshCw, AlertTriangle, Calendar, CreditCard, Shield, Clock } from 'lucide-react';

export default function CancellationRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Cancellation & Refund Policy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Understand our cancellation terms and refund procedures for your travel bookings.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Policy Overview */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-brand-yellow" />
              Policy Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TourCrow's cancellation and refund policy is designed to be fair to both our customers and our business partners. Our charges are structured based on the time of cancellation relative to your travel date, reflecting the costs we incur from our suppliers and partners.
            </p>
            <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4">
              <p className="text-brand-dark font-medium">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                <strong>Important:</strong> Cancellation charges may vary based on tour type, season, and supplier policies. Please read your specific booking terms carefully.
              </p>
            </div>
          </div>

          {/* Cancellation Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-brand-yellow" />
              Cancellation Charges Timeline
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Days Before Travel</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Cancellation Charge</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Refund Amount</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-brand-dark">Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">45+ Days</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-medium">10% of total cost</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-medium">90% refund</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">7-10 business days</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">30-44 Days</td>
                    <td className="border border-gray-300 px-4 py-3 text-yellow-600 font-medium">25% of total cost</td>
                    <td className="border border-gray-300 px-4 py-3 text-yellow-600 font-medium">75% refund</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">7-10 business days</td>
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">15-29 Days</td>
                    <td className="border border-gray-300 px-4 py-3 text-orange-600 font-medium">50% of total cost</td>
                    <td className="border border-gray-300 px-4 py-3 text-orange-600 font-medium">50% refund</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">10-15 business days</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">0-14 Days</td>
                    <td className="border border-gray-300 px-4 py-3 text-red-600 font-medium">100% of total cost</td>
                    <td className="border border-gray-300 px-4 py-3 text-red-600 font-medium">No refund</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>* Charges calculated from the original travel start date</p>
              <p>* Weekend and holidays may extend processing time</p>
            </div>
          </div>

          {/* Service-Specific Policies */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Service-Specific Cancellation Terms</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Domestic Tours</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Standard cancellation charges apply</li>
                    <li>• Hotel bookings follow individual property policies</li>
                    <li>• Transportation tickets non-refundable within 24 hours</li>
                    <li>• Adventure activities: 48-hour cancellation required</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">International Tours</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Visa processing fees non-refundable</li>
                    <li>• Airline tickets subject to carrier policies</li>
                    <li>• International insurance non-refundable</li>
                    <li>• Minimum 60-day advance cancellation recommended</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Group Bookings (10+ people)</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Special cancellation terms apply</li>
                    <li>• Partial cancellations allowed</li>
                    <li>• Group leader responsible for coordination</li>
                    <li>• Deposits non-refundable after confirmation</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-brand-dark mb-3">Custom Packages</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Terms defined in individual agreements</li>
                    <li>• Planning fees may be non-refundable</li>
                    <li>• Supplier-specific cancellation policies apply</li>
                    <li>• Higher charges for peak season bookings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-brand-yellow" />
              Refund Process
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-brand-dark font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-2">Submit Request</h3>
                  <p className="text-sm text-gray-700">Contact our customer service with booking details and cancellation reason</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-brand-dark font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-2">Processing</h3>
                  <p className="text-sm text-gray-700">We calculate charges and coordinate with suppliers for applicable refunds</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-brand-dark font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-2">Refund</h3>
                  <p className="text-sm text-gray-700">Amount credited to original payment method within specified timeline</p>
                </div>
              </div>
              
              <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4">
                <h4 className="font-semibold text-brand-dark mb-2">Required Documents for Refund:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Original booking confirmation</li>
                  <li>• Government-issued ID proof</li>
                  <li>• Bank account details (if different from booking)</li>
                  <li>• Cancellation reason (medical/emergency cases may qualify for special consideration)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-brand-yellow" />
              Special Circumstances
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Waived Cancellation Charges</h3>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• Medical emergencies (with doctor's certificate)</li>
                    <li>• Natural disasters at destination</li>
                    <li>• Government travel advisories</li>
                    <li>• Visa rejection (with official letter)</li>
                    <li>• Our service provider cancellations</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Non-Refundable Components</h3>
                  <ul className="space-y-2 text-red-700 text-sm">
                    <li>• Visa processing fees</li>
                    <li>• Travel insurance premiums</li>
                    <li>• Service charges and taxes</li>
                    <li>• Third-party booking fees</li>
                    <li>• Peak season surcharges</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Travel Insurance Recommendation</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen circumstances. 
                  Travel insurance can cover trip cancellation, medical emergencies, lost baggage, and other travel-related issues 
                  that may not be covered under our standard cancellation policy.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Important Notes</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">Refund Timeline</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Credit card refunds: 7-21 business days</li>
                    <li>Bank transfer: 3-7 business days</li>
                    <li>Online payment wallets: 2-5 business days</li>
                    <li>Cash payments: Bank transfer only</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">Additional Charges</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Bank processing fees may apply</li>
                    <li>Foreign exchange fluctuation charges</li>
                    <li>Third-party service provider charges</li>
                    <li>Communication and documentation fees</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-100 border border-brand-yellow rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-brand-dark mb-2">Modification vs Cancellation</h4>
                <p className="text-gray-700 text-sm">
                  Consider modifying your booking instead of cancelling. Date changes, destination alterations, 
                  or package upgrades may be possible with lower charges than full cancellation. 
                  Contact our team to explore available options.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-xl p-8 text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Need to Cancel or Have Questions?</h2>
            <p className="mb-4">
              Our customer service team is here to help you with cancellations and refund inquiries:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> cancellations@tourcrow.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>WhatsApp:</strong> +91 87654 32109</p>
              <p><strong>Hours:</strong> Monday - Sunday, 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
