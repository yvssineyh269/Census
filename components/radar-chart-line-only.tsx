"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { getGrowthRate } from "@/server/growth-rate"
import type { MonthlyMarginDto } from "@/lib/types"

const MONTHS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]

const chartConfig = {
  gross: {
    label: "Marge brute",
    color: "var(--chart-1)",
  },
  net: {
    label: "Marge nette",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRadarLinesOnly({ monthly, currentMonth }: { monthly: MonthlyMarginDto; currentMonth: number }) {
  const chartData = monthly.months.map((m) => ({ month: MONTHS[m.month], gross: m.gross, net: m.net }))

  // Évolution de la marge nette du mois en cours par rapport au mois précédent (même année)
  const current = monthly.months[currentMonth]?.net ?? 0
  const previous = currentMonth > 0 ? monthly.months[currentMonth - 1].net : null
  const rate = previous === null ? null : getGrowthRate(current, previous)

  return (
    // Grand écran : remplit la place laissée par le calendrier, le graphique se réduit en conséquence
    <Card className="gap-2 py-4 @4xl/main:min-h-48 @4xl/main:flex-1">
      <CardHeader className="items-center">
        <CardTitle>Marges brute et nette par mois</CardTitle>
        <CardDescription>Ventes validées de l&apos;année {monthly.year}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 @4xl/main:min-h-0 @4xl/main:flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] @4xl/main:aspect-auto @4xl/main:h-full @4xl/main:max-h-none"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <>
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                      </span>
                      <span className="ml-auto font-mono font-medium tabular-nums">
                        {Number(value).toLocaleString("fr-FR")} KMF
                      </span>
                    </>
                  )}
                />
              }
            />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid radialLines={false} />
            <Radar
              dataKey="gross"
              fill="var(--color-gross)"
              fillOpacity={0}
              stroke="var(--color-gross)"
              strokeWidth={2}
            />
            <Radar
              dataKey="net"
              fill="var(--color-net)"
              fillOpacity={0}
              stroke="var(--color-net)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm @4xl/main:gap-1 @4xl/main:text-xs">
        {rate !== null && (
          <div className="flex items-center gap-2 leading-none font-medium">
            Marge nette {rate >= 0 ? "+" : ""}{rate}% vs mois dernier
            {rate >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
          </div>
        )}
        <div className="flex items-center gap-2 leading-none text-muted-foreground @4xl/main:hidden">
          Janvier – Décembre {monthly.year}
        </div>
      </CardFooter>
    </Card>
  )
}
