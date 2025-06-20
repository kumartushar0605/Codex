"use client";
import React, { useState, useEffect } from "react";
import {
  Github,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Twitter,
  Users,
  Code,
  GitCommit,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Star,
  Award,
  BookOpen,
  Zap,
  Target,
  Menu,
  X,
  ArrowRight,
  Play,
  CheckCircle,
  Bell,
  ExternalLink,
} from "lucide-react";
import Register from "./Register";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle scroll for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "events",
        "announcements",
        "register",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Members",
      value: "150+",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code,
      label: "Projects",
      value: "45+",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: GitCommit,
      label: "Commits",
      value: "3.2K+",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      label: "Achievements",
      value: "25+",
      color: "from-orange-500 to-red-500",
    },
  ];

  const events = [
    {
      title: "HackSOA 2025",
      date: "July 15-16, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "ITER Campus",
      type: "Hackathon",
      description:
        "Annual 48-hour hackathon with exciting prizes and industry mentors.",
      status: "upcoming",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Web Development Workshop",
      date: "June 28, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 1",
      type: "Workshop",
      description: "Learn modern web development with React and Node.js.",
      status: "upcoming",
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Competitive Programming Contest",
      date: "June 22, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Online Platform",
      type: "Contest",
      description:
        "Test your algorithmic skills in our monthly coding contest.",
      status: "upcoming",
      color: "from-green-500 to-teal-500",
    },
  ];

  const announcements = [
    {
      title: "New Mentorship Program Launch",
      date: "June 15, 2025",
      content:
        "We are excited to announce our new mentorship program pairing seniors with juniors for coding guidance.",
      priority: "high",
    },
    {
      title: "Summer Internship Opportunities",
      date: "June 10, 2025",
      content:
        "Check out the latest internship opportunities shared by our industry partners.",
      priority: "medium",
    },
    {
      title: "Club Meeting Schedule Update",
      date: "June 5, 2025",
      content:
        "Our weekly meetings are now scheduled every Saturday at 2 PM in the computer lab.",
      priority: "low",
    },
  ];

  const NavLink = ({ href, children, isActive }) => (
    <button
      onClick={() => scrollToSection(href)}
      className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
        isActive
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
          : "text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <span className="text-white font-black text-lg">C</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  codex
                </span>
                <p className="text-xs text-gray-400 -mt-1">SOA ITER</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "events", label: "Events" },
                { id: "announcements", label: "Announcements" },
                { id: "register", label: "Register" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <NavLink
                  key={item.id}
                  href={item.id}
                  isActive={activeSection === item.id}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 px-2 bg-slate-800/95 backdrop-blur-xl rounded-b-xl">
              <div className="flex flex-col space-y-2">
                {[
                  { id: "home", label: "Home" },
                  { id: "about", label: "About" },
                  { id: "events", label: "Events" },
                  { id: "announcements", label: "Announcements" },
                  { id: "register", label: "Register" },
                  { id: "contact", label: "Contact" },
                ].map((item) => (
                  <NavLink
                    key={item.id}
                    href={item.id}
                    isActive={activeSection === item.id}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-16"
      >
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-cyan-400 font-medium text-lg">
                A Community of Coders from ITER
              </p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  We Code,
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  We Explore
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Join our vibrant community of passionate developers, innovators,
                and tech enthusiasts at Siksha 'O' Anusandhan University.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon
                    size={20}
                    className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                  />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("register")}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Join Our Community</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <a
                href="#"
                className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl font-semibold text-white hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Github size={20} />
                <span>Visit GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Character Circle */}
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-full border border-slate-600/50 flex items-center justify-center relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center rotate-12 animate-bounce">
                  <Code size={24} className="text-white" />
                </div>
                <div className="absolute top-12 right-12 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center -rotate-12 animate-pulse">
                  <span className="text-white font-bold">{}</span>
                </div>
                <div className="absolute bottom-16 left-12 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping"></div>
                <div className="absolute bottom-12 right-16 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center rotate-45">
                  <Play size={20} className="text-white -rotate-45" />
                </div>

                {/* Central Developer Icon */}
                <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Users size={48} className="text-white" />
                </div>
              </div>

              {/* Floating Code Snippets */}
              <div className="absolute -top-4 -left-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 rotate-12 animate-float">
                <div className="text-sm font-mono">
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-cyan-400">codex</span> =
                  <span className="text-green-400"> "awesome"</span>;
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 -rotate-12 animate-float-delayed">
                <div className="text-sm font-mono">
                  <span className="text-orange-400">function</span>{" "}
                  <span className="text-cyan-400">explore</span>() {"{"}
                  <br />
                  &nbsp;&nbsp;<span className="text-pink-400">return</span>{" "}
                  <span className="text-green-400">"innovation"</span>;
                  <br />
                  {"}"}
                </div>
              </div>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-white">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                About Codex
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A community of coders learning and exploring together at Siksha
              'O' Anusandhan University (ITER)
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To foster a collaborative environment where students can enhance their coding skills, work on innovative projects, and prepare for successful tech careers.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Zap,
                title: "What We Do",
                description:
                  "We organize workshops, hackathons, coding contests, and tech talks. We also provide mentorship and guidance for competitive programming and development.",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: BookOpen,
                title: "Learning Focus",
                description:
                  "From web development to machine learning, from competitive programming to open source contributions - we cover all aspects of modern software development.",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        id="events"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Upcoming Events
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join our exciting events and expand your skills with fellow
              developers
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
                    <span
                      className={`px-3 py-1 bg-gradient-to-r ${event.color} rounded-full text-xs font-semibold text-white`}
                    >
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {event.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {event.description}
                  </p>

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
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
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
                      {announcement.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {announcement.date}
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
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Join our monthly newsletter
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest events, announcements, and
              opportunities from Codex
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

      {/* Register Section */}
      <section id="register" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Join Codex Today
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Become part of our growing community and start your journey in
              tech
            </p>
          </div>

          {/* <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8">
            <form className="space-y-6" action={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Enter your reg number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors">
                    <option value="">Select your branch</option>
                    <option value="cse">Computer Science & Engineering</option>
                    <option value="it">Information Technology</option>
                    <option value="ece">Electronics & Communication</option>
                    <option value="eee">Electrical & Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button>Submit</button>
            </form>
          </div> */}
          <Register />
        </div>
      </section>
    </div>
  );
};

export default Home;
