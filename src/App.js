import React from "react";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recipe from "./pages/Recipe";
import Search from "./pages/Search";
import AIChef from "./pages/AIChef"; // Import the new page
import SideBarLayout from "./layout/SideBarLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/ai-chef" element={<AIChef />} /> {/* New Route */}
          <Route
            path="/search/:keyword/:mealType"
            element={
              <SideBarLayout>
                <Search />
              </SideBarLayout>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;