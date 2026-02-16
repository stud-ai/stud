import {ChevronDown} from "lucide-react";
import Link from "next/link";

import Logo from "../Logo";

export default function SiteHeader() {
  return (
    <header className="px-6">
      <nav className="mx-auto flex w-full max-w-7xl flex-row items-center gap-2 py-3">
        <div className="flex flex-row items-center gap-6">
          <Link href="/" className="flex items-center">
            <Logo className="text-foreground h-5 w-auto" />
          </Link>
          <nav
            aria-label="Main"
            data-orientation="horizontal"
            className="group/navigation-menu relative max-w-max items-center hidden flex-none justify-start md:flex"
          >
            <div className="relative">
              <ul className="group flex list-none items-center flex-none justify-start gap-6">
                <li className="relative">
                  <button
                    type="button"
                    aria-expanded="false"
                    className="cursor-pointer group inline-flex w-max items-center justify-center rounded-md focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground data-[active]:text-foreground h-auto bg-transparent px-0 py-0 text-sm font-normal hover:bg-transparent"
                  >
                    Platform
                    <ChevronDown className="relative top-[1px] ml-1 size-3 transition duration-300" />
                  </button>
                </li>
                <li className="relative">
                  <Link
                    className="text-muted-foreground hover:text-foreground flex cursor-pointer flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 font-medium"
                    href="/enterprise"
                  >
                    Enterprise
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    className="text-muted-foreground hover:text-foreground flex cursor-pointer flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 font-medium"
                    href="/resources"
                  >
                    Resources
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    className="text-muted-foreground hover:text-foreground flex cursor-pointer flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 font-medium"
                    href="/about-us"
                  >
                    Company
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="ml-auto flex flex-row items-center gap-4">
          <Link
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-6"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6"
            href="/request-demo"
          >
            Book a Demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
