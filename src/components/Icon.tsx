import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  shield: <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z M9 12l2 2 4-4" />,
  home: <path d="M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6" />,
  receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z M9 8h6 M9 12h6 M9 16h3" />,
  briefcase: <path d="M3 8h18v12H3z M8 8V5h8v3 M3 13h18" />,
  key: <path d="M14.5 9.5a4.5 4.5 0 11-1.3-3.2 4.5 4.5 0 011.3 3.2z M13.2 12.7L21 20.5 M17 16.5l2-2 M19.5 19l1.5-1.5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrowRight: <path d="M5 12h14 M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5 M11 6l-6 6 6 6" />,
  lock: <path d="M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 017 0v3" />,
  eye: <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 15a3 3 0 100-6 3 3 0 000 6z" />,
  download: <path d="M12 4v11 M7 10l5 5 5-5 M5 20h14" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4z M13.5 6.5l4 4" />,
  clock: <path d="M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2" />,
  x: <path d="M6 6l12 12 M18 6L6 18" />,
  file: <path d="M7 3h7l5 5v13H7z M14 3v5h5" />,
  sparkle: <path d="M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6" />,
  refresh: <path d="M4 12a8 8 0 0114-5.3L20 9 M20 4v5h-5 M20 12a8 8 0 01-14 5.3L4 15 M4 20v-5h5" />,
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
