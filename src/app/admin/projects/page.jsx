"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Check, X, Calendar, Users, Code, Filter, Search } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';

const ProjectsPage = () => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration and admin dashboard',
      team: 'Team Alpha',
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      status: 'Approved',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      submitted: '2024-06-15',
      category: 'Web Development',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Chat Application',
      description: 'Real-time messaging app with file sharing and group chat features',
      team: 'Team Beta',
      teamMembers: ['Alice Brown', 'Bob Wilson'],
      status: 'Pending',
      tech: ['Socket.io', 'Express', 'React Native', 'Firebase'],
      submitted: '2024-06-18',
      category: 'Mobile App',
      priority: 'Medium'
    },
    {
      id: 3,
      title: 'AI Study Assistant',
      description: 'Machine learning powered study companion with personalized recommendations',
      team: 'Team Gamma',
      teamMembers: ['Sarah Davis', 'Tom Anderson', 'Lisa Chen'],
      status: 'In Review',
      tech: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL'],
      submitted: '2024-06-20',
      category: 'AI/ML',
      priority: 'High'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleProjectAction = (projectId, action) => {
    setProjects(projects.map(project =>
      project.id === projectId ? {
        ...project,
        status: action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : action
      } : project
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Admin authentication check
  useEffect(() => {
    if (!adminLoading && !adminAuthenticated) {
      router.push('/');
    }
  }, [adminAuthenticated, adminLoading, router]);

  // Show loading while checking admin authentication
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!adminAuthenticated) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">Project Management</h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">Manage and review student project submissions</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto justify-center flex-shrink-0">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects, teams, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-200 placeholder-slate-400 text-sm sm:text-base"
            />
          </div>
          <div className="relative flex-shrink-0">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 sm:py-3 bg-slate-800/50 text-white border border-slate-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-200 text-sm sm:text-base appearance-none cursor-pointer w-full sm:w-[160px]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 min-h-[80px] flex flex-col justify-center">
            <div className="text-cyan-400 text-lg sm:text-2xl font-bold tabular-nums">{projects.length}</div>
            <div className="text-slate-400 text-xs sm:text-sm">Total Projects</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 min-h-[80px] flex flex-col justify-center">
            <div className="text-yellow-400 text-lg sm:text-2xl font-bold tabular-nums">{projects.filter(p => p.status === 'Pending').length}</div>
            <div className="text-slate-400 text-xs sm:text-sm">Pending</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 min-h-[80px] flex flex-col justify-center">
            <div className="text-green-400 text-lg sm:text-2xl font-bold tabular-nums">{projects.filter(p => p.status === 'Approved').length}</div>
            <div className="text-slate-400 text-xs sm:text-sm">Approved</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50 min-h-[80px] flex flex-col justify-center">
            <div className="text-blue-400 text-lg sm:text-2xl font-bold tabular-nums">{projects.filter(p => p.status === 'In Review').length}</div>
            <div className="text-slate-400 text-xs sm:text-sm">In Review</div>
          </div>
        </div>
      </div>
      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center text-slate-400 py-12 sm:py-16 lg:py-20">
          <Code className="mx-auto mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-700/40" />
          <p className="text-base sm:text-lg">No projects found matching your criteria</p>
          <p className="text-sm text-slate-500 mt-2">Try adjusting your search or filter settings</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/50 hover:shadow-xl transition-shadow duration-200 group relative overflow-hidden">
                {/* Priority indicator */}
                <div className={`absolute top-0 right-0 w-1 h-full ${getPriorityColor(project.priority)} opacity-60`}></div>

                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="text-lg font-bold text-cyan-200 group-hover:text-cyan-400 transition-colors duration-200 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2 line-clamp-2">{project.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)} flex-shrink-0`}>
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <Users className="w-3 h-3" />
                      <span>Team</span>
                    </div>
                    <div className="text-white font-medium">{project.team}</div>
                    <div className="text-slate-400 text-xs">{project.teamMembers.length} members</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>Submitted</span>
                    </div>
                    <div className="text-white font-medium">{new Date(project.submitted).toLocaleDateString()}</div>
                    <div className="text-slate-400 text-xs">{project.category}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-1 text-slate-400 mb-2">
                    <Code className="w-3 h-3" />
                    <span className="text-xs">Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, index) => (
                      <span key={index} className="bg-cyan-900/50 text-cyan-200 px-2 py-1 rounded text-xs border border-cyan-800/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {(project.status === 'Pending' || project.status === 'In Review') && (
                    <>
                      <button
                        onClick={() => handleProjectAction(project.id, 'approve')}
                        className="flex-1 bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-2 rounded-lg hover:bg-green-600/30 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => handleProjectAction(project.id, 'reject')}
                        className="flex-1 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <X className="h-3 w-3" /> Reject
                      </button>
                    </>
                  )}
                  <button className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-1 text-sm">
                    <Eye className="h-3 w-3" /> View
                  </button>
                  <button className="bg-slate-600/20 text-slate-400 border border-slate-500/30 px-3 py-2 rounded-lg hover:bg-slate-600/30 transition-colors flex items-center justify-center gap-1 text-sm">
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-slate-900/80 rounded-xl shadow-lg overflow-hidden border border-slate-700/50">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/4">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/8">Team</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/6">Tech Stack</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/8">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/8">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/8">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-1/6">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900/40 divide-y divide-slate-700/50">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 h-20">
                        <div className="flex items-center gap-3 h-full">
                          <div className={`w-1 h-12 rounded-full ${getPriorityColor(project.priority)} flex-shrink-0`}></div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-cyan-200 group-hover:text-cyan-400 transition-colors truncate">
                              {project.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 truncate">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 h-20">
                        <div className="text-sm text-slate-300 truncate">{project.team}</div>
                        <div className="text-xs text-slate-400">{project.teamMembers.length} members</div>
                      </td>
                      <td className="px-6 py-4 h-20">
                        <div className="flex flex-wrap gap-1">
                          {project.tech.slice(0, 2).map((tech, index) => (
                            <span key={index} className="bg-cyan-900/50 text-cyan-200 px-2 py-1 rounded text-xs border border-cyan-800/50 whitespace-nowrap">
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 2 && (
                            <span className="text-slate-400 text-xs px-2 py-1 whitespace-nowrap">+{project.tech.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 h-20">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)} whitespace-nowrap`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 h-20">
                        <div className="text-sm text-slate-300 truncate">{project.category}</div>
                        <div className="text-xs text-slate-400 whitespace-nowrap">{project.priority} Priority</div>
                      </td>
                      <td className="px-6 py-4 h-20 text-sm text-slate-300 whitespace-nowrap">
                        {new Date(project.submitted).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {(project.status === 'Pending' || project.status === 'In Review') && (
                            <>
                              <button
                                onClick={() => handleProjectAction(project.id, 'approve')}
                                className="text-green-400 hover:text-green-300 bg-green-600/20 hover:bg-green-600/30 p-2 rounded transition-colors"
                                title="Approve project"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleProjectAction(project.id, 'reject')}
                                className="text-red-400 hover:text-red-300 bg-red-600/20 hover:bg-red-600/30 p-2 rounded transition-colors"
                                title="Reject project"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="text-blue-400 hover:text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 p-2 rounded transition-colors"
                            title="View project details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-slate-400 hover:text-slate-300 bg-slate-600/20 hover:bg-slate-600/30 p-2 rounded transition-colors"
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300 bg-red-600/20 hover:bg-red-600/30 p-2 rounded transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsPage;