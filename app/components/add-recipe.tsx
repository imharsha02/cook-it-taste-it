import React from "react";
import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

// Updated schema to handle ingredients as an array of objects
const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

const formSchema = z.object({
  recipe_name: z.string().min(1, "Recipe name is required"),
  image: z.string(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required"),
  process: z.string().min(1, "Preparation process is required"),
});

const AddRecipe = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipe_name: "",
      image: "",
      ingredients: [{ name: "", quantity: "" }],
      process: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dish image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Image"
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0]?.name || "")
                    }
                  />
                </FormControl>
                <FormDescription>Upload image of the dish</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipe_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name of the dish"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the name of the dish</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Ingredients</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 mb-2 items-center">
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
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", quantity: "" })}
              className="mt-2"
            >
              Add Ingredient
            </Button>
          </div>

          <FormField
            control={form.control}
            name="process"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preparation Process</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Preparation steps"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the preparation process
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddRecipe;
