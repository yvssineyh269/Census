"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { Loader } from "lucide-react";
import { fr } from "react-day-picker/locale";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { fetchDailyMargin } from "@/server/margin-chart-action";
import { getGrowthRate, trendLabel } from "@/server/growth-rate";
import { tryCatch } from "@/lib/try-catch";
import type { DailyMarginDto } from "@/lib/types";
import MetricCard from "./metric/metric-card";

// Date du calendrier (fuseau du navigateur) → "YYYY-MM-DD"
const toDayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const fromDayKey = (day: string) => {
    const [year, month, date] = day.split("-").map(Number);
    return new Date(year, month - 1, date);
};

// Part de la marge nette dans le chiffre d'affaires, en % (arrondi à 0,1)
const netMarginRate = (net: number, revenue: number) =>
    revenue === 0 ? 0 : Math.round((net / revenue) * 1000) / 10;

const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? "s" : ""}`;

// `children` s'affiche sous le calendrier, dans la colonne de droite
export default function AnalyticsCards({ initialDaily, children }: { initialDaily: DailyMarginDto; children?: ReactNode }) {
    const [daily, setDaily] = useState(initialDaily);
    const [isPending, startTransition] = useTransition();

    // Après un router.refresh() (ex. ajustement du dernier prix d'une vente), le serveur renvoie de
    // nouveaux totaux pour aujourd'hui : on les reprend si c'est le jour affiché…
    const [prevInitial, setPrevInitial] = useState(initialDaily);
    if (prevInitial !== initialDaily) {
        setPrevInitial(initialDaily);
        if (initialDaily.day === daily.day) setDaily(initialDaily);
    }

    // … sinon on recharge le jour sélectionné dans le calendrier
    const selectedDayRef = useRef(daily.day);
    selectedDayRef.current = daily.day;
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const day = selectedDayRef.current;
        if (day === initialDaily.day) return;
        startTransition(async () => {
            const { data, error } = await tryCatch(fetchDailyMargin(day));
            if (!error && data.status === "success" && data.daily.day === selectedDayRef.current) {
                setDaily(data.daily);
            }
        });
    }, [initialDaily]);

    const selected = fromDayKey(daily.day);
    const isToday = daily.day === toDayKey(new Date());
    const dayLabel = isToday
        ? "du jour"
        : `du ${selected.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;

    const handleSelect = (date: Date) => {
        const day = toDayKey(date);
        if (day === daily.day) return;
        startTransition(async () => {
            const { data, error } = await tryCatch(fetchDailyMargin(day));
            if (error || data.status !== "success") {
                toast.error(error ? "Impossible de charger les données du jour" : data.message);
                return;
            }
            setDaily(data.daily);
        });
    };

    const { current, previous } = daily;
    const metrics = [
        { title: `Chiffre d'affaires ${dayLabel}`, value: current.revenue, previous: previous.revenue, unit: "KMF", description: `${plural(current.salesCount, "vente")} validée${current.salesCount > 1 ? "s" : ""}` },
        { title: `Marge brute ${dayLabel}`, value: current.gross, previous: previous.gross, unit: "KMF", description: "Prix de vente − prix d'achat" },
        { title: `Marge nette ${dayLabel}`, value: current.net, previous: previous.net, unit: "KMF", description: "Marge brute − commissions (télévendeurs + assistant(e))" },
        { title: `Commissions ${dayLabel}`, value: current.commission, previous: previous.commission, unit: "KMF", description: "Dues aux télévendeurs et à l'assistant(e)" },
        { title: `Ventes ${dayLabel}`, value: current.salesCount, previous: previous.salesCount, description: "Ventes validées" },
        { title: `Taux de marge nette ${dayLabel}`, value: netMarginRate(current.net, current.revenue), previous: netMarginRate(previous.net, previous.revenue), unit: "%", description: "Part du chiffre d'affaires conservée après commissions" },
    ];

    return (
        // Grand écran : la grille des 6 cartes fixe la hauteur, la colonne de droite s'y aligne
        <div className="flex flex-col gap-4 md:gap-6 @4xl/main:flex-row @4xl/main:items-stretch">
            <div className="relative grid min-w-0 flex-1 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
                {metrics.map((metric) => {
                    const growthRate = getGrowthRate(metric.value, metric.previous);
                    return (
                        <MetricCard
                            key={metric.title}
                            title={metric.title}
                            value={metric.value}
                            unit={metric.unit}
                            trend={growthRate}
                            trendLabel={trendLabel(growthRate, "la veille")}
                            description={metric.description}
                        />
                    );
                })}
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/50">
                        <Loader className="size-6 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            <div className="relative w-full shrink-0 @4xl/main:w-80">
              {/* En absolu sur grand écran : son contenu ne peut plus agrandir la ligne, il remplit la hauteur des cartes */}
              <div className="flex flex-col gap-4 @4xl/main:absolute @4xl/main:inset-0">
                <Calendar
                    mode="single"
                    required
                    locale={fr}
                    selected={selected}
                    defaultMonth={selected}
                    onSelect={handleSelect}
                    disabled={isPending ? true : { after: new Date() }}
                    // Jours en rectangles bas (au lieu de carrés étirés) : calendrier plus compact, plus de place pour le radar
                    // Jour sélectionné aux couleurs de la marque (dégradé)
                    className="w-full! shrink-0 rounded-lg border shadow-xs [--cell-size:--spacing(6)] [&_td]:aspect-auto [&_button[data-day]]:aspect-auto [&_button[data-day]]:h-(--cell-size) [&_.rdp-week]:mt-1 [&_.rdp-months]:gap-2 [&_button[data-selected-single=true]]:bg-primary-gradient [&_button[data-selected-single=true]]:text-white"
                />
                {children}
              </div>
            </div>
        </div>
    );
}
