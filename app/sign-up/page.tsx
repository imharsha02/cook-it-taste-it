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
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  food_habits: z.enum(["vegetarian", "nonVegetarian"], {
    required_error: "Please select your food habits",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must include letters, numbers, and special characters"
    ),
});

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      food_habits: undefined,
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Reset previous errors
    form.clearErrors();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Step 1: Sign Up Authentication
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              food_habits: values.food_habits,
            },
          },
        });

      // Check for signup errors
      if (signUpError) {
        alert("Sign Up Failed");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Verify user creation
      if (!signUpData.user) {
        alert("Sign Up Error");
        setIsSubmitting(false);
        return;
      }

      // Step 3: Insert additional user details
      const { error: profileError } = await supabase
        .from("about_users")
        .insert({
          user_id: signUpData.user.id,
          name: values.name,
          food_habits: values.food_habits,
          email: values.email,
        })
        .select();

      // Handle profile insertion errors
      if (profileError) {
        console.error("Profile Creation Error:", profileError);
        alert("Profile Setup Failed");

        // Optional: Delete the auth user if profile creation fails
        await supabase.auth.signOut();
        setIsSubmitting(false);
        return;
      }

      // Success: Redirect and show success toast
      alert("Welcome!");
      router.push("/add-recipe");
    } catch (error) {
      console.error("Comprehensive Signup Error:", error);
      alert("Signup Error");
    } finally {
      // Ensure submission state is reset
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
                {/* Email Field */}
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
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        We&apos;ll send you new recipe notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Field */}
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
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is how we&apos;ll address you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Food Habits Field */}
                <FormField
                  control={form.control}
                  name="food_habits"
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

                {/* Password Field */}
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
                        Minimum 8 characters, include letters, numbers, and
                        special characters
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
