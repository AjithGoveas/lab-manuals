import { useEffect, useRef, type ReactNode } from "react"

interface CodeBlockProps {
  children: ReactNode
  className?: string
}

const COPY_ICON = `
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
`
const CHECK_ICON = `
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
`

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
      if (pre.dataset.copyEnhanced === "true") return
      pre.dataset.copyEnhanced = "true"

      const lang = pre.getAttribute("data-language") ?? "code"

      const wrapper = document.createElement("div")
      wrapper.className =
        "group my-6 border border-border bg-[#0f1115] rounded-2xl overflow-hidden shadow-xs"

      const header = document.createElement("div")
      header.className =
        "flex items-center justify-between gap-3 border-b border-border/60 bg-black/20 px-3.5 py-2"

      const langLabel = document.createElement("span")
      langLabel.className = "font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground font-semibold"
      langLabel.textContent = lang

      const button = document.createElement("button")
      button.type = "button"
      button.className =
        "inline-flex items-center gap-1.5 border border-border/30 rounded-xl px-2 py-0.5 font-mono text-[0.62rem] text-muted-foreground transition-all hover:border-primary hover:text-primary bg-black/10 focus-visible:outline-none data-copied:text-emerald-400 data-copied:border-emerald-400/40"
      button.setAttribute("aria-label", `Copy ${lang} code to clipboard`)
      button.innerHTML = `<span class="inline-flex items-center gap-1.5">${COPY_ICON} copy</span>`

      let resetTimer: ReturnType<typeof setTimeout> | undefined

      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")
        const text = code?.innerText ?? pre.innerText ?? ""
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          return
        }
        button.dataset.copied = "true"
        button.innerHTML = `<span class="inline-flex items-center gap-1.5">${CHECK_ICON} copied</span>`
        if (resetTimer) clearTimeout(resetTimer)
        resetTimer = setTimeout(() => {
          button.dataset.copied = "false"
          button.innerHTML = `<span class="inline-flex items-center gap-1.5">${COPY_ICON} copy</span>`
        }, 2000)
      })

      header.append(langLabel, button)
      wrapper.append(header)

      pre.parentElement?.insertBefore(wrapper, pre)
      pre.classList.add("m-0", "rounded-none", "!px-5", "!py-4", "!bg-transparent", "overflow-x-auto")
      wrapper.append(pre)
    })
  }, [children])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
