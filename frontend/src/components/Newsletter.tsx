import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Check, Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/subscribers', { email });
      setSubscribed(true);
      setEmail('');
      
      // Reset subscription status after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already subscribed')) {
        alert('This email is already subscribed!');
      } else {
        alert('Subscription failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Updated with Our Latest News
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter and get exclusive insights, updates, and special offers 
            delivered directly to your inbox.
          </p>
          
          {subscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full">
              <Check size={24} />
              <span className="text-lg font-semibold">
                Thank you for subscribing! Check your email for confirmation.
              </span>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <Send size={20} />
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-white/80 text-sm mt-4">
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          )}
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-white/80">Subscribers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Weekly</div>
              <div className="text-white/80">Updates</div>
            </div>
            <div>
              <div className="text-3xl font-bold">0%</div>
              <div className="text-white/80">Spam</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;