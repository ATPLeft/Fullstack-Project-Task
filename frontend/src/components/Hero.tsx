import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-6">
              🚀 Trusted by 500+ Companies
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your Digital{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We create stunning digital solutions that drive growth and engage customers. 
              Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex items-center justify-center gap-2">
                Start Project <ArrowRight size={20} />
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors duration-300">
                <Play size={20} className="text-primary" />
                <span className="font-semibold">Watch Demo</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">250+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-3xl -z-10"></div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/10 rounded-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;