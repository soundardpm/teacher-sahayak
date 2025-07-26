import * as React from "react";

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <circle cx="12" cy="8" r="3" />
    <path d="m14.5 12.5-2.5 2.5-2.5-2.5" />
    <path d="M9 16v2" />
    <path d="M15 16v2" />
  </svg>
);

// Alternative simpler logo for Sahayak AI
export const SahayakLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
    <path d="M12 2v20" />
    <path d="M8 6h8" />
    <path d="M8 18h8" />
  </svg>
);
