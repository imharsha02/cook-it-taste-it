import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Leaf, Trash2 } from "lucide-react";
import { TypographyP } from "@/components/ui/Typography/TypographyP";
import Link from "next/link";

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

interface RecipeCardProps {
  recipe: Recipe;
  isSignedIn: boolean;
  userId: string | null;
  onDeleteClick: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSignedIn,
  userId,
  onDeleteClick,
}) => {
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <Card className="group relative hover:cursor-pointer overflow-hidden rounded-xl border bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300 hover:shadow-xl h-[380px]">
        {/* Decorative accent gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-bl-full" />

        {/* Delete Button */}
        {isSignedIn && userId === recipe.user_id && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full shadow-lg hover:scale-105 transition-transform"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDeleteClick(recipe.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-lg">
            {/* Recipe Title */}
            {recipe.recipe_name}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative h-full flex flex-col">
          {/* Food Type Badge */}
          <div className="mb-6">
            {recipe.food_type === "vegetarian" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-600 shadow-sm">
                <Leaf className="h-4 w-4" />
                <span>Vegetarian</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600 shadow-sm">
                <Utensils className="h-4 w-4" />
                <span>Non-Vegetarian</span>
              </div>
            )}
          </div>
          {/* Ingredients Section */}
          <div className="space-y-4 flex-grow">
            <div>
              <TypographyP className="font-bold text-lg tracking-wide text-muted-foreground mb-3">
                Ingredients
              </TypographyP>
              <ul className="grid gap-2">
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground font-medium">
                      {ingredient.quantity}
                    </span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
                {recipe.ingredients.length > 3 && (
                  <li className="text-sm text-muted-foreground">
                    +{recipe.ingredients.length - 3} more ingredients
                  </li>
                )}
              </ul>
            </div>

            {/* Procedure Preview */}
            <div>
              <TypographyP className="font-bold text-lg tracking-wide text-muted-foreground mb-3">
                Procedure
              </TypographyP>
              <ol className="grid gap-2 text-sm">
                {recipe.procedure.slice(0, 2).map((stepObj, index) => (
                  <li key={index} className="flex gap-2 text-muted-foreground">
                    <span className="font-medium text-primary">
                      {index + 1}.
                    </span>
                    <span className="line-clamp-2">{stepObj.step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecipeCard;
