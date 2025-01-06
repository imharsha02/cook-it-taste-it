import { SignUp } from "@clerk/nextjs";
import { TypographyH2 } from "@/components/ui/Typography/TypographyH2";
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <TypographyH2 className="border-none text-center">
            Sign up to <span className="text-red-500">ChefShare</span>
          </TypographyH2>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUp
            forceRedirectUrl="/Home"
            appearance={{
              elements: {
                card: "bg-white shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
