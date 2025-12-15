import React from "react";
import { Link } from "react-router-dom";
import breakfast from "../img/icon/breakfast.png";
import dessert from "../img/icon/dessert.png";
import dinner from "../img/icon/dinner.png";
import soup from "../img/icon/soup.png";
import bread from "../img/icon/bread.png";
import salad from "../img/icon/salad.png";
import appetizer from "../img/icon/appetizer.png";
import drink from "../img/icon/drink.png";

const MealType = () => {
  const meals = [
    { name: "Breakfast", image: breakfast },
    { name: "Dessert", image: dessert },
    { name: "Dinner", image: dinner },
    { name: "Soup", image: soup },
    { name: "Bread", image: bread },
    { name: "Salad", image: salad },
    { name: "Appetizer", image: appetizer },
    { name: "Drink", image: drink },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
        Explore by Category
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {meals.map((meal) => (
          <Link
            key={meal.name}
            to={`/search/random/${meal.name}`}
            className="flex flex-col items-center justify-center w-28 h-28 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 group"
          >
            <img
              src={meal.image}
              alt={meal.name}
              className="w-10 h-10 mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
            />
            <span className="text-sm font-semibold text-slate-600 group-hover:text-green-600">
              {meal.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MealType;