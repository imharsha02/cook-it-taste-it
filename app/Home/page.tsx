"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/Typography/TypographyP";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Leaf } from "lucide-react";

const HomePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSignUpButton, setShowSignUpButton] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  const handleOkClick = () => {
    setIsDialogOpen(false);
    setShowSignUpButton(true);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const renderAllCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Vegetarian Cards */}
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={`veg-${item}`} className="overflow-hidden">
          <div className="aspect-video bg-muted" />
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <h3 className="text-lg font-semibold">Vegetarian Dish {item}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              A delicious plant-based recipe.
            </p>
          </CardContent>
        </Card>
      ))}
      {/* Non-Vegetarian Cards */}
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={`non-veg-${item}`} className="overflow-hidden">
          <div className="aspect-video bg-muted" />
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-red-600" />
              <h3 className="text-lg font-semibold">
                Non-Vegetarian Dish {item}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              A savory meat-based recipe.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <style jsx global>{`
        body {
          overflow-y: scroll;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Welcome to Cook it Taste it!
              </DialogTitle>
            </DialogHeader>
            <TypographyP className="text-muted-foreground">
              Sign up to add your own recipes and share them with the world.
              Join our community of food enthusiasts!
            </TypographyP>
            <DialogFooter>
              <Button onClick={handleOkClick} size="lg">
                Get Started
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex-1 flex justify-center relative w-full">
              <Header />
              {showSignUpButton && (
                <Button
                  className="absolute right-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  asChild
                >
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              )}
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
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Card key={item} className="overflow-hidden">
                        <div className="aspect-video bg-muted" />
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            <h3 className="text-lg font-semibold">
                              Vegetarian Dish {item}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            A delicious plant-based recipe.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="non-veg" className="mt-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Card key={item} className="overflow-hidden">
                        <div className="aspect-video bg-muted" />
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Utensils className="h-4 w-4 text-red-600" />
                            <h3 className="text-lg font-semibold">
                              Non-Vegetarian Dish {item}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            A savory meat-based recipe.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
