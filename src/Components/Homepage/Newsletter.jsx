export default function Newsletter() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Join our monthly newsletter
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest events, announcements, and opportunities from Codex
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    )
    
};
