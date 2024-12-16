"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the type for an ingredient
interface Ingredient {
  name: string;
  quantity: string;
}

// Define the type for a recipe
interface Recipe {
  id: number;
  recipe_name: string;
  food_type: string;
  ingredients: Ingredient[]; // JSON array
  procedure: string;
  image: string;
  user_id: string;
}

const Page = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]); // State to store recipes
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user-specific recipes from Supabase
  const fetchRecipes = async () => {
    if (!user) return; // Ensure user is authenticated
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id); // Filter recipes by current user's ID

      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        setRecipes(data as Recipe[]); // Explicitly cast to Recipe[]
      }
    } catch (err) {
      console.error("Error connecting to Supabase:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch recipes when component mounts and user is authenticated
  useEffect(() => {
    if (isLoaded && user) {
      fetchRecipes();
    }
  }, [user, isLoaded]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Recipes</h1>

      {loading ? (
        <p className="text-center">Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{recipe.recipe_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Food Type:</strong>{" "}
                  {recipe.food_type === "vegetarian"
                    ? "Vegetarian"
                    : "Non-Vegetarian"}
                </p>
                <p>
                  <strong>Ingredients:</strong>
                </p>
                <ul className="list-disc pl-6">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      {ing.name} - {ing.quantity}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">
                  <strong>Procedure:</strong> {recipe.procedure}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recipes added yet.</p>
      )}

      <div className="text-center mt-6">
        <Button onClick={fetchRecipes} variant="outline">
          Refresh Recipes
        </Button>
      </div>
    </div>
  );
};

export default Page;
