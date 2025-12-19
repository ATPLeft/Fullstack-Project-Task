import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  location: string;
  createdAt: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-semibold tracking-wider">OUR WORK</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our portfolio of successful projects that showcase our expertise 
            in delivering exceptional digital solutions.
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-xl card-hover border border-gray-100"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin size={16} />
                      <span className="text-sm">{project.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar size={16} />
                      <span className="text-sm">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="flex items-center space-x-2 text-primary font-semibold hover:text-primary/80 transition-colors duration-300">
                      <span>Read More</span>
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Project Card (Static) */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">+</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start New Project</h3>
              <p className="text-gray-600 text-center">Ready to begin your next big idea?</p>
              <button className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300">
                Get Quote
              </button>
            </div>
          </div>
        )}

        {/* View All Button */}
        {!loading && projects.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300">
              View All Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;