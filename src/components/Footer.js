import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Brand */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Recipefy
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Your daily dose of culinary inspiration.
            </p>
          </div>

          {/* Links / Info */}
          <div className="flex gap-8 text-sm font-medium">
            <a href="/" className="hover:text-green-400 transition">Home</a>
            <a href="/search/random/all" className="hover:text-green-400 transition">Recipes</a>
            <a href="/ai-chef" className="hover:text-green-400 transition">AI Chef</a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Recipefy. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <p>Made with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;