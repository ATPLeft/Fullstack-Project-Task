import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', mobile: '', city: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <span className="text-secondary font-semibold tracking-wider">GET IN TOUCH</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Get a Free <span className="text-primary">Consultation</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Have a project in mind? Let's discuss how we can help bring your ideas to life. 
              Fill out the form and we'll get back to you within 24 hours.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Call Us</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Us</h4>
                  <p className="text-gray-600">hello@flipr.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Visit Us</h4>
                  <p className="text-gray-600">123 Business Street, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-gray-600">Hours Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-gray-600">Confidential</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <div className="text-gray-600">Consultation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
                <p className="text-gray-600 mb-8">
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                    placeholder="Area, City"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Quick Quote
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-center text-gray-500 text-sm">
                  By submitting, you agree to our Terms & Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;