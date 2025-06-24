import Hero from "@/Components/Homepage/Hero";
import About from "@/Components/Homepage/About";
import Stats from "@/Components/Homepage/Stats";
import EventHomepage from "@/Components/Homepage/EventHomepage";
import Announcements from "@/Components/Homepage/Announcements";
import Newsletter from "@/Components/Homepage/Newsletter";
import Register from "@/Components/Homepage/Register";
import Navbar from "@/Components/Homepage/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <EventHomepage />
      <Announcements />
      <Newsletter />
      <Register />
    </div>
  );
};
