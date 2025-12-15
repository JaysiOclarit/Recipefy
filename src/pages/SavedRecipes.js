import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import FoodCard from '../components/FoodCard';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        
        let allRecipes = [];

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // 1. Fetch Normal Recipes (from Spoonacular IDs)
          if (userData.savedRecipes?.length > 0) {
            const ids = userData.savedRecipes.join(",");
            const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY; 
            // Note: Make sure your .env file is set up!
            
            const response = await fetch(
              `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}&apiKey=${API_KEY}`
            );
            const apiData = await response.json();
            allRecipes = [...allRecipes, ...apiData];
          }

          // 2. Fetch AI Recipes (Stored directly in Firestore)
          if (userData.savedAIRecipes?.length > 0) {
            allRecipes = [...allRecipes, ...userData.savedAIRecipes];
          }
        }

        setSavedRecipes(allRecipes);

      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSavedRecipes(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-6 py-24 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">❤️ My Favorite Recipes</h1>
        
        {loading ? (
           <div className="flex justify-center mt-20">
             <p className="text-xl text-gray-500">Loading your cookbook...</p>
           </div>
        ) : savedRecipes.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-xl text-gray-500 mb-4">You haven't saved any recipes yet.</p>
            <a href="/" className="text-green-500 underline hover:text-green-600">Go find some yummy food!</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRecipes.map(recipe => (
              <FoodCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SavedRecipes;