import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/app", label: "HOME", matches: ["/", "/app"] },
    { path: "/topics", label: "MANAGE TOPICS", matches: ["/topics"] },
    { path: "/feed", label: "NEWS FEED", matches: ["/feed"] }
  ];

  return (
    <nav className="bg-black py-4 border-b-4 border-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6">
          {navItems.map((item) => {
            const isActive = item.matches.includes(location.pathname);

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ 
                  color: isActive ? '#000000' : '#FFFFFF',
                  backgroundColor: isActive ? '#FFFFFF' : '#000000',
                  borderColor: '#FFFFFF',
                  transform: isActive ? 'translateY(-4px)' : 'none',
                  boxShadow: isActive ? '4px 4px 0px 0px rgba(255,255,255,0.9)' : 'none',
                  fontFamily: "'Bebas Neue', sans-serif"
                }}
                className={`
                  relative px-6 py-3 font-bold tracking-wider text-lg
                  border-2 hover:bg-white hover:text-black
                  hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)]
                  transition-all duration-200 ease-in-out font-bebas
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Neo-brutalism decorative elements - now white */}
      <div className="absolute top-0 left-0 w-4 h-4 bg-white"></div>
      <div className="absolute top-0 right-0 w-4 h-4 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-white"></div>
    </nav>
  );
};

export default Navigation;
