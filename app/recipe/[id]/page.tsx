import { supabase } from "@/app/lib/supabase";
import { Leaf, Utensils, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Ingredient {
  name: string;
  quantity: string;
}

interface ProcedureStep {
  step: string;
}

interface Recipe {
  id: string;
  recipe_name: string;
  food_type: "vegetarian" | "nonVegetarian";
  ingredients: Ingredient[];
  procedure: ProcedureStep[];
  user_id: string;
}

interface RecipePageParams {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageParams) {
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  const typedRecipe = recipe as Recipe;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background/80">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>

        <div className="space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">
            {typedRecipe.recipe_name}
          </h1>

          {/* Food Type Badge */}
          <div>
            {typedRecipe.food_type === "vegetarian" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-600">
                <Leaf className="h-4 w-4" />
                <span>Vegetarian</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600">
                <Utensils className="h-4 w-4" />
                <span>Non-Vegetarian</span>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {typedRecipe.ingredients.map(
                (ingredient: Ingredient, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium">{ingredient.quantity}</span>
                    <span>{ingredient.name}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Procedure */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Procedure</h2>
            <ol className="space-y-4">
              {typedRecipe.procedure.map(
                (step: ProcedureStep, index: number) => (
                  <li key={index} className="flex gap-4">
                    <span className="font-bold text-primary">{index + 1}.</span>
                    <p>{step.step}</p>
                  </li>
                )
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
