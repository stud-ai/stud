import {
  Activity,
  ArrowRightLeft,
  Check,
  CornerDownRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const codeTableHtml = `
  <table type="modify" class="m-0 w-full border-separate border-spacing-0 overflow-x-auto border-0 font-mono outline-none [--code-added:#38af4b] [--code-removed:#e65532] text-xs">
    <tbody class="box-border w-full">
      <tr class="h-1"></tr>
      <tr class="bg-muted text-muted-foreground h-6 font-mono">
        <td></td>
        <td class="opacity-50 select-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical mx-auto size-3" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </td>
        <td><span class="sticky left-2 px-0 italic opacity-50">1 lines</span></td>
      </tr>
      <tr class="h-1"></tr>
      <tr data-line-new="2" data-line-old="2" data-line-kind="normal" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap">
        <td class="w-1 border-l-[3px] border-transparent"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">2</td>
        <td class="pr-6 whitespace-nowrap"><span><span class=""><span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">charge</span><span class="token punctuation">(</span>total<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> rate<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span></span></td>
      </tr>
      <tr data-line-new="3" data-line-old="3" data-line-kind="normal" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap">
        <td class="w-1 border-l-[3px] border-transparent"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">3</td>
        <td class="pr-6 whitespace-nowrap"><span><span class="">  <span class="token keyword">const</span> amount <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>total <span class="token operator">*</span> rate </span><span class="bg-[var(--code-added)]/20"><span class="token operator">*</span> <span class="token number">100</span></span><span class=""><span class="token punctuation">)</span> </span><span class="bg-[var(--code-added)]/20"><span class="token operator">/</span> <span class="token number">100</span></span></span></td>
      </tr>
      <tr data-line-new="4" data-line-kind="insert" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap bg-[var(--code-added)]/10">
        <td class="w-1 border-l-[3px] border-[color:var(--code-added)]/60"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">4</td>
        <td class="pr-6 whitespace-nowrap"><ins><span class="">  <span class="token keyword">const</span> idKey <span class="token operator">=</span> request<span class="token punctuation">.</span>headers<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'Idempotency-Key'</span><span class="token punctuation">)</span>   <span class="token comment">// Ensure idempotency for retry semantics</span></span></ins></td>
      </tr>
      <tr data-line-new="5" data-line-kind="insert" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap bg-[var(--code-added)]/10">
        <td class="w-1 border-l-[3px] border-[color:var(--code-added)]/60"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">5</td>
        <td class="pr-6 whitespace-nowrap"><ins><span class="">  <span class="token keyword">if</span> <span class="token punctuation">(</span>idKey<span class="token punctuation">)</span> <span class="token keyword">await</span> idempotencyCache<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>idKey<span class="token punctuation">,</span> amount<span class="token punctuation">)</span></span></ins></td>
      </tr>
      <tr data-line-new="6" data-line-old="4" data-line-kind="normal" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap">
        <td class="w-1 border-l-[3px] border-transparent"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">6</td>
        <td class="pr-6 whitespace-nowrap"><span><span class=""></span></span></td>
      </tr>
      <tr data-line-new="7" data-line-old="5" data-line-kind="normal" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap">
        <td class="w-1 border-l-[3px] border-transparent"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">7</td>
        <td class="pr-6 whitespace-nowrap"><span><span class="">  <span class="token keyword">await</span> payments<span class="token punctuation">.</span><span class="token function">charge</span><span class="token punctuation">(</span><span class="token punctuation">{</span> amount <span class="token punctuation">}</span><span class="token punctuation">)</span></span></span></td>
      </tr>
      <tr data-line-new="8" data-line-old="6" data-line-kind="normal" class="box-border h-5 min-h-5 border-none whitespace-pre-wrap">
        <td class="w-1 border-l-[3px] border-transparent"></td>
        <td class="px-2 text-center text-xs tabular-nums opacity-50 select-none">8</td>
        <td class="pr-6 whitespace-nowrap"><span><span class=""><span class="token punctuation">}</span></span></span></td>
      </tr>
    </tbody>
  </table>
`;

export default function SupportSection() {
  return (
    <div id="first-product-section">
      <section className="mx-auto w-full max-w-7xl py-16">
        <div className="mb-8">
          <h2 className="font-base text-2xl tracking-tight md:text-3xl">
            An always-on AI support engineer
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            An AI support engineer that can triage, RCA, and fix customer
            problems autonomously.
          </p>
        </div>
        <div className="grid grid-cols-12 items-stretch gap-12 md:gap-14 lg:gap-16">
          <div className="col-span-12 lg:col-span-6">
            <div className="overflow-hidden rounded-sm border shadow-sm">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 opacity-75 dark:opacity-60">
                  <img
                    alt="Cliffs"
                    className="object-cover"
                    src="/assets/cliff.png"
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
                  <div className="w-[92%] md:w-[86%] lg:w-[78%]">
                    <div
                      className="bg-secondary rounded-md border p-2 shadow-sm md:p-3"
                      style={{opacity: 1, transform: "translateY(0px)"}}
                    >
                      <div className="bg-secondary/50 text-foreground rounded-sm p-1.5 text-[13px] leading-tight">
                        <div className="flex items-start gap-1.5">
                          <img
                            alt="User"
                            className="mt-0.5 h-4 w-4 flex-none rounded-full object-cover"
                            src="/assets/avatar.jpg"
                          />
                          <div className="font-medium">
                            Contract renewal failed with FX rounding error on
                            checkout.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="bg-secondary mt-3 rounded-md border p-3 shadow-sm"
                      style={{opacity: 1, transform: "translateY(0px)"}}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-foreground flex h-5 w-5 items-center justify-center rounded-full">
                          <Check className="h-3 w-3 text-[#c3efc9]" strokeWidth={3} />
                        </div>
                        <span className="text-foreground text-xs font-medium">
                          Triage ›
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Triaged as technical issue
                        </span>
                      </div>
                      <div
                        className="mt-3 flex items-center justify-between"
                        style={{opacity: 1, transform: "translateY(0px)"}}
                      >
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="text-muted-foreground/60 ml-2.5 h-3.5 w-3.5" />
                          <span className="text-foreground text-xs font-medium">
                            Approval required
                          </span>
                          <span className="text-foreground inline-flex items-center gap-1 text-xs font-medium">
                            <Check className="h-3.5 w-3.5 text-[#237230]" strokeWidth={3} />
                            Approved
                          </span>
                        </div>
                        <span className="text-muted-foreground text-[10px]">
                          maria@pear.com
                        </span>
                      </div>
                    </div>

                    <div
                      className="bg-secondary mt-3 rounded-md border p-3 shadow-sm"
                      style={{opacity: 1, transform: "translateY(0px)"}}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-foreground flex h-5 w-5 items-center justify-center rounded-full">
                          <Check className="h-3 w-3 text-[#c3efc9]" strokeWidth={3} />
                        </div>
                        <span className="text-foreground text-xs font-medium">
                          Fixing ›
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Patch prepared
                        </span>
                      </div>
                      <div className="bg-secondary/50 mt-2 ml-8 overflow-hidden rounded-sm border">
                        <div
                          className="h-40 overflow-auto"
                          dangerouslySetInnerHTML={{__html: codeTableHtml}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col lg:col-span-6">
            <ul className="space-y-6">
              <li className="flex items-start gap-3 py-3">
                <Activity className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">
                    Scale customers without scaling headcount
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Autonomously triages with full context, deflects L1/L2, and
                    handles L3 in minutes—24/7.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 py-3">
                <ShieldCheck className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">
                    Operate with governance
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Approvals, diffs, and an audit trail keep fixes safe and
                    compliant.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 py-3">
                <Sparkles className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Evolving agents</div>
                  <div className="text-muted-foreground text-sm">
                    Constantly learns your flow and the institutional knowledge
                    embedded in your process and software.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 py-3">
                <ArrowRightLeft className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">
                    Perfect handoffs for faster resolution
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Delivers full context with proposed fixes and RCA so
                    developers don't have to context switch and can ship fixes
                    faster.
                  </div>
                </div>
              </li>
            </ul>
            <a
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 mt-auto w-fit"
              href="/platform/agentic-debugging"
            >
              Our product
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
