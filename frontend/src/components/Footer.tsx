import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github,
  Heart
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'Digital Marketing',
    'Consultation',
    'E-commerce'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg"></div>
              <span className="text-2xl font-bold">
                Flipr<span className="text-secondary">.</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              We create stunning digital experiences that help businesses grow 
              and succeed in the modern digital landscape.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-gray-400">hello@flipr.com</div>
              </div>
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-gray-400">+1 (555) 123-4567</div>
              </div>
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-gray-400">
                  123 Business Street<br />
                  Suite 100<br />
                  New York, NY 10001
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Flipr. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Cookies Policy
              </a>
            </div>
          </div>
          
          {/* Made with love */}
          <div className="text-center mt-8 text-gray-500">
            <div className="inline-flex items-center gap-2">
              Made with <Heart size={16} className="text-red-500 fill-red-500" /> for Flipr Placement Task
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;