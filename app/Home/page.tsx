"use client";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Leaf } from "lucide-react";
import AlertDialog from "../components/AlertDialog";
import { TypographyP } from "@/components/ui/Typography/TypographyP";
import { TypographyH3 } from "@/components/ui/Typography/TypographyH3";
import { supabase } from "../lib/supabase";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSignUpButton, setShowSignUpButton] = useState(false);
  const [showSignInButton, setShowSignInButton] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  useEffect(() => {
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

    fetchRecipes();
  }, []);

  const handleOkClick = () => {
    setIsDialogOpen(false);
    setShowSignUpButton(true);
  };

  const handleAlreadyUserClick = () => {
    setIsDialogOpen(false);
    setShowSignInButton(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setShowSignUpButton(false);
      setShowSignInButton(false);
      setIsDialogOpen(false);
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const renderRecipeCard = (recipe: Recipe) => (
    <Card key={recipe.id} className="overflow-hidden">
      <img
        src={recipe.image}
        alt={recipe.recipe_name}
        className="w-full aspect-video object-cover"
      />
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
          <ul className="list-disc pl-5">
            {recipe.ingredients.map(
              (ingredient: { name: string; quantity: string }, index) => (
                <li key={index}>
                  {ingredient.quantity} <strong>{ingredient.name}</strong>
                </li>
              )
            )}
          </ul>
        </div>

        <TypographyP className="text-sm [&:not(:first-child)]:mt-2 text-muted-foreground">
          {recipe.procedure}
        </TypographyP>
      </CardContent>
    </Card>
  );

  const renderRecipes = (isVegetarian: boolean) => {
    const filteredRecipes = recipes.filter(
      (recipe) =>
        recipe.food_type === (isVegetarian ? "vegetarian" : "non-vegetarian")
    );

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
          No {isVegetarian ? "vegetarian" : "non-vegetarian"} recipes found.
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map(renderRecipeCard)}
      </div>
    );
  };

  const renderAllCards = () => {
    const hasNonVeg = recipes.some(
      (recipe) => recipe.food_type === "non-vegetarian"
    );

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {renderRecipes(true)} {/* Always display vegetarian cards */}
        {!hasNonVeg && renderRecipes(true)}{" "}
        {/* Fill space with veg cards if no non-veg */}
        {hasNonVeg && renderRecipes(false)}{" "}
        {/* Display non-veg cards only if they exist */}
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
        <SignedOut>
          <AlertDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={handleDialogOpenChange}
            onOkClick={handleOkClick}
            onAlreadyUserClick={handleAlreadyUserClick}
          />
        </SignedOut>

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
                  {showSignUpButton && (
                    <Button>
                      <Link href="/sign-up">Sign up</Link>
                    </Button>
                  )}
                  {showSignInButton && (
                    <Button>
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                  )}
                  {!showSignUpButton && !showSignInButton && (
                    <>
                      {/* Default buttons, which won't render in this case */}
                    </>
                  )}
                </div>
              </SignedOut>
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <Tabs
                value={selectedTab || ""}
                onValueChange={handleTabChange}
                className="w-full mx-auto"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="veg"
                    className="text-lg py-3 rounded-md transition-all data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
                  >
                    <Leaf className="mr-2 h-5 w-5" />
                    Vegetarian
                  </TabsTrigger>
                  <TabsTrigger
                    value="non-veg"
                    className="text-lg py-3 rounded-md transition-all data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
                  >
                    <Utensils className="mr-2 h-5 w-5" />
                    Non-Vegetarian
                  </TabsTrigger>
                </TabsList>

                {!selectedTab && <div className="mt-4">{renderAllCards()}</div>}

                <TabsContent value="veg" className="mt-4">
                  {renderRecipes(true)}
                </TabsContent>
                <TabsContent value="non-veg" className="mt-4">
                  {renderRecipes(false)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;
