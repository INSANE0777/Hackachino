import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from '@/components/ui/button';
import { ArrowRight, X, Mail, Zap, Target } from 'lucide-react';
import Lenis from 'lenis';

const Landing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    // Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (lenis.destroy) lenis.destroy();
    };
  }, []);

  // Function to handle navigation and close modal
  const handleAuthNavigate = (path) => {
    setShowAuthModal(false);
    navigate(path);
  };


  // Reusable Card Component for Features
  const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-pop-white border-4 border-pop-black p-6 shadow-brutal transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition duration-200 flex flex-col items-center text-center">
      <div className="mb-4 text-pop-blue">{icon}</div>
      <h4 className="font-bebas text-2xl mb-3 tracking-wide">{title}</h4>
      <p className="text-gray-700 text-sm">{children}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-pop-white flex flex-col relative overflow-hidden font-sans">
      {/* --- Neo-Brutalist Background Elements --- */}
      {/* Using pop-colors defined conceptually (map to Tailwind colors) */}
      <div className="absolute -top-10 -left-12 w-32 h-32 bg-pop-yellow border-4 border-pop-black transform rotate-12 z-0 opacity-80"></div>
      <div className="absolute -bottom-16 -right-12 w-48 h-48 bg-pop-blue border-4 border-pop-black transform -rotate-12 z-0 rounded-full opacity-70"></div>
      <div className="absolute top-24 right-[-30px] w-20 h-20 bg-pop-red border-4 border-pop-black transform rotate-45 z-0"></div>
      <div className="absolute top-1/3 left-[-25px] w-24 h-24 bg-pop-pink border-4 border-pop-black transform -rotate-6 z-0 opacity-90"></div>
      <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-pop-green border-4 border-pop-black z-0 rotate-3"></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-pop-black border-2 border-pop-yellow rounded-full z-0"></div>
      <div className="absolute bottom-5 left-8 w-12 h-12 bg-pop-purple border-4 border-pop-black z-0 -rotate-45"></div>
      {/* --- End Background Elements --- */}

      {/* --- Hero Section --- */}
      <div className="relative flex-grow z-10 pt-6 pb-12 md:pt-8 md:pb-24 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-b from-blue-100 via-transparent to-transparent"></div>
        {/* Another background shape */}
        <div className="absolute top-10 left-1/2 w-16 h-16 bg-pop-green border-4 border-pop-black transform -translate-x-1/2 rotate-[22deg] z-0 opacity-75"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Navigation */}
          <nav className="flex justify-between items-center py-4 mb-10 md:mb-16">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-pop-yellow border-2 border-pop-black rotate-[-15deg] mr-2 group-hover:rotate-0 transition-transform"></div>
              <h1 className="text-3xl md:text-4xl font-bebas tracking-wider text-pop-black group-hover:text-pop-blue transition-colors">
                PopNews
              </h1>
            </Link>
            <div>
              {/* Use Button component for consistency */}
              <Button
                onClick={() => handleAuthNavigate('/auth?mode=signin')}
                variant="outline"
                className="bg-transparent text-pop-black hover:bg-pop-black hover:text-pop-white border-2 border-pop-black px-5 py-2 font-semibold mr-2 transition-all duration-200 shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000]"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-pop-blue text-pop-white hover:bg-blue-500 border-2 border-pop-black px-5 py-2 font-semibold transition-all duration-200 shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000]"
              >
                Get Started
              </Button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 md:space-y-8 text-center md:text-left">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas leading-none tracking-wide">
                YOUR NEWS, <br />
                <span className="bg-pop-yellow px-2 border-b-4 border-pop-black">AI-POWERED</span> <br />
                AND PERSONALIZED
              </h2>

              <p className="text-lg text-gray-700 max-w-md mx-auto md:mx-0">
                Stop scrolling endlessly. PopNews delivers the stories you care about, summarized by AI, directly to you. Fast, focused, and free.
              </p>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 pt-4">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-pop-black text-pop-white hover:bg-gray-800 text-lg py-3 px-8 font-bebas tracking-wider flex items-center group border-2 border-pop-black shadow-brutal hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all duration-150 w-full sm:w-auto"
                >
                  <span>START NOW</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                 <Link to="#features" className="text-sm font-semibold text-pop-blue hover:underline">
                   Learn More
                 </Link>
              </div>
            </div>

            {/* Image Block */}
            <div className="relative hidden md:block">
              <div className="absolute -top-4 -left-4 w-full h-full bg-pop-blue border-4 border-pop-black transform rotate-[-2deg] z-10"></div>
                <div className="relative p-3 border-4 border-pop-black bg-white z-20 transform rotate-1 shadow-brutal max-w-md mx-auto">
                <img
                  src="/img.png" // Path to image in public folder
                  alt="Person reading news on device"
                  className="w-full h-auto max-h-[300px] object-cover border-2 border-pop-black"
                />
                </div>
              {/* Image Accent */}
              <div className="absolute -bottom-5 -right-5 p-3 border-4 border-pop-black bg-pop-yellow shadow-brutal transform -rotate-6 z-30 max-w-[180px]">
                <div className="font-bebas text-lg text-center leading-tight">
                  AI SUMMARIES <br/> ON DEMAND
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Features Section --- */}
      <section id="features" className="bg-gray-100 py-16 md:py-24 relative z-10 border-t-4 border-b-4 border-pop-black">
         {/* Section specific shapes */}
         <div className="absolute top-[-10px] right-10 w-12 h-12 bg-pop-red border-4 border-pop-black transform rotate-[-30deg] z-0"></div>
         <div className="absolute bottom-[-15px] left-10 w-10 h-10 bg-pop-purple border-4 border-pop-black rounded-full z-0"></div>

        <div className="container mx-auto px-4">
          <h3 className="text-4xl md:text-5xl font-bebas text-center mb-12 md:mb-16 tracking-wider relative inline-block mx-auto left-1/2 transform -translate-x-1/2">
            <span className="bg-pop-yellow px-4 py-1 border-2 border-pop-black">WHY POPNEWS?</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             <FeatureCard icon={<Target size={36} strokeWidth={2}/>} title="Personalized Topics">
               Track specific companies, people, or concepts. Get news feeds tailored precisely to your interests.
             </FeatureCard>
             <FeatureCard icon={<Zap size={36} strokeWidth={2}/>} title="Real-Time Updates">
               Stay ahead with the latest articles from thousands of trusted sources worldwide, delivered instantly.
             </FeatureCard>
             <FeatureCard icon={<Mail size={36} strokeWidth={2}/>} title="AI Summaries">
               Understand key takeaways quickly. Our AI generates concise bullet points for every article.
             </FeatureCard>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="bg-pop-blue text-pop-black py-16 md:py-20 relative z-10 border-b-4 border-pop-black">
         {/* CTA specific shapes */}
         <div className="absolute top-[-10px] left-1/4 w-8 h-8 bg-pop-yellow border-4 border-pop-black transform rotate-[25deg] z-0"></div>
         <div className="absolute bottom-[-15px] right-1/4 w-10 h-10 bg-pop-pink border-4 border-pop-black z-0 rotate-[-10deg]"></div>

        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bebas mb-6 tracking-wide">
            READY TO CUT THROUGH THE NOISE?
          </h3>
          <div className="max-w-2xl mx-auto mb-8 bg-pop-white py-4 px-6 border-4 border-pop-black shadow-brutal">
             <p className="text-lg">
                Join thousands reading smarter, not harder. Get your personalized, AI-summarized news feed today. It's free!
            </p>
          </div>
          <Button
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="bg-pop-yellow text-pop-black hover:bg-yellow-400 text-lg py-3 px-10 font-bebas tracking-wider border-2 border-pop-black shadow-brutal hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all duration-150"
          >
            GET STARTED FOR FREE
          </Button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-pop-black text-pop-white py-16 px-4 relative z-10 border-t-4 border-pop-yellow">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12 items-start mb-12">
            {/* Branding & Info */}
            <div>
              <h2 className="text-4xl font-bebas tracking-widest text-pop-yellow">POPNEWS</h2>
              <p className="text-gray-400 mt-2 text-sm">Your AI-powered news companion.</p>
              <div className="mt-6 flex space-x-3">
                <div className="w-5 h-5 bg-pop-yellow border-2 border-pop-white rotate-45"></div>
                <div className="w-5 h-5 bg-pop-blue border-2 border-pop-white rotate-12"></div>
                <div className="w-5 h-5 bg-pop-pink border-2 border-pop-white -rotate-12"></div>
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex flex-col space-y-3">
              <h4 className="text-xl font-bebas tracking-wider mb-2 text-gray-300">QUICK LINKS</h4>
              {/* Use actual Links or anchor tags pointing to sections */}
              <a href="#" className="hover:translate-x-1.5 transition-transform duration-200 ease-in-out text-gray-400 hover:text-pop-white font-semibold">HOME</a>
              <a href="/dashboard/topics" className="hover:translate-x-1.5 transition-transform duration-200 ease-in-out text-gray-400 hover:text-pop-white font-semibold">MANAGE TOPICS</a>
              <a href="/dashboard/feed" className="hover:translate-x-1.5 transition-transform duration-200 ease-in-out text-gray-400 hover:text-pop-white font-semibold">MY FEED</a>
              <a href="#" onClick={() => handleAuthNavigate('/auth?mode=signin')} className="hover:translate-x-1.5 transition-transform duration-200 ease-in-out text-gray-400 hover:text-pop-white font-semibold">SIGN IN</a>
            </nav>

            {/* Newsletter (Simple Example) */}
            <div>
              <h4 className="text-xl font-bebas tracking-wider mb-4 text-gray-300">STAY UPDATED</h4>
              <form className="flex items-stretch">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  aria-label="Your email for newsletter"
                  className="px-4 py-2 flex-grow bg-pop-white text-pop-black border-2 border-pop-black font-semibold placeholder-gray-500 focus:outline-none focus:border-pop-blue"
                />
                <button
                  type="submit"
                  className="bg-pop-yellow hover:bg-yellow-400 border-y-2 border-r-2 border-pop-black px-4 py-2 font-bebas tracking-wide text-pop-black transition-all shadow-[2px_2px_0px_rgba(255,255,255,0.3)] hover:shadow-[1px_1px_0px_rgba(255,255,255,0.3)]"
                >
                  SUBMIT
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">Occasional updates, no spam.</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <span>© {new Date().getFullYear()} PopNews. All rights reserved.</span>
            <span className="mt-4 md:mt-0">Made with <span className="text-pop-red">♥</span> & <span className="text-pop-yellow">⚡</span></span>
          </div>
        </div>

        {/* Animated Footer Shapes */}
        <div className="absolute top-6 left-6 w-5 h-5 bg-pop-pink border-2 border-pop-white animate-bounce-slow opacity-80" />
        <div className="absolute bottom-6 right-6 w-6 h-6 bg-pop-green border-2 border-pop-white animate-pulse opacity-80" />
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pop-blue border-2 border-pop-white rotate-45 animate-spin-slow opacity-80" />

        {/* Minimal CSS for animations if not fully covered by Tailwind config */}
        <style jsx>{`
          @keyframes spin-slow {
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
           @keyframes bounce-slow {
             0%, 100% { transform: translateY(-15%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
             50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
           }
           .animate-bounce-slow {
              animation: bounce-slow 2s infinite;
           }
        `}</style>
      </footer>

      {/* --- Authentication Modal --- */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
          onClick={() => setShowAuthModal(false)} // Close on overlay click
        >
          <div
            className="bg-pop-white p-8 border-4 border-pop-black shadow-brutal relative max-w-sm w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-pop-in"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            style={{ animationFillMode: 'forwards' }} // Keep final state of animation
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              aria-label="Close modal"
              className="absolute top-2 right-2 text-pop-black hover:text-pop-red transition-colors p-1 border-2 border-transparent hover:border-pop-black"
            >
              <X size={24} strokeWidth={3}/>
            </button>

            {/* Modal Content */}
            <h3 className="text-3xl font-bebas text-center mb-6 tracking-wide">JOIN POPNEWS</h3>
            <p className="text-center text-gray-600 mb-6 text-sm">
              Sign in to access your feed or sign up to get started.
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => handleAuthNavigate('/auth?mode=signin')}
                className="w-full bg-pop-black text-pop-white hover:bg-gray-800 border-2 border-pop-black py-3 font-semibold shadow-[3px_3px_0px_#A3A3A3] hover:shadow-[1px_1px_0px_#A3A3A3] hover:-translate-y-0.5 transition-all duration-150"
              >
                Sign In
              </Button>
              <Button
                 onClick={() => handleAuthNavigate('/auth?mode=signup')}
                 className="w-full bg-pop-yellow text-pop-black hover:bg-yellow-400 border-2 border-pop-black py-3 font-semibold shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:-translate-y-0.5 transition-all duration-150"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      )}
       {/* Keyframes for modal animation (optional, could be in global CSS) */}
        <style jsx global>{`
          @keyframes modal-pop-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-modal-pop-in {
            animation: modal-pop-in 0.2s ease-out;
          }
        `}</style>
    </div>
  );
};

export default Landing;