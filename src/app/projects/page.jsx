"use client";
import React, { useState, useEffect } from "react";
import { projectAPI } from "@/services/api";
import { toast } from "react-toastify";
import Navbar from "@/Components/Homepage/Navbar";

const initialForm = {
  title: "",
  description: "",
  githubLink: "",
  liveLink: "",
  techStack: [],
  videoLink: "",
  images: [],
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.getAllProjects();
      if (res.success) setProjects(res.data);
      else toast.error(res.message || "Failed to fetch projects");
    } catch (e) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!form.techStack.includes(techInput.trim())) {
        setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setForm({ 
      ...form, 
      techStack: form.techStack.filter(tech => tech !== techToRemove) 
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleRemoveImage = (index) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newImagePreview = imagePreview.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreview[index]);
    
    setSelectedImages(newSelectedImages);
    setImagePreview(newImagePreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic frontend validation
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    if (form.techStack.length === 0) {
      toast.error("At least one technology is required");
      return;
    }
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('liveLink', form.liveLink);
      formData.append('repoLink', form.githubLink);
      formData.append('videoLink', form.videoLink);
      
      // Append tech stack as JSON string
      formData.append('techStack', JSON.stringify(form.techStack));
      
      // Append images
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const res = await projectAPI.addProjectWithFiles(formData);
      if (res.success) {
        toast.success("Project added successfully!");
        setShowModal(false);
        setForm(initialForm);
        setTechInput("");
        setSelectedImages([]);
        setImagePreview([]);
        fetchProjects();
      } else {
        toast.error(res.message || "Failed to add project");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      <Navbar />
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main content with proper spacing for fixed navbar */}
      <div className="relative z-10 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                 {/* Header Section */}
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/25">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H3m16 4H5m14 4H3m16 4H5m14 4H3" />
               </svg>
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4 tracking-tight">
               Project Showcase
             </h1>
             <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
               Discover amazing projects created by our community members. Share your own work and inspire others.
             </p>
                         <button
               className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
               onClick={() => setShowModal(true)}
             >
               <span className="relative z-10 flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                 </svg>
                 Add Project
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             </button>
          </div>
        </div>

             {/* Add Project Modal */}
       {showModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-700/50 my-8 max-h-[85vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200 text-2xl z-10 bg-slate-800/50 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
                         <div className="text-center mb-4">
               <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg mb-3">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                 </svg>
               </div>
               <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                 Add New Project
               </h2>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                             <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
                 <input
                   type="text"
                   name="title"
                   value={form.title}
                   onChange={handleChange}
                   className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                   placeholder="Enter your project title"
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
                 <textarea
                   name="description"
                   value={form.description}
                   onChange={handleChange}
                   className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400 resize-none"
                   rows={3}
                   placeholder="Describe your project..."
                   required
                 />
               </div>
                             <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Tech Stack *</label>
                 <div className="space-y-2">
                   <input
                     type="text"
                     value={techInput}
                     onChange={(e) => setTechInput(e.target.value)}
                     onKeyDown={handleAddTech}
                     className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                     placeholder="Type technology and press Enter (e.g., React, Node.js, Python)"
                   />
                   {form.techStack.length > 0 && (
                     <div className="flex flex-wrap gap-1.5">
                       {form.techStack.map((tech, index) => (
                         <span 
                           key={index}
                           className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300"
                         >
                           {tech}
                           <button
                             type="button"
                             onClick={() => handleRemoveTech(tech)}
                             className="ml-1 text-cyan-400 hover:text-red-400 transition-colors"
                           >
                             ×
                           </button>
                         </span>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
                             <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">GitHub Link</label>
                 <input
                   type="url"
                   name="githubLink"
                   value={form.githubLink}
                   onChange={handleChange}
                   className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                   placeholder="https://github.com/username/repo"
                   pattern="https?://.+"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Live Link</label>
                 <input
                   type="url"
                   name="liveLink"
                   value={form.liveLink}
                   onChange={handleChange}
                   className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                   placeholder="https://your-project.com"
                   pattern="https?://.+"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Video Demo Link</label>
                 <input
                   type="url"
                   name="videoLink"
                   value={form.videoLink}
                   onChange={handleChange}
                   className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                   placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                   pattern="https?://.+"
                 />
               </div>
                             <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Images (Max 5)</label>
                 <input
                   type="file"
                   multiple
                   accept="image/*"
                   onChange={handleImageChange}
                   className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                 />
                 {imagePreview.length > 0 && (
                   <div className="mt-3 grid grid-cols-2 gap-1.5">
                     {imagePreview.map((preview, index) => (
                       <div key={index} className="relative group">
                         <img
                           src={preview}
                           alt={`Preview ${index + 1}`}
                           className="w-full h-20 object-cover rounded-lg border border-slate-600"
                         />
                         <button
                           type="button"
                           onClick={() => handleRemoveImage(index)}
                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           ×
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
               <button
                 type="submit"
                 className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                 disabled={loading}
               >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  "Add Project"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

                          {/* Projects Grid */}
         <div className="max-w-7xl mx-auto">
           {loading && projects.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-24">
               <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
               <p className="text-2xl text-slate-400">Loading amazing projects...</p>
             </div>
                       ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H3m16 4H5m14 4H3m16 4H5m14 4H3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-4">No Projects Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Be the first to share your amazing project with the community!
                </p>
              </div>
                       ) : (
              <div className="space-y-6">
                {/* Projects count indicator */}
                <div className="text-center">
                  <p className="text-slate-400">
                    Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Projects grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {projects.map((project, index) => (
                     <div 
                       key={project._id} 
                       className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
                       style={{
                         animationDelay: `${index * 100}ms`,
                         animation: 'fadeInUp 0.6s ease-out forwards'
                       }}
                     >
                       <div className="flex items-start justify-between mb-3">
                         <div className="flex-1">
                           <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text mb-2 group-hover:from-cyan-200 group-hover:to-purple-200 transition-all duration-300">
                             {project.title}
                           </h3>
                           <p className="text-slate-300 text-sm leading-relaxed mb-3">
                             {project.description}
                           </p>
                                                    {project.techStack && project.techStack.length > 0 && (
                             <div className="flex flex-wrap gap-1.5 mb-3">
                               {project.techStack.map((tech, index) => (
                                 <span 
                                   key={index}
                                   className="px-2 py-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-300"
                                 >
                                   {tech}
                                 </span>
                               ))}
                             </div>
                           )}
                           {project.images && project.images.length > 0 && (
                             <div className="mb-3">
                               <div className="flex gap-1.5 overflow-x-auto pb-2">
                                 {project.images.slice(0, 3).map((image, index) => (
                                   <img
                                     key={index}
                                     src={image}
                                     alt={`${project.title} screenshot ${index + 1}`}
                                     className="w-12 h-12 object-cover rounded-lg border border-slate-600/50 flex-shrink-0"
                                   />
                                 ))}
                                 {project.images.length > 3 && (
                                   <div className="w-12 h-12 bg-slate-700/50 rounded-lg border border-slate-600/50 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                                     +{project.images.length - 3}
                                   </div>
                                 )}
                               </div>
                             </div>
                           )}
                       </div>
                     </div>
                     
                                            <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                         {(project.repoLink || project.githubLink) && (
                           <a 
                             href={project.repoLink || project.githubLink} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 group/link"
                           >
                             <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:scale-110" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                             </svg>
                             GitHub
                           </a>
                         )}
                         {project.liveLink && (
                           <a 
                             href={project.liveLink} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="flex items-center gap-1.5 text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200 group/link"
                           >
                             <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                             </svg>
                             Live Demo
                           </a>
                         )}
                         {project.videoLink && (
                           <a 
                             href={project.videoLink} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200 group/link"
                           >
                             <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                             </svg>
                             Video
                           </a>
                         )}
                       </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>
       </div>

      {/* CSS for animations and scrollbar */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-track-slate-800::-webkit-scrollbar-track {
          background: rgb(30 41 59);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-cyan-500\/50::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-cyan-500\/50::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
