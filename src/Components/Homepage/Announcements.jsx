import { useEffect, useState } from "react";
import { announcementAPI } from "@/services/api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementAPI.getAllAnnouncements();
        setAnnouncements(response.data || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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

        {loading ? (
          <p className="text-center text-gray-400">Loading announcements...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-400">No announcements available.</p>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        announcement.priority === "high"
                          ? "bg-red-500"
                          : announcement.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } animate-pulse`}
                    ></div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        announcement.priority === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : announcement.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {announcement.priority?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {announcement.date || "Unknown Date"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {announcement.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
