import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore'; // Firebase imports
import { db, auth } from '../firebase'; // Firebase config

// NOTE: It is better to use process.env.REACT_APP_GEMINI_API_KEY
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const AIChef = () => {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null); // New state for AI messages
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); 

  const generateRecipe = async () => {
    if(!prompt) return;
    setLoading(true);
    setRecipe(null);
    setErrorMsg(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // We explicitly ask for JSON, but if the AI refuses, it will return text.
      const fullPrompt = `Create a detailed recipe based on: "${prompt}". 
      Return JSON with fields: title, readyInMinutes, ingredients (array of strings), instructions (array of strings).`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json|```/g, ''); 
      
      try {
        // Try to parse the response as a Recipe
        const data = JSON.parse(text);
        
        // Add custom IDs for our app
        data.id = Date.now(); 
        data.image = "https://via.placeholder.com/640x360?text=AI+Chef+Special"; 
        data.isCustom = true; 
        
        setRecipe(data);
      } catch (parseError) {
        // !!! THIS HANDLES THE REFUSAL !!!
        // If JSON.parse fails, it means the AI sent a text message (refusal or clarification).
        // We set that text as the error message to display to the user.
        console.warn("AI returned text instead of JSON:", text);
        setErrorMsg(text);
      }

    } catch (error) {
      console.error(error);
      setErrorMsg("The AI Chef encountered a connection issue. Please try again.");
    }
    setLoading(false);
  };

  const saveRecipe = async () => {
    if (!auth.currentUser) return alert("Please login to save recipes!");
    setSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { email: auth.currentUser.email }, { merge: true });
      await updateDoc(userRef, { savedAIRecipes: arrayUnion(recipe) });
      alert("Recipe Saved to Favorites!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save recipe.");
    }
    setSaving(false);
  };

  // Helper to prevent "Objects are not valid" crashes
  const renderIngredient = (ing) => {
    if (typeof ing === 'object' && ing !== null) {
      return `${ing.quantity || ''} ${ing.unit || ''} ${ing.name || ''}`;
    }
    return ing;
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-6 py-24 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">👩‍🍳 AI Chef</h1>
          <p className="text-gray-600 mb-4">Tell me what ingredients you have, and I'll create a recipe!</p>
          
          <textarea 
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            rows="3"
            placeholder="I have chicken, rice, and broccoli..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button 
            onClick={generateRecipe}
            disabled={loading}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            {loading ? "Cooking..." : "Generate Recipe"}
          </button>

          {/* DISPLAY ERROR MESSAGE IF AI REFUSES */}
          {errorMsg && (
            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl text-center animate-fade-in">
              <div className="text-4xl mb-2">👮‍♂️</div>
              <h3 className="text-red-600 font-bold mb-2">Chef's Response</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{errorMsg}</p>
            </div>
          )}

          {/* DISPLAY RECIPE IF SUCCESSFUL */}
          {recipe && (
            <div className="mt-8 border-t pt-6 relative">
              <button 
                onClick={saveRecipe}
                disabled={saving}
                className="absolute top-6 right-0 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow hover:bg-red-600 transition"
              >
                {saving ? "Saving..." : "❤️ Save Recipe"}
              </button>

              <h2 className="text-2xl font-bold text-gray-800 pr-20">{recipe.title}</h2>
              <p className="text-gray-500 mb-4">⏱️ {recipe.readyInMinutes} Minutes</p>
              
              <h3 className="font-bold text-lg mb-2">Ingredients:</h3>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{renderIngredient(ing)}</li>
                ))}
              </ul>

              <h3 className="font-bold text-lg mb-2">Instructions:</h3>
              <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AIChef;