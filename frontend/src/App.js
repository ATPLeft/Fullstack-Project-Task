import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Menu, X, ArrowRight, ExternalLink, MapPin, Calendar,
  Star, Quote, Send, CheckCircle, Phone, Mail, MapPin as MapPinIcon,
  Facebook, Twitter, Linkedin, Instagram, Github, Heart, Check,
  Plus
} from 'lucide-react';
import './styles/global.css';
import './styles/components.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    mobile: '',
    city: ''
  });
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    description: ''
  });
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    
    try {
      await axios.post(`${API_URL}/contacts`, contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', mobile: '', city: '' });
      
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting contact:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteLoading(true);
    
    try {
      // In a real app, you would send this to a different endpoint
      // For now, we'll use the contact endpoint with additional data
      const quoteData = {
        ...quoteForm,
        type: 'quote_request',
        submittedAt: new Date().toISOString()
      };
      
      await axios.post(`${API_URL}/contacts`, quoteData);
      setQuoteSuccess(true);
      setQuoteForm({ 
        name: '', 
        email: '', 
        projectType: '', 
        budget: '', 
        description: '' 
      });
      setShowQuoteModal(false);
      
      setTimeout(() => setQuoteSuccess(false), 5000);
      alert('Quote request submitted successfully! We will contact you within 24 hours.');
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('There was an error submitting your quote request. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleGetQuoteClick = () => {
    setShowQuoteModal(true);
  };

  const handleStartProjectClick = () => {
    // Scroll to contact form
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewAllProjectsClick = () => {
    // In a real app, this would navigate to a projects page
    alert('In a full application, this would show all projects. For now, showing available projects.');
  };

  const handleSubscribe = async () => {
    if (!subscriberEmail) {
      alert('Please enter your email address');
      return;
    }
    
    setSubscribeLoading(true);
    try {
      await axios.post(`${API_URL}/subscribers`, { email: subscriberEmail });
      setSubscribeSuccess(true);
      setSubscriberEmail('');
      
      setTimeout(() => setSubscribeSuccess(false), 5000);
    } catch (error) {
      if (error.response?.data?.message?.includes('already subscribed')) {
        alert('This email is already subscribed to our newsletter.');
      } else {
        alert('Subscription failed. Please try again.');
      }
    } finally {
      setSubscribeLoading(false);
    }
  };

  // Header Component
  // Header Component - Fixed
const Header = () => (
  <header className="header">
    <div className="container">
      <a href="/" className="logo">
        <div className="logo-icon">D</div>
        <span className="logo-text">Digital<span>Solutions</span></span>
      </a>

      <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
        <a href="#home" className="nav-link active" onClick={() => setIsMenuOpen(false)}>Home</a>
        <a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</a>
        <a href="#projects" className="nav-link" onClick={() => setIsMenuOpen(false)}>Projects</a>
        <a href="#testimonials" className="nav-link" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
        <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</a>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setIsMenuOpen(false);
            handleGetQuoteClick();
          }}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          Get Quote
        </button>
      </nav>

      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ 
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem'
        }}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </header>
);

  // Hero Component
  const Hero = () => (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <span className="hero-badge">
            🚀 Trusted by 500+ Companies Worldwide
          </span>
          <h1 className="hero-title">
            Transform Your Digital{' '}
            <span className="text-primary">Presence</span>
          </h1>
          <p className="hero-description">
            We create stunning digital solutions that drive growth and engage customers. 
            Let's build something amazing together.
          </p>
          
          <div className="hero-cta">
            <button 
              className="btn btn-primary flex items-center gap-2"
              onClick={handleGetQuoteClick}
            >
              Get Free Quote <ArrowRight size={20} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleStartProjectClick}
            >
              Start Project
            </button>
          </div>
          
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">250+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Projects Component
  const ProjectsSection = () => (
    <section className="section-padding projects-section" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">OUR WORK</span>
          <h2 className="section-title">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="max-w-2xl mx-auto">
            Discover our portfolio of successful projects that showcase our expertise 
            in delivering exceptional digital solutions.
          </p>
        </div>

        {loadingProjects ? (
          <div className="project-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-card">
                <div className="skeleton skeleton-image"></div>
                <div className="project-content">
                  <div className="skeleton skeleton-text skeleton-text-sm mb-4"></div>
                  <div className="skeleton skeleton-text mb-2"></div>
                  <div className="skeleton skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="project-grid">
              {projects.map((project) => (
                <div key={project._id} className="project-card">
                  <img 
                    src={project.image.startsWith('http') ? project.image : `${API_URL.replace('/api', '')}${project.image}`}
                    alt={project.name}
                    className="project-image"
                  />
                  <div className="project-content">
                    <span className="project-category">{project.category}</span>
                    <h3 className="project-title">{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-meta">
                      <div className="project-location">
                        <MapPin size={16} />
                        <span>{project.location}</span>
                      </div>
                      <button 
                        className="project-link"
                        onClick={() => alert(`More details about ${project.name} would appear here.`)}
                      >
                        Read More
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Project Card */}
              <div 
                className="project-card flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
                onClick={handleGetQuoteClick}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Plus size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="project-title">Start New Project</h3>
                <p className="project-description">Ready to begin your next big idea?</p>
                <button className="btn btn-primary mt-4" onClick={handleGetQuoteClick}>
                  Get Quote
                </button>
              </div>
            </div>

            {projects.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  className="btn btn-outline"
                  onClick={handleViewAllProjectsClick}
                >
                  View All Projects
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );

  // Clients Component
  const ClientsSection = () => (
    <section className="section-padding clients-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">TESTIMONIALS</span>
          <h2 className="section-title">
            Happy <span className="text-primary">Clients</span>
          </h2>
          <p className="max-w-2xl mx-auto">
            Hear what our clients have to say about their experience working with us.
          </p>
        </div>

        {loadingClients ? (
          <div className="grid md-grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="testimonial-card animate-pulse">
                <div className="skeleton skeleton-text mb-4"></div>
                <div className="skeleton skeleton-text mb-4"></div>
                <div className="skeleton skeleton-text mb-4 w-3/4"></div>
                <div className="flex items-center">
                  <div className="skeleton w-16 h-16 rounded-full mr-4"></div>
                  <div>
                    <div className="skeleton skeleton-text w-32 mb-2"></div>
                    <div className="skeleton skeleton-text w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {clients.length > 0 && (
              <div className="testimonial-card">
                <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
                <div className="relative">
                  <p className="testimonial-content">
                    "{clients[activeClientIndex]?.description}"
                  </p>
                  
                  <div className="testimonial-author">
                    <img 
                      src={clients[activeClientIndex]?.image.startsWith('http') 
                        ? clients[activeClientIndex]?.image 
                        : `${API_URL.replace('/api', '')}${clients[activeClientIndex]?.image}`}
                      alt={clients[activeClientIndex]?.name}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <h4>{clients[activeClientIndex]?.name}</h4>
                      <p>{clients[activeClientIndex]?.designation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                  {clients.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveClientIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeClientIndex ? 'bg-primary w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="client-logos">
              {clients.slice(0, 5).map((client, index) => (
                <div 
                  key={client._id}
                  className={`client-logo ${index === activeClientIndex ? 'active' : ''}`}
                  onClick={() => setActiveClientIndex(index)}
                >
                  <img 
                    src={client.image.startsWith('http') ? client.image : `${API_URL.replace('/api', '')}${client.image}`}
                    alt={client.name}
                    className="client-avatar"
                  />
                  <h4>{client.name}</h4>
                  <p className="text-sm">{client.designation}</p>
                  
                  <div className="flex justify-center mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        className="text-accent fill-accent" 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="stats-banner">
          <div className="stats-grid">
            <div className="stat-banner-item">
              <div className="stat-banner-number">98%</div>
              <div className="stat-banner-label">Client Retention</div>
            </div>
            <div className="stat-banner-item">
              <div className="stat-banner-number">250+</div>
              <div className="stat-banner-label">Projects Delivered</div>
            </div>
            <div className="stat-banner-item">
              <div className="stat-banner-number">24/7</div>
              <div className="stat-banner-label">Support Available</div>
            </div>
            <div className="stat-banner-item">
              <div className="stat-banner-number">5★</div>
              <div className="stat-banner-label">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Contact Form Component
  const ContactFormSection = () => (
    <section className="section-padding" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">GET IN TOUCH</span>
          <h2 className="section-title">
            Get a Free <span className="text-primary">Consultation</span>
          </h2>
          <p className="max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can help bring your ideas to life.
          </p>
        </div>

        <div className="grid md-grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="space-y-6 mb-12">
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-details">
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p>contact@digitalsolutions.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <MapPinIcon size={24} />
                </div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>123 Business Street, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            <div className="trust-indicators">
              <div className="trust-grid">
                <div className="trust-item">
                  <div className="trust-number">24</div>
                  <div className="trust-label">Hours Response</div>
                </div>
                <div className="trust-item">
                  <div className="trust-number">100%</div>
                  <div className="trust-label">Confidential</div>
                </div>
                <div className="trust-item">
                  <div className="trust-number">Free</div>
                  <div className="trust-label">Consultation</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {contactSuccess ? (
              <div className="success-message">
                <div className="success-icon">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="mb-8">
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setContactSuccess(false)}
                  className="btn btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="grid md-grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="form-input"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
                      className="form-input"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={contactForm.city}
                    onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
                    className="form-input"
                    placeholder="Area, City"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {contactLoading ? (
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
                
                <p className="text-center text-sm text-gray-500">
                  By submitting, you agree to our Terms & Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // Newsletter Component
  const NewsletterSection = () => (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <Mail size={32} />
          </div>
          
          <h2 className="newsletter-title">
            Stay Updated with Our Latest News
          </h2>
          
          <p className="newsletter-description">
            Subscribe to our newsletter and get exclusive insights, updates, and special offers 
            delivered directly to your inbox.
          </p>
          
          {subscribeSuccess ? (
            <div className="subscribed-message">
              <Check size={24} />
              <span className="text-lg font-semibold">
                Thank you for subscribing! Check your email for confirmation.
              </span>
            </div>
          ) : (
            <div className="newsletter-form">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribeLoading}
                className="newsletter-subscribe flex items-center justify-center gap-2"
              >
                {subscribeLoading ? (
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
          )}
          
          <p className="text-sm mt-4 opacity-80">
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
          
          <div className="newsletter-stats">
            <div>
              <div className="newsletter-stat-number">10K+</div>
              <div className="newsletter-stat-label">Subscribers</div>
            </div>
            <div>
              <div className="newsletter-stat-number">Weekly</div>
              <div className="newsletter-stat-label">Updates</div>
            </div>
            <div>
              <div className="newsletter-stat-number">0%</div>
              <div className="newsletter-stat-label">Spam</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Footer Component
  const Footer = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-icon">D</div>
              <span className="logo-text">Digital<span>Solutions</span></span>
            </div>
            <p className="footer-description">
              We create stunning digital experiences that help businesses grow 
              and succeed in the modern digital landscape.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Our Services</h3>
            <ul className="footer-links">
              <li><a href="#">Web Development</a></li>
              <li><a href="#">Mobile Apps</a></li>
              <li><a href="#">UI/UX Design</a></li>
              <li><a href="#">Digital Marketing</a></li>
              <li><a href="#">Consultation</a></li>
              <li><a href="#">E-commerce</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Contact Info</h3>
            <div className="contact-info-item">
              <strong>Email</strong>
              <p>contact@digitalsolutions.com</p>
            </div>
            <div className="contact-info-item">
              <strong>Phone</strong>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-info-item">
              <strong>Address</strong>
              <p>123 Business Street, Suite 100<br />New York, NY 10001</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} DigitalSolutions. All rights reserved.
          </div>
          
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Policy</a>
          </div>
          
          <div className="made-with-love">
            Made with <Heart size={16} className="text-red-500 fill-red-500" /> for Placement Task
          </div>
        </div>
      </div>
    </footer>
  );

  // Quote Modal Component
  const QuoteModal = () => {
    if (!showQuoteModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">Get a Free Quote</h3>
            <button 
              className="modal-close"
              onClick={() => setShowQuoteModal(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="modal-content">
            {quoteSuccess ? (
              <div className="success-message">
                <div className="success-icon">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="mb-8">
                  Your quote request has been submitted successfully. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setQuoteSuccess(false)}
                  className="btn btn-primary"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                    className="form-input"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div className="grid md-grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Project Type</label>
                    <select
                      value={quoteForm.projectType}
                      onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                      className="form-input"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile App</option>
                      <option value="design">UI/UX Design</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="consultation">Consultation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Budget Range</label>
                    <select
                      value={quoteForm.budget}
                      onChange={(e) => setQuoteForm({...quoteForm, budget: e.target.value})}
                      className="form-input"
                      required
                    >
                      <option value="">Select Budget</option>
                      <option value="1-5k">$1,000 - $5,000</option>
                      <option value="5-15k">$5,000 - $15,000</option>
                      <option value="15-30k">$15,000 - $30,000</option>
                      <option value="30k+">$30,000+</option>
                      <option value="not-sure">Not Sure Yet</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Project Description *</label>
                  <textarea
                    value={quoteForm.description}
                    onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                    className="form-input"
                    placeholder="Tell us about your project..."
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={quoteLoading}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {quoteLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Quote Request
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal CSS (add to global.css)
  const modalStyles = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
    }
    
    .modal {
      background: white;
      border-radius: 1rem;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 0;
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .modal-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }
    
    .modal-close:hover {
      background: #f1f5f9;
      color: #475569;
    }
    
    .modal-content {
      padding: 1.5rem;
    }
  `;

  return (
    <>
      <style>{modalStyles}</style>
      <div className="App">
        <Header />
        <main>
          <Hero />
          <ProjectsSection />
          <ClientsSection />
          <ContactFormSection />
          <NewsletterSection />
        </main>
        <Footer />
        <QuoteModal />
      </div>
    </>
  );
}

export default App;