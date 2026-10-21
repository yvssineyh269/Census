"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChevronLeftIcon, ChevronRightIcon, Loader } from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { tryCatch } from "@/lib/try-catch"
import type { Period } from "@/lib/period-range"
import { COMOROS_TIME_ZONE } from "@/lib/week-range"
import type { MarginChartDto } from "@/lib/types"
import { fetchMarginChart } from "@/server/margin-chart-action"

const chartConfig = {
  margin: {
    label: "Marge",
  },
  gross: {
    label: "Marge brute",
    color: "var(--chart-2)",
  },
  net: {
    label: "Marge nette",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type MarginKey = "gross" | "net"

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "week", label: "Hebdomadaire" },
  { value: "month", label: "Mensuel" },
  { value: "quarter", label: "Trimestriel" },
]

const formatDay = (value: string, withYear = false) =>
  new Date(value).toLocaleDateString("fr-FR", {
    timeZone: COMOROS_TIME_ZONE,
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  })

// Titre de la période affichée (ex. "Semaine en cours", "Mois dernier", "septembre 2026")
function getPeriodTitle(chart: MarginChartDto) {
  const { period, offset, start } = chart
  if (period === "week") {
    if (offset === 0) return "Semaine en cours"
    if (offset === -1) return "Semaine dernière"
    return `Il y a ${-offset} semaines`
  }
  if (period === "month") {
    const label = new Date(start).toLocaleDateString("fr-FR", { timeZone: COMOROS_TIME_ZONE, month: "long", year: "numeric" })
    if (offset === 0) return `Mois en cours (${label})`
    if (offset === -1) return `Mois dernier (${label})`
    return label.charAt(0).toUpperCase() + label.slice(1)
  }
  // Le trimestre commence à minuit heure des Comores : +3h donne la date comorienne en UTC
  const date = new Date(new Date(start).getTime() + 3 * 60 * 60 * 1000)
  const label = `T${Math.floor(date.getUTCMonth() / 3) + 1} ${date.getUTCFullYear()}`
  if (offset === 0) return `Trimestre en cours (${label})`
  if (offset === -1) return `Trimestre dernier (${label})`
  return label
}

export function ChartBarInteractive({ initialChart }: { initialChart: MarginChartDto }) {
  const [chart, setChart] = React.useState(initialChart)
  const [activeChart, setActiveChart] = React.useState<MarginKey>("gross")
  const [isPending, startTransition] = React.useTransition()

  const total = React.useMemo(
    () => ({
      gross: chart.data.reduce((acc, curr) => acc + curr.gross, 0),
      net: chart.data.reduce((acc, curr) => acc + curr.net, 0),
    }),
    [chart]
  )

  // Charge une autre période (changement de type ou navigation précédente / suivante)
  const loadChart = (period: Period, offset: number) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(fetchMarginChart(period, offset))
      if (error || data.status !== "success") {
        toast.error(error ? "Impossible de charger les marges" : data.message)
        return
      }
      setChart(data.chart)
    })
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 pt-4 pb-3 sm:py-4!">
          <CardTitle>Marges des ventes validées</CardTitle>
          <CardDescription>
            {getPeriodTitle(chart)} · du {formatDay(chart.start)} au {formatDay(chart.end, true)} ·{" "}
            {chart.salesCount} vente{chart.salesCount > 1 ? "s" : ""}
          </CardDescription>

          {/* TYPE DE PERIODE + NAVIGATION */}
          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={chart.period === option.value ? "default" : "outline"}
                disabled={isPending}
                onClick={() => loadChart(option.value, 0)}
              >
                {option.label}
              </Button>
            ))}
            <div className="ml-auto flex items-center gap-1">
              {isPending && <Loader className="size-4 animate-spin text-muted-foreground" />}
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                disabled={isPending}
                onClick={() => loadChart(chart.period, chart.offset - 1)}
              >
                <ChevronLeftIcon />
                <span className="sr-only">Période précédente</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                disabled={isPending || chart.offset === 0}
                onClick={() => loadChart(chart.period, chart.offset + 1)}
              >
                <ChevronRightIcon />
                <span className="sr-only">Période suivante</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex">
          {(["gross", "net"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span
                className={`text-lg leading-none font-bold tabular-nums sm:text-3xl ${
                  total[key] < 0 ? "text-destructive" : ""
                }`}
              >
                {total[key].toLocaleString("fr-FR")}
                <span className="ml-1 text-xs font-normal text-orange-600">KMF</span>
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chart.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDay(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[170px]"
                  nameKey="margin"
                  labelFormatter={(value) => formatDay(value, true)}
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">{chartConfig[activeChart].label}</span>
                      <span className="font-mono font-medium tabular-nums">
                        {Number(value).toLocaleString("fr-FR")} KMF
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
