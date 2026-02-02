import {EyeOff, LockKeyhole, ServerCog, ShieldCheck} from "lucide-react";

export default function SecuritySection() {
  return (
    <div className="bg-tertiary rounded-sm">
      <section className="mx-auto w-full max-w-7xl py-16">
        <div className="mb-8">
          <h2 className="font-base text-2xl tracking-tight md:text-3xl">
            Safe and secure
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            Enterprise‑grade security with privacy and control by default.
          </p>
        </div>
        <div className="grid grid-cols-12 items-stretch gap-12 md:gap-14 lg:gap-16">
          <div className="col-span-12 lg:col-span-6">
            <div className="overflow-hidden rounded-sm border shadow-sm">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 opacity-75 dark:opacity-60">
                  <img
                    alt="City"
                    className="object-cover"
                    src="/assets/redwoods-dark.png"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                </div>
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 inline-flex items-center gap-3 rounded-md border p-3 shadow backdrop-blur">
                    <ShieldCheck className="text-muted-foreground h-4 w-4" />
                    <div className="text-foreground text-sm">
                      All systems nominal • SOC‑2 Type II
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col lg:col-span-6">
            <ul className="space-y-6">
              <li className="flex items-start gap-3 py-3">
                <ShieldCheck className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Supervision</div>
                  <div className="text-muted-foreground text-sm">
                    Set approval workflows to ensure the right people approve as
                    PlayerZero works.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 py-3">
                <LockKeyhole className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Compliance</div>
                  <div className="text-muted-foreground text-sm">
                    SOC‑2 Type II &amp; HIPAA audited.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 py-3">
                <EyeOff className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Private by design</div>
                  <div className="text-muted-foreground text-sm">
                    We never train models on your data — you own all output.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 py-3">
                <ServerCog className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Hybrid &amp; enterprise</div>
                  <div className="text-muted-foreground text-sm">
                    BYOK/BYOC options for data residency in your VPC and control
                    over inference providers/LLMs.
                  </div>
                </div>
              </li>
            </ul>
            <a
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 mt-auto w-fit"
              href="/enterprise"
            >
              Security overview
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
