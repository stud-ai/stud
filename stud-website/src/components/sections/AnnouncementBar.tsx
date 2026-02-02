export default function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background border-border relative w-full border-b px-6 py-2">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-2 text-sm">
        <span>
          Introducing SIM-1: Code simulation models for code verification and
          technical debugging
        </span>
        <a
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
          href="https://playerzero.ai/research/sim-1"
        >
          Learn more &gt;
        </a>
      </div>
    </div>
  );
}
