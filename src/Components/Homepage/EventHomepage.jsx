"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EventHomepage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/event/events");
      console.log("API raw response:", response.data);

      const allEvents = response.data.data; // <-- FIX HERE

      if (!Array.isArray(allEvents)) {
        throw new Error("Expected an array of events.");
      }

      const shuffledEvents = allEvents.sort(() => 0.5 - Math.random());
      setEvents(shuffledEvents.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events.");
      setLoading(false)
    }
  };

  fetchEvents();
}, []);


  if (loading) {
    return <div className="text-center py-10 text-gray-300">Loading events...</div>;
  }

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

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <div className={`h-2 bg-gradient-to-r ${event.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 bg-gradient-to-r ${event.color} rounded-full text-xs font-semibold text-white`}>
                    {event.type}
                  </span>
                  <span className="text-xs text-gray-400">Upcoming</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{event.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin size={16} className="mr-2" />
                    {event.location}
                  </div>
                </div>

                <button
                  onClick={() => router.push("/events")}
                  className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-cyan-500/50 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Learn More</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/events")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
          >
            View All Events
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}