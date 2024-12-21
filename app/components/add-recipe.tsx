"use client";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "./Header";

// Schema definition
const formSchema = z.object({
  recipe_name: z.string(),
  food_type: z.enum(["vegetarian", "nonVegetarian"]),
  image: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, "Ingredient name is required"),
      quantity: z.string().min(1, "Quantity is required"),
    })
  ),
  procedure: z.array(
    z.object({
      step: z.string().min(1, "Step description is required"),
    })
  ),
});

const AddRecipe = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      food_type: undefined,
      recipe_name: "",
      ingredients: [{ name: "", quantity: "" }],
      procedure: [{ step: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const {
    fields: procedureFields,
    append: appendProcedure,
    remove: removeProcedure,
  } = useFieldArray({
    control: form.control,
    name: "procedure",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase.from("recipes").insert([
        {
          user_id: user?.id,
          recipe_name: values.recipe_name,
          food_type: values.food_type,
          image: values.image,
          ingredients: values.ingredients,
          procedure: values.procedure,
        },
      ]);

      if (insertError) {
        console.error("Error submitting form data:", insertError);
        return;
      }

      console.log("Recipe added successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Header />
      <Card className="my-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Add new recipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Image Input */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dish image</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
                    </FormControl>
                    <FormDescription>Image of the dish</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recipe Name Input */}
              <FormField
                control={form.control}
                name="recipe_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dish name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter dish name" {...field} />
                    </FormControl>
                    <FormDescription>Name of the dish</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Food Type Radio Buttons */}
              <FormField
                control={form.control}
                name="food_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of food*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="vegetarian" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Vegetarian
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="nonVegetarian" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Non-vegetarian
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Select your dietary preference
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Ingredients Inputs */}
              <div className="space-y-4">
                <FormLabel>Ingredients*</FormLabel>
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Ingredient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Quantity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Remove Ingredient Button */}
                    {ingredientFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <FaRegTrashAlt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {/* Add Ingredient Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendIngredient({ name: "", quantity: "" })}
                  className="w-full"
                >
                  <FaPlus className="mr-2 w-4 h-4" /> Add Ingredient
                </Button>
              </div>

              {/* Dynamic Procedure Steps */}
              <div className="space-y-4">
                <FormLabel>Procedure*</FormLabel>
                {procedureFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name={`procedure.${index}.step`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input
                              placeholder="Step description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Remove Step Button */}
                    {procedureFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeProcedure(index)}
                      >
                        <FaRegTrashAlt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {/* Add Step Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendProcedure({ step: "" })}
                  className="w-full"
                >
                  <FaPlus className="mr-2 w-4 h-4" /> Add Step
                </Button>
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? "Adding recipe..." : "Add Recipe"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRecipe;
