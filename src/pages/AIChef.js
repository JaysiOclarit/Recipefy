import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_KEY = "AIzaSyAOSdnORJbrUU7hoVFPLI_0jxwLDNy0PFY"; // Get from aistudio.google.com
const genAI = new GoogleGenerativeAI(API_KEY);

const AIChef = () => {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if(!prompt) return;
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const fullPrompt = `Create a detailed recipe based on: "${prompt}". 
      Return JSON with fields: title, readyInMinutes, ingredients (array), instructions (array of strings).`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json|```/g, ''); // Clean markdown
      setRecipe(JSON.parse(text));
    } catch (error) {
      console.error(error);
      alert("AI Chef is busy! Try again.");
    }
    setLoading(false);
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

          {recipe && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-800">{recipe.title}</h2>
              <p className="text-gray-500 mb-4">⏱️ {recipe.readyInMinutes} Minutes</p>
              
              <h3 className="font-bold text-lg mb-2">Ingredients:</h3>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
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