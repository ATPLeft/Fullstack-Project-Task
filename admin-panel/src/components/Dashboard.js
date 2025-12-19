import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '', image: null });
    const [newClient, setNewClient] = useState({ name: '', description: '', designation: '', image: null });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const [projRes, cliRes, conRes, subRes] = await Promise.all([
            axios.get('/api/projects'),
            axios.get('/api/clients'),
            axios.get('/api/contacts'),
            axios.get('/api/subscribers')
        ]);
        setProjects(projRes.data);
        setClients(cliRes.data);
        setContacts(conRes.data);
        setSubscribers(subRes.data);
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProject.name);
        formData.append('description', newProject.description);
        formData.append('image', newProject.image);
        
        await axios.post('/api/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        fetchAllData();
        setNewProject({ name: '', description: '', image: null });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            {/* Project Management */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <input type="text" placeholder="Project Name" 
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        className="border p-2 w-full"
                    />
                    <textarea placeholder="Description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        className="border p-2 w-full"
                    />
                    <input type="file"
                        onChange={(e) => setNewProject({...newProject, image: e.target.files[0]})}
                        className="border p-2 w-full"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2">
                        Add Project
                    </button>
                </form>
                
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">All Projects ({projects.length})</h3>
                    {/* Display projects list */}
                </div>
            </section>

            {/* Similar sections for Clients, Contacts, Subscribers */}
            
            {/* Contacts Table */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Contact Form Responses ({contacts.length})</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Mobile</th>
                            <th className="border p-2">City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => (
                            <tr key={index}>
                                <td className="border p-2">{contact.name}</td>
                                <td className="border p-2">{contact.email}</td>
                                <td className="border p-2">{contact.mobile}</td>
                                <td className="border p-2">{contact.city}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;