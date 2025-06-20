import {Users,Code,GitCommit,Award} from "lucide-react"
export default function Stats() {
    const stats = [
        { icon: Users, label: 'Members', value: '150+', color: 'from-blue-500 to-cyan-500' },
        { icon: Code, label: 'Projects', value: '45+', color: 'from-purple-500 to-pink-500' },
        { icon: GitCommit, label: 'Commits', value: '3.2K+', color: 'from-green-500 to-emerald-500' },
        { icon: Award, label: 'Achievements', value: '25+', color: 'from-orange-500 to-red-500' }
      ];
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
    
};
