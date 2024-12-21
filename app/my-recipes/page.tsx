"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaUtensils } from "react-icons/fa6";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { TypographyH2 } from "@/components/ui/Typography/TypographyH2";
import { TypographyP } from "@/components/ui/Typography/TypographyP";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id: number;
  recipe_name: string;
  food_type: string;
  ingredients: Ingredient[];
  procedure: { step: string }[];
  image: string;
  user_id: string;
}

const Page = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        setRecipes(data as Recipe[]);
      }
    } catch (err) {
      console.error("Error connecting to Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchRecipes();
    }
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <FaArrowLeft className="mr-2" />
            </Link>
          </Button>
          <TypographyH2 className="border-b-0">My Recipes</TypographyH2>
          <Button
            onClick={fetchRecipes}
            variant="outline"
            className="border-primary"
          >
            Refresh Recipes
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="overflow-hidden transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative h-48">
                  {/* <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.recipe_name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  /> */}
                  <div className="absolute top-2 right-2 rounded-full p-2">
                    {recipe.food_type === "vegetarian" ? (
                      <Leaf className="text-green-600" />
                    ) : (
                      <FaUtensils className="text-red-600" />
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{recipe.recipe_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    <span className="font-semibold">Type:</span>{" "}
                    {recipe.food_type === "vegetarian"
                      ? "Vegetarian"
                      : "Non-Vegetarian"}
                  </TypographyP>
                  <div className="mb-4">
                    <TypographyP className="font-semibold mb-2">
                      Ingredients:
                    </TypographyP>
                    <ul className="list-disc pl-5 space-y-1">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="text-gray-700">
                          {ing.name} -{" "}
                          <span className="text-gray-600">{ing.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <TypographyP className="font-semibold mb-2">
                      Procedure:
                    </TypographyP>
                    <ol className="list-decimal pl-5 space-y-2">
                      {recipe.procedure.map((stepObj, idx) => (
                        <li key={idx} className="text-gray-700">
                          {stepObj.step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUtensils className="mx-auto text-6xl text-indigo-300 mb-4" />
            <TypographyP>No recipes added yet. Start cooking!</TypographyP>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
