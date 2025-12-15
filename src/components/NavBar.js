import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, signInWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm text-white py-4 fixed w-full z-40 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        <div className="flex items-center flex-shrink-0 mr-6">
          <a href="/" className="text-2xl font-bold tracking-wide text-green-400">
            Recipefy
          </a>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="/" className="hover:text-green-400 transition">Home</a>
          <Link to={`/search/random/all`} className="hover:text-green-400 transition">Recipes</Link>
          <Link to="/ai-chef" className="hover:text-green-400 transition">AI Chef</Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/saved" className="hover:text-green-400 transition font-bold">Favorites</Link>
              <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-green-500" />
              <button onClick={logout} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition text-sm">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="bg-green-500 px-4 py-1 rounded hover:bg-green-600 transition text-sm">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;