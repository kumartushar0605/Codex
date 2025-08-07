"use client"
import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Users, GraduationCap, Crown, Star } from 'lucide-react';

const Community = () => {
  const [members, setMembers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/managedUsers/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch community data');
      }
      
      const result = await response.json();
      const users = result.data || [];

      const currentMembers = users.filter(user =>
        user.role?.toLowerCase() !== 'alumni' && user.role?.toLowerCase() !== 'alumnus'
      );
      const alumniUsers = users.filter(user =>
        user.role?.toLowerCase() === 'alumni' || user.role?.toLowerCase() === 'alumnus'
      );

      setMembers(shuffleArray(currentMembers));
      setAlumni(shuffleArray(alumniUsers));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const organizeMembers = (membersList) => {
    const faculty = membersList.filter(member => 
      member.role?.toLowerCase().includes('teacher') || 
      member.role?.toLowerCase().includes('faculty')
    );
    
    const coordinators = membersList.filter(member => 
      member.role?.toLowerCase().includes('coordinator') && 
      !member.role?.toLowerCase().includes('teacher') && 
      !member.role?.toLowerCase().includes('faculty')
    );
    
    const teamLeads = membersList.filter(member => 
      member.role?.toLowerCase().includes('team lead')
    );
    
    const regularMembers = membersList.filter(member => 
      member.role?.toLowerCase() === 'member' || 
      member.role?.toLowerCase() === 'members' ||
      (!member.role?.toLowerCase().includes('teacher') && 
       !member.role?.toLowerCase().includes('faculty') && 
       !member.role?.toLowerCase().includes('coordinator') && 
       !member.role?.toLowerCase().includes('team lead') &&
       member.role?.toLowerCase() !== 'alumni' &&
       member.role?.toLowerCase() !== 'alumnus')
    );

    return { faculty, coordinators, teamLeads, regularMembers };
  };

  const extractTeamLeadRole = (role) => {
    if (role?.toLowerCase().includes('team lead')) {
      return role.replace(/team lead\s*-?\s*/i, '').trim() || 'General';
    }
    return role;
  };

  const getRoleIcon = (role) => {
    const lowerRole = role?.toLowerCase() || '';
    if (lowerRole.includes('teacher') || lowerRole.includes('faculty')) return <GraduationCap className="w-5 h-5" />;
    if (lowerRole.includes('coordinator')) return <Star className="w-5 h-5" />;
    if (lowerRole.includes('team lead')) return <Crown className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  const MemberCard = ({ member }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 p-6 border border-gray-100 overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <img 
            src={member.githubDP || '/api/placeholder/120/120'} 
            alt={member.name}
            className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
            
          />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg">
            {getRoleIcon(member.role)}
            <span className="font-semibold">
              {member.role?.toLowerCase().includes('team lead') 
                ? extractTeamLeadRole(member.role) 
                : member.role}
            </span>
          </div>
        </div>
        
        <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {member.name}
        </h3>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full mb-4 border border-blue-100">
          <span className="text-sm font-medium text-gray-700">{member.skill}</span>
        </div>
        
        <div className="flex gap-3">
          {member.github && (
            <a 
              href={member.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.linkedin && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.twitter && (
            <a 
              href={member.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
        isActive
          ? 'bg-white text-blue-600 shadow-xl'
          : 'bg-blue-800/30 text-white hover:bg-blue-700/40 backdrop-blur-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
        <span className={`px-2 py-1 rounded-full text-sm ${
          isActive ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-white'
        }`}>
          {count}
        </span>
      </div>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl"></div>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-purple-400 border-b-transparent animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Community</h2>
          <p className="text-blue-200">Fetching all members and alumni...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20">
          <div className="text-red-400 text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-white mb-4">Error Loading Community</h2>
          <p className="text-red-200 mb-6 text-lg">{error}</p>
          <button 
            onClick={fetchCommunityData}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { faculty, coordinators, teamLeads, regularMembers } = organizeMembers(members);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Meet Our Community
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Discover the brilliant minds and passionate individuals who drive our community forward
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-blue-900/50 backdrop-blur-md p-2 rounded-3xl shadow-2xl border border-blue-400/20">
            <div className="flex gap-4">
              <TabButton
                id="members"
                label="Members"
                icon={<Users className="w-6 h-6" />}
                count={members.length}
                isActive={activeTab === 'members'}
                onClick={() => setActiveTab('members')}
              />
              <TabButton
                id="alumni"
                label="Alumni"
                icon={<GraduationCap className="w-6 h-6" />}
                count={alumni.length}
                isActive={activeTab === 'alumni'}
                onClick={() => setActiveTab('alumni')}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-500">
          {activeTab === 'members' && (
            <div className="space-y-16">
              {/* Faculty Coordinators */}
              {faculty.length > 0 && (
                <section className="animate-fadeIn">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl backdrop-blur-sm border border-green-400/30">
                      <GraduationCap className="w-8 h-8 text-green-400" />
                      Faculty Coordinator
                    </h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                  </div>
                  {/* Center single faculty coordinator */}
                  <div className="flex justify-center mb-8">
                    <div className="w-full max-w-sm">
                      {faculty.map((member, index) => (
                        <div key={`faculty-${member._id || index}`} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                          <MemberCard member={member} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Coordinators */}
              {coordinators.length > 0 && (
                <section className="animate-fadeIn">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-yellow-400/30">
                      <Star className="w-8 h-8 text-yellow-400" />
                      Coordinators
                    </h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {coordinators.map((member, index) => (
                      <div key={`coordinator-${member._id || index}`} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        <MemberCard member={member} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Team Leads */}
              {teamLeads.length > 0 && (
                <section className="animate-fadeIn">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-400/30">
                      <Crown className="w-8 h-8 text-purple-400" />
                      Team Leads
                    </h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teamLeads.map((member, index) => (
                      <div key={`teamlead-${member._id || index}`} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        <MemberCard member={member} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Regular Members */}
              {regularMembers.length > 0 && (
                <section className="animate-fadeIn">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-sm border border-blue-400/30">
                      <Users className="w-8 h-8 text-blue-400" />
                      Members
                    </h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {regularMembers.map((member, index) => (
                      <div key={`member-${member._id || index}`} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        <MemberCard member={member} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'alumni' && alumni.length > 0 && (
            <section className="animate-fadeIn">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                <h3 className="text-3xl font-bold text-white flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl backdrop-blur-sm border border-purple-400/30">
                  <GraduationCap className="w-8 h-8 text-purple-400" />
                  Our Alumni
                </h3>
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {alumni.map((member, index) => (
                  <div key={`alumni-${member._id || index}`} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {((activeTab === 'members' && members.length === 0) || 
            (activeTab === 'alumni' && alumni.length === 0)) && (
            <div className="text-center py-20 animate-fadeIn">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-md mx-auto border border-white/20">
                {activeTab === 'members' ? (
                  <Users className="w-24 h-24 text-blue-300 mx-auto mb-6" />
                ) : (
                  <GraduationCap className="w-24 h-24 text-purple-300 mx-auto mb-6" />
                )}
                <h3 className="text-2xl font-bold text-white mb-4">
                  No {activeTab === 'members' ? 'Members' : 'Alumni'} Found
                </h3>
                <p className="text-blue-200">
                  {activeTab === 'members' 
                    ? 'Check back later as we grow our community!' 
                    : 'No alumni records available at the moment.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Community;