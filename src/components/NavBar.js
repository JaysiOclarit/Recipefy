import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, signInWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Add scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 px-6 py-4 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-white/20 text-slate-800"
          : "bg-transparent text-white" // Transparent at top of home
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
           <span className={`text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-green-600' : 'text-white'}`}>
             Recipefy
           </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 font-medium">
          <Link to="/" className="hover:text-green-500 transition">Home</Link>
          <Link to="/search/random/all" className="hover:text-green-500 transition">Recipes</Link>
          <Link to="/ai-chef" className="hover:text-green-500 transition">AI Chef</Link>
          
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-300/30">
              <Link to="/saved" className="hover:text-green-500 transition">Favorites</Link>
              <img 
                src={user.photoURL} 
                alt="User" 
                className="w-9 h-9 rounded-full border-2 border-green-500 shadow-sm" 
              />
              <button 
                onClick={logout} 
                className="bg-red-50/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-full text-sm transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle} 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;