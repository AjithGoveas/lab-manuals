import { useEffect, useRef } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface VivaQuestion {
  question: string
  answer: string
}

interface VivaAccordionProps {
  questions: VivaQuestion[]
}

export default function VivaAccordion({ questions }: VivaAccordionProps) {
  const containerRef = useRef<HTMLElement>(null)

  const renderMath = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const win = window as any
      if (typeof win.renderMathInElement === "function") {
        win.renderMathInElement(containerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
          throwOnError: false,
        })
      } else if (typeof win.renderMath === "function") {
        win.renderMath()
      }
    }
  }

  useEffect(() => {
    renderMath()
    const timer = setTimeout(renderMath, 150)
    return () => clearTimeout(timer)
  }, [questions])

  return (
    <section ref={containerRef} className="mt-12 border-t border-border pt-8">
      <div className="mb-6 border border-border bg-card rounded-2xl p-5 shadow-sm">
        <p className="font-mono text-[0.62rem] text-muted-foreground uppercase font-bold">
          [SECTION: ORAL EXAMINATION LOG]
        </p>
        <h2 className="font-heading mt-1 text-lg font-bold tracking-tight text-foreground">
          Viva Voce Study Guide
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed font-serif">
          The following index represents standard conceptual questions asked during the practical assessment. Review the expected model answers below.
        </p>
      </div>

      <Accordion
        defaultValue={["0"]}
        className="border-t border-border"
        onValueChange={() => {
          setTimeout(renderMath, 60)
        }}
      >
        {questions.map((q, index) => (
          <AccordionItem key={index} value={String(index)} className="border-b border-border">
            <AccordionTrigger className="gap-4 py-4 text-left hover:no-underline hover:text-primary font-medium text-sm transition-colors">
              <span className="font-mono text-xs text-primary border border-primary/35 bg-primary/5 rounded-xl px-2 py-0.5 select-none shrink-0">
                Q{String(index + 1).padStart(2, "0")}
              </span>
              <span className="leading-tight text-foreground">{q.question}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <div className="border border-border/80 bg-background/50 rounded-xl p-4 font-sans text-xs text-foreground leading-relaxed">
                <span className="text-primary font-mono font-bold block mb-1.5">// EXPECTED RESPONSE:</span>
                <span className="leading-relaxed">{q.answer}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

