"use client";

import { useState, useEffect } from "react";
import Preloader from "@/Components/PreLoader";

import Hero from "@/Components/Homepage/Hero";
import About from "@/Components/Homepage/About";
import Stats from "@/Components/Homepage/Stats";
import EventHomepage from "@/Components/Homepage/EventHomepage";
import Announcements from "@/Components/Homepage/Announcements";
import Newsletter from "@/Components/Homepage/Newsletter";
import Navbar from "@/Components/Homepage/Navbar";
import Contact from "@/Components/Homepage/Contact";
import Community from "./Community";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // Check if preloader has been shown in this session
  useEffect(() => {
    const hasShownPreloader = sessionStorage.getItem('codex_preloader_shown');
    
    if (hasShownPreloader) {
      // If preloader has been shown before in this session, skip it
      setLoading(false);
    } else {
      // If preloader hasn't been shown, mark it as shown and show it
      sessionStorage.setItem('codex_preloader_shown', 'true');
      setLoading(true);
    }
  }, []);

  const handlePreloaderFinish = () => setLoading(false);

  if (loading) return <Preloader onFinish={handlePreloaderFinish} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <Stats />
      <section id="about">
        <About />
      </section>
      <section id="events">
        <EventHomepage />
      </section>
      <section id="announcements">
        <Announcements />
      </section>
      <Newsletter />
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
