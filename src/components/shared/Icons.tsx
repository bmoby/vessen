export type IconProps = {
  size?: number;
  className?: string;
};

export function IconLaurel({ size = 32, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="10" r="3.5" />
      <path d="M12 13.5v3.5M9.5 17.5l2.5-1 2.5 1" />
      <path d="M5 11c1.5-.2 2.8-1.1 3.6-2.4M4.5 13c1.9-.2 3.5-1.3 4.4-3M19 11c-1.5-.2-2.8-1.1-3.6-2.4M19.5 13c-1.9-.2-3.5-1.3-4.4-3" />
    </svg>
  );
}

export function IconPlate({ size = 32, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M18.5 5.5l1.5-1.5M20 8h2M3.5 5v6" />
    </svg>
  );
}

export function IconShield({ size = 32, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3l7 3v5c0 5-3.5 7.7-7 9-3.5-1.3-7-4-7-9V6l7-3z" />
      <path d="M9.5 12.5l2 2 3-3" />
    </svg>
  );
}

export function IconPhone({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 16.92v2a2 2 0 0 1-2.18 2c-6.6-1.3-12.1-6.8-13.4-13.4A2 2 0 0 1 8.42 4H10c.5 2 .9 3 .9 3.5 0 .3-.1.7-.4 1L9 10c2.2 4.1 4.9 6.8 9 9l1.5-1.5c.3-.3.7-.4 1-.4.5 0 1.5.4 3.5.9z" />
    </svg>
  );
}

export function IconWhatsApp({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20.5 12a8.5 8.5 0 1 1-15.54 4.52L3 21l4.64-1.93A8.5 8.5 0 1 1 20.5 12z" />
      <path d="M8.5 9.5c.4 1.8 2.1 3.5 3.9 3.9M9.5 8.5c.7-.7 1.4-.7 2.1 0M12.4 13.4c.7.7 1.4.7 2.1 0" />
    </svg>
  );
}

export function IconTelegram({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 3L3 11l6 2 2 6 11-16z" />
      <path d="M9 12l4 4" />
    </svg>
  );
}

export function IconInstagram({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r=".8" />
    </svg>
  );
}

export function IconArrowRight({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
