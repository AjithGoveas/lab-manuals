import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MetricRow, ResultFigureData } from "@/lib/results"

interface ResultFiguresProps {
  figures: ResultFigureData[]
  metrics?: MetricRow[]
  figureFile: string
  subjectSlug?: string
}

export default function ResultFigures({
  figures,
  metrics,
  figureFile,
  subjectSlug,
}: ResultFiguresProps) {
  const isCloud = subjectSlug === "cloud-computing";
  return (
    <section className="my-12">
      <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          {figures.length > 0 ? "Results" : (isCloud ? "Verification Log" : "Observation Metrics")}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          outputs/{figureFile}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {figures.map((fig) => (
          <Card key={fig.label} className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-mono text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground">
                <span>{fig.label}</span>
                <span className="text-primary">render: figure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 pt-0">
              <div className="border-y border-border/60 bg-background/40">
                <img
                  src={fig.src.src}
                  alt={fig.alt ?? fig.caption}
                  width={fig.src.width}
                  height={fig.src.height}
                  class="mx-auto h-auto w-full"
                  loading="lazy"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 bg-transparent">
              <p class="font-serif text-xs leading-relaxed text-muted-foreground">
                {fig.caption}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {metrics && metrics.length > 0 && (
        <div className="mt-8">
          <Card className="gap-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground">
                {isCloud ? "verification log: system.check" : "observation log: metrics.out"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableCaption>
                  {isCloud
                    ? "System verification status and observations recorded during setup."
                    : "Per-epoch training metrics recorded during the run."}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isCloud ? "step" : "epoch"}</TableHead>
                    {!isCloud && <TableHead>train_loss</TableHead>}
                    {isCloud && metrics.some((m) => m.trainLoss > 0) && (
                      <TableHead>port / code</TableHead>
                    )}
                    {metrics.some((m) => m.testAccuracy !== undefined) && (
                      <TableHead>{isCloud ? "status (%)" : "test_acc (%)"}</TableHead>
                    )}
                    <TableHead>{isCloud ? "observation note" : "note"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((m) => (
                    <TableRow key={m.epoch}>
                      <TableCell className="font-mono">{m.epoch}</TableCell>
                      {!isCloud && <TableCell className="font-mono">{m.trainLoss.toFixed(4)}</TableCell>}
                      {isCloud && metrics.some((x) => x.trainLoss > 0) && (
                        <TableCell className="font-mono">
                          {m.trainLoss > 0 ? m.trainLoss.toFixed(0) : "—"}
                        </TableCell>
                      )}
                      {metrics.some((mm) => mm.testAccuracy !== undefined) && (
                        <TableCell className="font-mono">
                          {m.testAccuracy !== undefined ? `${m.testAccuracy.toFixed(2)}%` : "—"}
                        </TableCell>
                      )}
                      <TableCell className="font-mono text-muted-foreground">
                        {m.note ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
