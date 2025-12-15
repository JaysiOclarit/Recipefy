import { useQuery } from "react-query";

const useSearch = (keyword, pageNumber, pageSize, mealType) => {
  const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

  // fetch food by keyword and meal type
  const fetchFood = async () => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${keyword}&addRecipeInformation=true&number=${pageSize}&offset=${
        pageSize * pageNumber
      }&type=${mealType}`
    );

    const data = await response.json();
    return data.results;
  };
  return useQuery(
    ["recipes", keyword, pageNumber, pageSize, mealType],
    fetchFood,
    {
      refetchOnWindowFocus: false,
      staleTime: 60000, // cache for 1 minute
    }
  );
};

export default useSearch;
