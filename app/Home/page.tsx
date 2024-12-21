"use client";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Leaf, Trash2 } from "lucide-react";
import { TypographyH3 } from "@/components/ui/Typography/TypographyH3";
import { supabase } from "../lib/supabase";
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
  id: number;
  food_type: string;
  image: string;
  ingredients: Ingredient[];
  procedure: string;
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
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null);

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
      // First, check if the recipe belongs to the current user
      const { data: recipeData, error: fetchError } = await supabase
        .from("recipes")
        .select("user_id")
        .eq("id", recipeToDelete)
        .single();

      if (fetchError) throw fetchError;

      // Verify ownership
      if (recipeData.user_id !== user.id) {
        throw new Error("Unauthorized: You can only delete your own recipes");
      }

      // Delete the recipe
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

  const renderRecipeCard = (recipe: Recipe) => (
    <Card key={recipe.id} className="overflow-hidden group relative">
      {isSignedIn && user?.id === recipe.user_id && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setRecipeToDelete(recipe.id);
              setDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {recipe.food_type === "vegetarian" ? (
            <Leaf className="h-4 w-4 text-green-600" />
          ) : (
            <Utensils className="h-4 w-4 text-red-600" />
          )}
          <TypographyH3 className="text-base">
            {recipe.recipe_name}
          </TypographyH3>
        </div>
        <div className="text-sm text-muted-foreground">
          <TypographyH3 className="mb-2">Ingredients:</TypographyH3>
          <ul className="list-disc pl-5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} <strong>{ingredient.name}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <TypographyH3 className="mb-2">Procedure:</TypographyH3>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            {Array.isArray(recipe.procedure) &&
              recipe.procedure.map(
                (stepObj: { step: string }, index: number) => (
                  <li key={index}>{stepObj.step}</li>
                )
              )}
          </ol>
        </div>
      </CardContent>
    </Card>
  );

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
        {filteredRecipes.map(renderRecipeCard)}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        body {
          overflow-y: scroll;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex-1 flex justify-center items-center relative w-full">
              <Header />
              <SignedIn>
                <div className="absolute right-0 flex items-center gap-4">
                  <UserButton />
                  <Button className="hover:bg-primary/90" size="lg" asChild>
                    <Link href="/add-recipe">Add Recipe</Link>
                  </Button>
                  <Button className="hover:bg-primary/90" size="lg" asChild>
                    <Link href="/my-recipes">My Recipes</Link>
                  </Button>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="absolute right-0 space-x-4">
                  <Button>
                    <Link href="/sign-up">Sign up</Link>
                  </Button>

                  <Button>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <Tabs
                value={selectedTab || undefined}
                onValueChange={handleTabChange}
                className="w-full mx-auto"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="vegetarian"
                    className="text-lg py-3 rounded-md transition-all data-[state=active]:bg-green-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
                  >
                    <Leaf className="mr-2 h-5 w-5" />
                    Vegetarian
                  </TabsTrigger>
                  <TabsTrigger
                    value="nonVegetarian"
                    className="text-lg py-3 rounded-md transition-all data-[state=active]:bg-red-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
                  >
                    <Utensils className="mr-2 h-5 w-5" />
                    Non-Vegetarian
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4">
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





