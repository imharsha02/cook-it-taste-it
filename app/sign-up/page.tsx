"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { Mail, User, Lock } from "lucide-react";
import { hashPassword } from "@/utils/hashPassword";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  foodHabits: z.enum(["vegetarian", "nonVegetarian"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      foodHabits: undefined,
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setEmailError(null);
    setNameError(null);

    try {
      // Check for existing email
      const { data: emailExists } = await supabase
        .from("users")
        .select("email")
        .eq("email", values.email)
        .single();

      if (emailExists) {
        setEmailError("This email is already registered");
        setIsSubmitting(false);
        return;
      }

      // Check for existing username
      const { data: nameExists } = await supabase
        .from("users")
        .select("name")
        .eq("name", values.name)
        .single();

      if (nameExists) {
        setNameError("This username is already taken");
        setIsSubmitting(false);
        return;
      }

      // If no duplicates found, proceed with registration
      const hashedPassword = await hashPassword(values.password);

      const { error: insertError } = await supabase.from("users").insert([
        {
          email: values.email,
          name: values.name,
          foodHabits: values.foodHabits,
          password: hashedPassword,
        },
      ]);

      if (insertError) {
        console.error("Error submitting form data:", insertError);
        setIsSubmitting(false);
        return;
      }

      // Redirect to add recipe page
      router.push("/add-recipe");
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign up
            </CardTitle>
            <CardDescription className="text-center">
              Join <span className="font-semibold">Cook it Taste it</span> to
              add your own recipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Email"
                            {...field}
                            className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        We&apos;ll send you new recipe notifications
                      </FormDescription>
                      {emailError && (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {emailError}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Username"
                            {...field}
                            className={`pl-10 ${nameError ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is how we&apos;ll address you
                      </FormDescription>
                      {nameError && (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {nameError}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="foodHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Habits</FormLabel>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set a password for your account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;