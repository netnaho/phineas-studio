"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HarmonyHubLogo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { signOutUser } from "@/services/authService";
import { useRouter } from "next/navigation";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <HarmonyHubLogo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tighter">
            Phineas Studio
          </h1>
        </div>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.displayName || "User Avatar"}
                  />
                  <AvatarFallback>
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Profile</DropdownMenuItem>
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
