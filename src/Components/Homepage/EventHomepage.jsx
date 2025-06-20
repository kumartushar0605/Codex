import {Calendar,ArrowRight,MapPin} from "lucide-react"
export default function EventHomepage() {
    const events = [
        {
          title: 'HackSOA 2025',
          date: 'July 15-16, 2025',
          time: '9:00 AM - 6:00 PM',
          location: 'ITER Campus',
          type: 'Hackathon',
          description: 'Annual 48-hour hackathon with exciting prizes and industry mentors.',
          status: 'upcoming',
          color: 'from-pink-500 to-rose-500'
        },
        {
          title: 'Web Development Workshop',
          date: 'June 28, 2025',
          time: '2:00 PM - 5:00 PM',
          location: 'Computer Lab 1',
          type: 'Workshop',
          description: 'Learn modern web development with React and Node.js.',
          status: 'upcoming',
          color: 'from-blue-500 to-indigo-500'
        },
        {
          title: 'Competitive Programming Contest',
          date: 'June 22, 2025',
          time: '10:00 AM - 2:00 PM',
          location: 'Online Platform',
          type: 'Contest',
          description: 'Test your algorithmic skills in our monthly coding contest.',
          status: 'upcoming',
          color: 'from-green-500 to-teal-500'
        }
      ];
    return (
        <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Upcoming Events
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join our exciting events and expand your skills with fellow developers
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className={`h-2 bg-gradient-to-r ${event.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 bg-gradient-to-r ${event.color} rounded-full text-xs font-semibold text-white`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-400">{event.status}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{event.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin size={16} className="mr-2" />
                      {event.location}
                    </div>
                  </div>

                  <button className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-cyan-500/50 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 group">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
    
};
