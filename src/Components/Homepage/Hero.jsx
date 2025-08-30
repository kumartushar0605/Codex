"use client"
import { 
    Github, 
    Instagram, 
    Linkedin, 
    Youtube, 
    Facebook, 
    Twitter,
    Users,
    Code,
    ArrowRight,
    Play,
  } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero(){
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
      }
    };

    return(
        <section id="home" className="min-h-screen flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-cyan-400 font-medium text-lg">A Community of Coders from ITER</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">We Code,</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">We Explore</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Join our vibrant community of passionate developers, innovators, and tech enthusiasts at Siksha 'O' Anusandhan University.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Github, href: 'https://github.com/codex-iter', label: 'GitHub' },
                { icon: Instagram, href: 'https://instagram.com/codex_iter', label: 'Instagram' },
                { icon: Linkedin, href: 'https://linkedin.com/company/codex-iter', label: 'LinkedIn' },
                { icon: Youtube, href: 'https://youtube.com/@codex-iter', label: 'YouTube' },
                { icon: Facebook, href: 'https://facebook.com/codex.iter', label: 'Facebook' },
                { icon: Twitter, href: 'https://twitter.com/codex_iter', label: 'Twitter' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer"
                  aria-label={social.label}
                >
                  <social.icon size={20} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('register')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Join Our Community</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="https://github.com/codex-iter"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl font-semibold text-white hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
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
                  <span className="text-white font-bold">{ }</span>
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
                  <span className="text-purple-400">const</span> <span className="text-cyan-400">codex</span> = 
                  <span className="text-green-400"> "awesome"</span>;
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 -rotate-12 animate-float-delayed">
                <div className="text-sm font-mono">
                  <span className="text-orange-400">function</span> <span className="text-cyan-400">explore</span>() {'{'}
                  <br />
                  &nbsp;&nbsp;<span className="text-pink-400">return</span> <span className="text-green-400">"innovation"</span>;
                  <br />
                  {'}'}
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
    )
}