import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleUserInput = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}/all`);
    }
  };

  // Quick tags for modern UX
  const popularTags = ["Chicken", "Pasta", "Vegan", "Dessert"];

  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-background bg-cover bg-center transform scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="z-10 w-full max-w-3xl animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-white mb-4 drop-shadow-sm">
          Recipefy
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 font-medium mb-8">
          Discover. Cook. Enjoy. <br/> Your personal AI-powered kitchen companion.
        </p>

        {/* Modern Glass Search Bar */}
        <form onSubmit={handleSearch} className="w-full flex flex-col items-center">
          <div className="relative w-full md:w-2/3 group">
            <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl p-2 transition-all duration-300 focus-within:bg-white/20 focus-within:scale-105">
              
              <input
                type="text"
                className="w-full bg-transparent text-white placeholder-gray-300 px-6 py-3 outline-none text-lg font-medium"
                placeholder="What are you craving? (e.g. Sushi)"
                onChange={handleUserInput}
                required
              />
              
              <button 
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 transition duration-300 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="text-gray-300 text-sm font-medium">Trending:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/search/${tag}/all`)}
              className="px-3 py-1 text-sm text-white bg-white/10 border border-white/10 rounded-full hover:bg-green-500 hover:border-green-500 transition-all duration-300 backdrop-blur-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;