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
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5L7 16l-1 3 3-1 1.5-1.5" />
      <path d="M15 9c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
      <path d="M9 15c0-1.5 1-3 3-3s3 1.5 3 3" />
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
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-6 6" />
      <path d="M16 8l-4 12-2-6-6-2 12-4z" />
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

export function IconEmail({ size = 24, className }: IconProps) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
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
