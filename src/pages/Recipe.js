import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchRecipe from "../hooks/useFetchRecipe"; // Uses the updated hook
import LoadIcon from "../img/icon/loading.gif";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SaveButton from "../components/SaveButton";
import { db, auth } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Recipe = () => {
  const { id } = useParams();
  
  // 1. Check if this is likely an AI ID (Timestamp > 10 digits)
  const isAIRecipe = id && String(id).length > 10;

  // 2. Try fetching from API (This will now be SKIPPPED if isAIRecipe is true)
  const { data: apiRecipe, isLoading: apiLoading, isError: apiError } = useFetchRecipe(id);

  // 3. State for AI Recipe (fetched from Firebase)
  const [aiRecipe, setAiRecipe] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // ONLY fetch from Firebase if it is an AI ID
    if (isAIRecipe) {
      setAiLoading(true);
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const savedAI = userDoc.data().savedAIRecipes || [];
              // Find the specific recipe by ID
              const found = savedAI.find(r => String(r.id) === String(id));
              if (found) {
                setAiRecipe(found);
              }
            }
          } catch (error) {
            console.error("Error finding AI recipe:", error);
          }
        }
        setAiLoading(false);
      });
      return () => unsubscribe();
    }
  }, [id, isAIRecipe]);

  // DECIDE WHICH DATA TO SHOW
  const recipe = isAIRecipe ? aiRecipe : apiRecipe;
  const isLoading = isAIRecipe ? aiLoading : apiLoading;
  
  // Error state: If it's AI, error is "not found in firebase". If API, use API error.
  const isError = isAIRecipe ? (!aiRecipe && !aiLoading) : apiError; 

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-200 flex justify-center items-center w-full">
        <img src={LoadIcon} alt="Loading..." className="h-2/4" />
      </div>
    );
  }

  // Not Found Error
  if (isError || !recipe) {
    return (
      <>
        <NavBar />
        <div className="h-screen bg-gray-200 flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-xl font-bold mb-4">Recipe Not Found</h1>
          <p className="mb-4">If this is an AI recipe, make sure you are logged in and have saved it.</p>
          <a href="/" className="text-blue-500 underline">Go Home</a>
        </div>
      </>
    );
  }

  // --- RENDER HELPERS ---

  // Image Helper
  const recipeImage = recipe.image && recipe.image.startsWith("http")
    ? recipe.image
    : recipe.image 
      ? `https://spoonacular.com/recipeImages/${recipe.image}`
      : "https://via.placeholder.com/640x360?text=No+Image";

  // Ingredients Helper (API uses 'extendedIngredients', AI uses 'ingredients' array)
  const ingredientsList = recipe.extendedIngredients 
    ? recipe.extendedIngredients.map(i => i.original) 
    : recipe.ingredients; 

  // Instructions Helper
  let instructionsRender;
  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    // API Format
    instructionsRender = recipe.analyzedInstructions.map((instruction, index) => (
      <div key={index} className="mb-4">
        <h3 className="font-bold mb-2">{instruction.name}</h3>
        <ol className="list-decimal ml-6">
          {instruction.steps.map((step) => (
            <li key={step.number}>{step.step}</li>
          ))}
        </ol>
      </div>
    ));
  } else if (recipe.instructions && Array.isArray(recipe.instructions)) {
    // AI Format
    instructionsRender = (
      <div className="mb-4">
        <ol className="list-decimal ml-6 space-y-2">
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container min-h-screen mx-auto px-6 py-24">
        <div className="flex flex-wrap">
          {/* Recipe image */}
          <div className="w-full lg:w-2/5 mb-4 relative">
             <SaveButton recipeId={recipe.id} />
            <img
              className="w-full h-auto rounded-lg shadow-lg"
              src={recipeImage}
              alt={recipe.title}
            />
          </div>
          
          {/* Recipe details */}
          <div className="w-full lg:w-3/5 lg:pl-6">
            <h1 className="text-3xl font-bold md:mb-5 mb-2">{recipe.title}</h1>
            
            {recipe.summary && (
              <div
                className="mb-4 indent-8 text-justify text-gray-600"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              ></div>
            )}
            
            <div className="flex flex-wrap border-b pb-4 mb-4">
              <div className="w-full md:w-1/2 mb-4">
                <h2 className="font-bold mb-2 text-xl text-green-600">Ingredients</h2>
                <ul className="list-disc ml-6 pr-2 text-gray-700">
                  {ingredientsList && ingredientsList.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/2 mb-4">
                <h2 className="font-bold mb-2 text-xl text-green-600">Details</h2>
                <p><strong>⏱️ Ready in:</strong> {recipe.readyInMinutes} minutes</p>
                {recipe.servings && <p><strong>👥 Servings:</strong> {recipe.servings}</p>}
                {isAIRecipe && <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-2">✨ AI Generated</span>}
              </div>
            </div>

            {/* Cooking process */}
            <div className="mt-8">
              <h2 className="font-bold mb-4 text-2xl text-green-600">Cooking Process</h2>
              {instructionsRender}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Recipe;