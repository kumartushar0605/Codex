"use client"
import React, { useState, useEffect } from 'react';
import {
    Menu,
    X,
    User,
    LogOut,
    Settings,
    Code
  } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
            import Link from 'next/link'; // assuming you're using Next.js



  export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout: userLogout, isAuthenticated: userAuthenticated } = useUser();
    const { admin, logout: adminLogout, isAuthenticated: adminAuthenticated } = useAdmin();
    const router = useRouter();

  // Scroll to section with offset for fixed navbar
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of the fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle scroll for active section with debounce
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const sections = ['home', 'about', 'events', 'announcements', 'register', 'contact'];
        const navbarHeight = 64;
        const scrollPosition = window.scrollY + navbarHeight + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }, 100); // Debounce delay
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);







  const NavLink = ({ href, children, isActive }) => (
    <button
      onClick={() => scrollToSection(href)}
      className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${isActive
        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
        : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50'
        }`}
    >
      {children}
    </button>
  );

  const handleLogout = async () => {
    if (adminAuthenticated) {
      await adminLogout();
      router.push('/auth');
    } else if (userAuthenticated) {
      await userLogout();
      router.push('/auth');
    }
  };

  const handleAuthClick = () => {
    router.push('/auth');
  };


  return(
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
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'contact', label: 'Contact' },
    { id: 'projects', label: 'Projects', isPage: true },
    { id: 'community', label: 'Community', isPage: true } // <- NEW
  ].map((item) => (
    item.isPage ? (
      <Link key={item.id} href={item.id === 'community' ? '/community' : `/${item.id}`}>
        <span className="px-4 py-2 cursor-pointer hover:text-blue-600 transition-colors">
          {item.label}
        </span>
      </Link>
    ) : (
      <NavLink key={item.id} href={item.id} isActive={activeSection === item.id}>
        {item.label}
      </NavLink>
    )
  ))}


              {/* Auth/User Section */}
              <div className="ml-4 relative">
                {adminAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => router.push('/admin')}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Code className="h-4 w-4" />
                      <span className="text-sm font-medium">Admin</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                ) : userAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300">{user?.fullName || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                )}
              </div>
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
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'contact', label: 'Contact' },
    { id: 'projects', label: 'Projects', isPage: true },
    { id: 'community', label: 'Community', isPage: true }
  ].map((item) =>
    item.isPage ? (
      <Link key={item.id} href={item.id === 'community' ? '/community' : `/${item.id}`}>
  <span className="block w-full text-center text-sm text-gray-300 hover:text-blue-500 transition-colors duration-200">
    {item.label}
  </span>
</Link>

    ) : (
      <NavLink
        key={item.id}
        href={item.id}
        isActive={activeSection === item.id}
      >
        {item.label}
      </NavLink>
    )
  )}

                {/* Mobile Auth Section */}
                <div className="pt-2 border-t border-slate-700/50">
                  {adminAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          router.push('/admin');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg"
                      >
                        <Code className="h-4 w-4" />
                        <span className="text-sm font-medium">Admin Panel</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  ) : userAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user?.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-300">{user?.fullName || 'User'}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
  )
    
  };
  