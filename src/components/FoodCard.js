import React from "react";
import { Link } from "react-router-dom";
import SaveButton from "./SaveButton";

const FoodCard = ({ recipe }) => {
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageUrl =
    (recipe.image &&
      (isValidUrl(recipe.image)
        ? recipe.image
        : `https://spoonacular.com/recipeImages/${recipe.image}`)) ||
    "https://via.placeholder.com/300x150?text=No%20Image";

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100">
      
      {/* Save Button */}
      <SaveButton recipeId={recipe.id} />

      <Link to={`/recipe/${recipe.id}`}>
        {/* Image Container with Zoom Effect */}
        <div className="relative h-48 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={imageUrl}
            alt={recipe.title}
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          
          {/* Time Badge */}
          <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recipe.readyInMinutes || 20} min
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>
          <div className="h-1 w-12 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;