import { TypographyP } from "@/components/ui/Typography/TypographyP"
import Header from "./components/Header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <Header />

        {/* Description */}
        <div className="text-center">
          <TypographyP className="text-muted-foreground">
            Description about the app
          </TypographyP>
          <TypographyP className="mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt vero
            modi ipsam in dicta eveniet magni repellendus laborum veritatis eaque
            saepe voluptate consequuntur, architecto adipisci sit ullam et.
            Repellendus, deleniti.
          </TypographyP>
        </div>

        {/* Begin button */}
        <Button asChild className="w-full sm:w-auto px-8" size="lg">
          <Link href="/Home">Begin Your Journey</Link>
        </Button>
      </div>
    </div>
  )
}

export default Page