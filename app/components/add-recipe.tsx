"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea";
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
const formSchema = z.object({
  image: z.string(),
  recipe_name: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, "Ingredient name is required"),
      quantity: z.string().min(1, "Quantity is required"),
    })
  ),
  procedure: z.string(),
});
const AddRecipe = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      recipe_name: "",
      ingredients: [{ name: "", quantity: "" }],
      procedure: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="max-w-md mx-auto p-6">
      <Header />
      <Card className="my-10">
        <CardHeader>
          <CardTitle>Add new recipe</CardTitle>
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
                    <FormLabel>Dish name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter dish name" {...field} />
                    </FormControl>
                    <FormDescription>Name of the dish</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Ingredients Inputs */}
              <div className="space-y-4">
                <FormLabel>Ingredients</FormLabel>
                {fields.map((field, index) => (
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
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
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
                  onClick={() => append({ name: "", quantity: "" })}
                  className="w-full"
                >
                  <CiCirclePlus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>

              {/* Procedure Input */}
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Procedure</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter preparation steps"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the cooking process
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Add Recipe
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRecipe;
