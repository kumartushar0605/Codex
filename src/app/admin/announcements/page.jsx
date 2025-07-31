"use client";
import React, { useState } from 'react';
import { Bell, Plus, Edit, Trash2 } from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'New Coding Challenge Released', content: 'Weekly challenge on dynamic programming is now live!', date: '2024-06-20', pinned: true },
    { id: 2, title: 'Hackathon Registration Open', content: 'Register now for our annual hackathon!', date: '2024-06-18', pinned: false }
  ]);

  const togglePinAnnouncement = (id) => {
    setAnnouncements(announcements.map(ann =>
      ann.id === id ? { ...ann, pinned: !ann.pinned } : ann
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Announcement</span>
        </button>
      </div>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className={`bg-white rounded-xl shadow-lg p-6 ${announcement.pinned ? 'border-l-4 border-yellow-400' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                {announcement.pinned && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pinned</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => togglePinAnnouncement(announcement.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    announcement.pinned
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{announcement.content}</p>
            <p className="text-sm text-gray-500">Posted on {announcement.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;