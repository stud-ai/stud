export default function SiteFooter() {
  return (
    <footer className="bg-background border-border mt-auto w-full overflow-hidden border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:py-20">
        <a aria-label="STUD" className="group inline-block" href="/">
          <span className="font-tech relative block text-[clamp(3.2rem,16vw,10rem)] leading-none tracking-[0.2em]">
            <span className="text-foreground/18">STUD</span>
            <span
              aria-hidden
              className="text-foreground absolute inset-0 w-0 overflow-hidden whitespace-nowrap transition-[width] duration-500 ease-out group-hover:w-full"
            >
              STUD
            </span>
          </span>
        </a>
      </div>
    </footer>
  );
}
