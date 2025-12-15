import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchRecipe from "../hooks/useFetchRecipe";
import LoadIcon from "../img/icon/loading.gif";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SaveButton from "../components/SaveButton";
import { db, auth } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Recipe = () => {
  const { id } = useParams();
  const isAIRecipe = id && String(id).length > 10;
  const { data: apiRecipe, isLoading: apiLoading, isError: apiError } = useFetchRecipe(id);
  const [aiRecipe, setAiRecipe] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAIRecipe) {
      setAiLoading(true);
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const savedAI = userDoc.data().savedAIRecipes || [];
              const found = savedAI.find(r => String(r.id) === String(id));
              if (found) setAiRecipe(found);
            }
          } catch (error) { console.error(error); }
        }
        setAiLoading(false);
      });
      return () => unsubscribe();
    }
  }, [id, isAIRecipe]);

  const recipe = isAIRecipe ? aiRecipe : apiRecipe;
  const isLoading = isAIRecipe ? aiLoading : apiLoading;
  const isError = isAIRecipe ? (!aiRecipe && !aiLoading) : apiError; 

  if (isLoading) return <div className="h-screen flex justify-center items-center bg-slate-50"><img src={LoadIcon} className="h-12" alt="Loading"/></div>;
  if (isError || !recipe) return <div className="h-screen flex justify-center items-center">Recipe Not Found</div>;

  const recipeImage = recipe.image && recipe.image.startsWith("http")
    ? recipe.image
    : `https://spoonacular.com/recipeImages/${recipe.image}`;

  const ingredientsList = recipe.extendedIngredients 
    ? recipe.extendedIngredients.map(i => i.original) 
    : recipe.ingredients; 

  return (
    <>
      <NavBar />
      <div className="bg-slate-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Header Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
             <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-96 md:h-full">
                   <SaveButton recipeId={recipe.id} />
                   <img src={recipeImage} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                   {isAIRecipe && <span className="inline-block bg-purple-100 text-purple-600 font-bold px-3 py-1 rounded-full text-xs w-fit mb-3">✨ AI Generated</span>}
                   <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">{recipe.title}</h1>
                   <div className="flex gap-6 text-slate-500 font-medium mb-6">
                      <div className="flex items-center gap-2">
                        <span>⏱️</span> {recipe.readyInMinutes} min
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👥</span> {recipe.servings || 2} servings
                      </div>
                   </div>
                   {recipe.summary && (
                      <div className="text-slate-600 leading-relaxed text-sm line-clamp-4" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                   )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Ingredients Card */}
             <div className="lg:col-span-1">
               <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
                 <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Ingredients</h2>
                 <ul className="space-y-3">
                   {ingredientsList && ingredientsList.map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                       <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                       {item}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>

             {/* Instructions */}
             <div className="lg:col-span-2">
               <div className="bg-white rounded-2xl shadow-lg p-8">
                 <h2 className="text-xl font-bold text-slate-800 mb-6">Instructions</h2>
                 <div className="space-y-8">
                    {recipe.analyzedInstructions?.[0]?.steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center shrink-0">
                          {step.number}
                        </div>
                        <p className="text-slate-600 leading-relaxed mt-1">{step.step}</p>
                      </div>
                    )) || recipe.instructions?.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center shrink-0">
                          {i+1}
                        </div>
                        <p className="text-slate-600 leading-relaxed mt-1">{step}</p>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Recipe;