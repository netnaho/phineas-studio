import { HarmonyHubLogo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <HarmonyHubLogo className="h-12 w-12 text-primary" />
        </div>
        {children}
      </div>
    </div>
  );
}
