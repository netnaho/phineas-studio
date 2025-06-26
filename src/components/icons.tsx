import { cn } from "@/lib/utils";
import * as React from "react";

export function HarmonyHubLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="hsl(var(--primary) / 0.1)" stroke="none" />
      <path d="M12 2v20" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <path d="M2 12h20" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <path d="M15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" />
      <path d="M15 8v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9" />
      <path d="M9 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" />
      <path d="M9 18V7a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v11" />
    </svg>
  );
}
