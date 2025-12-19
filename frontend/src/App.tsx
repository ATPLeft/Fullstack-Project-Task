import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import ClientsSection from './components/ClientsSection';
import ContactForm from './components/ContactForm';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ProjectsSection />
        <ClientsSection />
        <ContactForm />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;