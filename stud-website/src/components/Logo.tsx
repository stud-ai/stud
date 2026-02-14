type LogoProps = {
  className?: string;
};

export default function Logo({className}: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Stud"
      role="img"
    >
      <text
        x="0"
        y="22"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        Stud
      </text>
    </svg>
  );
}
