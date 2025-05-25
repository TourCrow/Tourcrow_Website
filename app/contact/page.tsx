import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Get in touch with our travel experts. We're here to help you plan your perfect journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Get In Touch</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ready to embark on your next adventure? Our experienced travel consultants are here to help you create unforgettable memories. Whether you have questions about our tours, need custom itinerary planning, or require travel assistance, we're just a message away.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg border border-brand-yellow">
                  <Mail className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Email Us</h3>
                  <p className="text-gray-700">info@tourcrow.com</p>
                  <p className="text-gray-700">support@tourcrow.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg border border-brand-yellow">
                  <Phone className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Call Us</h3>
                  <p className="text-gray-700">+91 98765 43210</p>
                  <p className="text-gray-700">+91 87654 32109</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg border border-brand-yellow">
                  <MapPin className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Visit Us</h3>
                  <p className="text-gray-700">
                    123 Travel Street,<br />
                    Tourism District,<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg border border-brand-yellow">
                  <Clock className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Business Hours</h3>
                  <p className="text-gray-700">Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-700">Saturday: 10:00 AM - 5:00 PM</p>
                  <p className="text-gray-700">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Travel Interest
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors">
                  <option value="">Select your interest</option>
                  <option value="adventure">Adventure Tours</option>
                  <option value="cultural">Cultural Experiences</option>
                  <option value="wildlife">Wildlife Safari</option>
                  <option value="spiritual">Spiritual Journeys</option>
                  <option value="luxury">Luxury Travel</option>
                  <option value="budget">Budget Travel</option>
                  <option value="custom">Custom Itinerary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Message *
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors resize-none"
                  placeholder="Tell us about your travel plans and how we can help..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-dark font-semibold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md border border-yellow-200">
              <h3 className="font-semibold text-brand-dark mb-3">How do I book a tour?</h3>
              <p className="text-gray-700">You can book tours directly through our website, call us, or visit our office. Our team will guide you through the entire process.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-yellow-200">
              <h3 className="font-semibold text-brand-dark mb-3">What is your cancellation policy?</h3>
              <p className="text-gray-700">Our cancellation policy varies by tour type. Please check our cancellation and refund policy page for detailed information.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-yellow-200">
              <h3 className="font-semibold text-brand-dark mb-3">Do you offer custom tours?</h3>
              <p className="text-gray-700">Yes! We specialize in creating personalized itineraries based on your preferences, budget, and travel dates.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border border-yellow-200">
              <h3 className="font-semibold text-brand-dark mb-3">Are your guides certified?</h3>
              <p className="text-gray-700">All our guides are certified professionals with extensive local knowledge and experience in tourism industry.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
