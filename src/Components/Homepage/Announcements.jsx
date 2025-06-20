export default function Announcements() {
    const announcements = [
        {
          title: 'New Mentorship Program Launch',
          date: 'June 15, 2025',
          content: 'We are excited to announce our new mentorship program pairing seniors with juniors for coding guidance.',
          priority: 'high'
        },
        {
          title: 'Summer Internship Opportunities',
          date: 'June 10, 2025',
          content: 'Check out the latest internship opportunities shared by our industry partners.',
          priority: 'medium'
        },
        {
          title: 'Club Meeting Schedule Update',
          date: 'June 5, 2025',
          content: 'Our weekly meetings are now scheduled every Saturday at 2 PM in the computer lab.',
          priority: 'low'
        }
      ];
    return (
        <section id="announcements" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Latest Announcements
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest news and important information
            </p>
          </div>

          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${announcement.priority === 'high' ? 'bg-red-500' :
                        announcement.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                      } animate-pulse`}></div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                      {announcement.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{announcement.date}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{announcement.title}</h3>
                <p className="text-gray-400 leading-relaxed">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
    
};
