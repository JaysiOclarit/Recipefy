import React from "react";
import useFetchPopularFood from "../hooks/useFetchPopularFood";
import FoodCard from "./FoodCard";
import loadingIcon from "../img/icon/loading.gif";

const PopularFoods = () => {
  // Fetch popular food, page 1, 9 items
  const { data, isLoading, isError } = useFetchPopularFood(1, 9);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <img src={loadingIcon} alt="Loading..." className="h-12 w-12" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        Oops! Could not load popular recipes.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
             <h2 className="text-3xl font-bold text-slate-800">Trending Now 🔥</h2>
             <p className="text-slate-500 mt-2">Recipes everyone is talking about.</p>
          </div>
          <a href="/search/random/all" className="text-green-600 font-bold hover:underline">View All &rarr;</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((food) => (
            <FoodCard key={food.id} recipe={food} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularFoods;