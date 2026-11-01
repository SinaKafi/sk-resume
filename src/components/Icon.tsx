/** Shared inline SVG icon set — no icon-font or runtime dependency. */

export type IconName =
  | "github"
  | "linkedin"
  | "globe"
  | "mail"
  | "phone"
  | "pin"
  | "arrow-up-right"
  | "arrow-down"
  | "menu"
  | "close"
  | "check"
  | "briefcase"
  | "layers";

const paths: Record<IconName, React.ReactNode> = {
  github: (
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  ),
  linkedin: (
    <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.48h3.4V21H3.3V8.48Zm5.7 0h3.26v1.71h.05c.45-.86 1.56-1.77 3.21-1.77 3.44 0 4.08 2.26 4.08 5.2V21h-3.4v-6.44c0-1.54-.03-3.52-2.14-3.52-2.15 0-2.48 1.68-2.48 3.41V21H9V8.48Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9h17.6M3.2 15h17.6" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7.5 7.1 5a1.6 1.6 0 0 0 1.8 0l7.1-5" />
    </>
  ),
  phone: (
    <path d="M6.6 3h2.2l1.6 4-2 1.4a12 12 0 0 0 5.2 5.2l1.4-2 4 1.6v2.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 13 4.5 4.5L19 7" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m4 12.5 8 4.2 8-4.2M4 16.6l8 4.2 8-4.2" />
    </>
  ),
};

const filled: IconName[] = ["github", "linkedin", "phone"];

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const isFilled = filled.includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={isFilled ? undefined : 1.7}
      strokeLinecap={isFilled ? undefined : "round"}
      strokeLinejoin={isFilled ? undefined : "round"}
    >
      {paths[name]}
    </svg>
  );
}
