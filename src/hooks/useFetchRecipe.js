import { useQuery } from "react-query";

const useFetchRecipe = (recipeId) => {
  // Make sure your .env file is set up, or paste your key here if testing
  const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

  const fetchRecipe = async () => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
    );
    // If the API returns that HTML error page, this line would usually fail
    const data = await response.json();
    return data;
  };

  // CHECK: Is this an AI ID? (AI IDs are long timestamps, usually > 10 digits)
  const isAIRecipe = recipeId && String(recipeId).length > 10;

  return useQuery(["recipe", recipeId], fetchRecipe, {
    refetchOnWindowFocus: false,
    staleTime: 60000, 
    cacheTime: 3600000, 
    // 🛑 CRITICAL FIX: Disable the query if it's an AI recipe!
    enabled: !isAIRecipe && !!recipeId, 
  });
};

export default useFetchRecipe;