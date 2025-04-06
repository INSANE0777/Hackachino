import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Newspaper, Settings, CheckCircle } from 'lucide-react';

const Navigation = () => {
  // Active link style
  const activeStyle = "bg-pop-yellow text-pop-black";
  const baseStyle = "flex items-center justify-center px-4 py-2 border-2 border-pop-black hover:bg-pop-yellow hover:text-pop-black transition-colors font-medium shadow-brutal hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all duration-150";
  
  return (
    <nav className="bg-pop-white border-b-4 border-pop-black py-2">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap gap-2 justify-center md:justify-start">
          <li>
            <NavLink 
              to="/app" 
              className={({ isActive }) => 
                `${baseStyle} ${isActive ? activeStyle : 'bg-pop-white'}`
              }
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="font-bebas text-center">HOME</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/feed" 
              className={({ isActive }) => 
                `${baseStyle} ${isActive ? activeStyle : 'bg-pop-white'}`
              }
            >
              <Newspaper className="w-4 h-4 mr-2" />
              <span className="font-bebas text-center">NEWS FEED</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/topics" 
              className={({ isActive }) => 
                `${baseStyle} ${isActive ? activeStyle : 'bg-pop-white'}`
              }
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="font-bebas text-center">TOPICS</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/factchecker" 
              className={({ isActive }) => 
                `${baseStyle} ${isActive ? activeStyle : 'bg-pop-white'}`
              }
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-bebas text-center">FACT CHECKER</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
