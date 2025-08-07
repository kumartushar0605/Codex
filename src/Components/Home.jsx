"use client";

import { useState, useEffect } from "react";
import Preloader from "@/Components/PreLoader";

import Hero from "@/Components/Homepage/Hero";
import About from "@/Components/Homepage/About";
import Stats from "@/Components/Homepage/Stats";
import EventHomepage from "@/Components/Homepage/EventHomepage";
import Announcements from "@/Components/Homepage/Announcements";
import Newsletter from "@/Components/Homepage/Newsletter";
import Register from "@/Components/Homepage/Contact";
import Navbar from "@/Components/Homepage/Navbar";
import Contact from "@/Components/Homepage/Contact";
import Community from "./Community";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const handlePreloaderFinish = () => setLoading(false);

  if (loading) return <Preloader onFinish={handlePreloaderFinish} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <EventHomepage />
      <Announcements />
      <Newsletter />
      <Contact />
    </div>
  );
};

export default Home;
