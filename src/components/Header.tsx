import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "./Navigation"; // Assuming this component exists and is styled
import { Button } from "./ui/button"; // Assuming this is your ShadCN/custom button
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react"; // Added User icon for sign in

const NeoBrutalistHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // --- Button Styles (Neo Brutalist) ---
  const baseButtonStyles = `
    font-bold text-sm md:text-base
    border-2 border-pop-black
    px-4 py-2
    shadow-neo-sm hover:shadow-neo-hover active:shadow-neo-active
    transition-all duration-150 ease-out
    flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-pop-yellow focus:ring-offset-2 focus:ring-offset-pop-blue
  `;

  const signInButtonStyles = `
    bg-pop-yellow text-pop-black
    hover:bg-yellow-400 active:translate-x-[1px] active:translate-y-[1px]
  `;

  const signOutButtonStyles = `
    bg-pop-white text-pop-black
    hover:bg-gray-200 active:translate-x-[1px] active:translate-y-[1px]
  `;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b-4 border-pop-black select-none">
      {/* Top Bar: Logo, Tagline, Auth */}
      <div className="bg-pop-blue border-b-4 border-pop-black">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Logo Area */}
            <Link
              to="/app"
              className="group inline-block focus:outline-none focus:ring-2 focus:ring-pop-yellow focus:ring-offset-4 focus:ring-offset-pop-blue"
              aria-label="POPNEWS Home"
            >
              <h1
                className="
                  text-5xl md:text-6xl font-bebas text-pop-black
                  bg-pop-white px-3 py-1 border-2 border-pop-black
                  shadow-neo hover:shadow-neo-lg group-hover:-translate-x-1 group-hover:-translate-y-1
                  transition-all duration-150 ease-out cursor-pointer
                "
                style={{ textShadow: "2px 2px 0px var(--color-pop-blue)" }}
              >
                POP<span className="text-pop-blue">NEWS</span>
              </h1>
            </Link>

            {/* Right Side: Tagline & Auth */}
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
              {/* Tagline - More prominent */}
              <div
                className="
                  text-xs md:text-sm font-semibold tracking-tight
                  bg-pop-white text-pop-black
                  border-2 border-pop-black
                  px-3 py-1 shadow-neo-sm italic text-center md:text-left
                "
              >
                Your AI-Powered News Companion
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-2">
                    {user.email && (
                      <span className="text-sm font-medium text-pop-white hidden md:inline">
                        {user.email.split("@")[0]}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      className={`${baseButtonStyles} ${signOutButtonStyles}`}
                      onClick={handleSignOut}
                      aria-label="Sign Out"
                    >
                      <LogOut className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" className="focus:outline-none">
                    <Button
                      variant="default"
                      className={`${baseButtonStyles} ${signInButtonStyles}`}
                      aria-label="Sign In"
                    >
                      <User className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-pop-white border-b-4 border-pop-black shadow-md">
        <Navigation />
      </div>
    </header>
  );
};

export default NeoBrutalistHeader;
