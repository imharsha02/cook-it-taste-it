"use client";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Leaf, ChefHat } from "lucide-react";
import { supabase } from "../lib/supabase";
import RecipeCard from "../components/RecipeCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id: string;
  food_type: "vegetarian" | "nonVegetarian";
  image: string;
  ingredients: Ingredient[];
  procedure: { step: string }[];
  recipe_name: string;
  user_id: string;
}

const HomePage = () => {
  const { user, isSignedIn } = useUser();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      setRecipes(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipeToDelete || !user) return;

    try {
      const { data: recipeData, error: fetchError } = await supabase
        .from("recipes")
        .select("user_id")
        .eq("id", recipeToDelete)
        .single();

      if (fetchError) throw fetchError;

      if (recipeData.user_id !== user.id) {
        throw new Error("Unauthorized: You can only delete your own recipes");
      }

      const { error: deleteError } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeToDelete)
        .select();

      if (deleteError) throw deleteError;

      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeToDelete)
      );

      setDeleteConfirmOpen(false);
      setRecipeToDelete(null);
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setError("Failed to delete recipe. Please try again.");
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const getFilteredRecipes = (type: string | null) => {
    if (!type) {
      return recipes;
    }
    return recipes.filter((recipe) => recipe.food_type === type);
  };

  const renderRecipeGrid = (filteredRecipes: Recipe[]) => {
    if (loading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="aspect-video bg-gray-300 mb-4" />
              <div className="h-4 bg-gray-300 mb-2 w-3/4" />
              <div className="h-4 bg-gray-300 w-1/2" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    if (filteredRecipes.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No recipes found.
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSignedIn={!!isSignedIn} // Convert to boolean explicitly
            userId={user?.id || null}
            onDeleteClick={(recipeId) => {
              setRecipeToDelete(recipeId); // No need for Number() conversion
              setDeleteConfirmOpen(true);
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background/80">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="relative flex items-center justify-between mb-16">
            <div className="absolute inset-0 -z-10 h-48 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="flex-1 flex justify-center items-center relative w-full">
              <div className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                <ChefHat className="h-8 w-8 text-primary" />
                <Header />
              </div>
              <SignedIn>
                <div className="absolute right-0 flex items-center gap-4">
                  <UserButton />
                  <div className="flex gap-3">
                    <Button className="shadow-lg" size="lg" asChild>
                      <Link href="/add-recipe">Add Recipe</Link>
                    </Button>
                    <Button size="lg" asChild>
                      <Link href="/my-recipes">My Recipes</Link>
                    </Button>
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="absolute right-0 flex gap-3">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/sign-up">Sign up</Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>

          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <Tabs
                value={selectedTab || undefined}
                onValueChange={handleTabChange}
                className="w-full mx-auto"
              >
                <TabsList className="w-full h-14 justify-evenly p-1">
                  <TabsTrigger
                    value="vegetarian"
                    className="h-full px-4 transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Leaf className="mr-2 h-5 w-5" />
                    Vegetarian
                  </TabsTrigger>
                  <TabsTrigger
                    value="nonVegetarian"
                    className="h-full px-4 transition-all data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Utensils className="mr-2 h-5 w-5" />
                    Non-Vegetarian
                  </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  {renderRecipeGrid(getFilteredRecipes(selectedTab))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HomePage;
