import {
  Target, BookOpen,
  Zap,
} from "lucide-react"
const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
              About Codex
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A community of coders learning and exploring together at Siksha 'O' Anusandhan University (ITER)
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Our Mission",
              description: "To foster a collaborative environment where students can enhance their coding skills, work on innovative projects, and prepare for successful tech careers.",
              color: "from-pink-500 to-rose-500"
            },
            {
              icon: Zap,
              title: "What We Do",
              description: "We organize workshops, hackathons, coding contests, and tech talks. We also provide mentorship and guidance for competitive programming and development.",
              color: "from-cyan-500 to-blue-500"
            },
            {
              icon: BookOpen,
              title: "Learning Focus",
              description: "From web development to machine learning, from competitive programming to open source contributions - we cover all aspects of modern software development.",
              color: "from-green-500 to-emerald-500"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About