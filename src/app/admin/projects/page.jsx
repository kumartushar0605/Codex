"use client";
import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Check, X } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([
    { id: 1, title: 'E-commerce Platform', team: 'Team Alpha', status: 'Approved', tech: 'React, Node.js', submitted: '2024-06-15' },
    { id: 2, title: 'Chat Application', team: 'Team Beta', status: 'Pending', tech: 'Socket.io, Express', submitted: '2024-06-18' }
  ]);

  const handleProjectAction = (projectId, action) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, status: action === 'approve' ? 'Approved' : 'Rejected' } : project
    ));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight drop-shadow">Project Management</h1>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Add Project</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Stack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.tech}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      project.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.submitted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {project.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleProjectAction(project.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleProjectAction(project.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;