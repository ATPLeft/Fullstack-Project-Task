import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Quote } from 'lucide-react';

interface Client {
  _id: string;
  name: string;
  description: string;
  designation: string;
  image: string;
  createdAt: string;
}

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-semibold tracking-wider">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Happy <span className="text-primary">Clients</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear what our clients have to say about their experience working with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Main Testimonial Carousel */}
            <div className="relative max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                
                {clients.length > 0 && (
                  <div className="mb-8">
                    <p className="text-xl text-gray-700 italic mb-8">
                      "{clients[activeIndex]?.description}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={clients[activeIndex]?.image.startsWith('http') 
                            ? clients[activeIndex]?.image 
                            : `http://localhost:5000${clients[activeIndex]?.image}`}
                          alt={clients[activeIndex]?.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <Star size={14} className="text-white fill-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-xl font-bold text-gray-900">
                          {clients[activeIndex]?.name}
                        </h4>
                        <p className="text-gray-600">{clients[activeIndex]?.designation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2">
                  {clients.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex ? 'bg-primary w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Client Logos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-16">
              {clients.slice(0, 5).map((client, index) => (
                <div 
                  key={client._id}
                  className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer ${
                    index === activeIndex 
                      ? 'ring-2 ring-primary transform scale-105' 
                      : 'hover:shadow-xl hover:-translate-y-1'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={client.image.startsWith('http') ? client.image : `http://localhost:5000${client.image}`}
                      alt={client.name}
                      className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-gray-50"
                    />
                    <h4 className="font-bold text-gray-900">{client.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{client.designation}</p>
                    
                    {/* Rating Stars */}
                    <div className="flex mt-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className="text-accent fill-accent" 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Stats Banner */}
        <div className="mt-20 bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-200">Client Retention</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">250+</div>
              <div className="text-gray-200">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-200">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5★</div>
              <div className="text-gray-200">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;