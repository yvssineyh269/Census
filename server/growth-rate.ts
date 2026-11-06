
export const trendLabel = (rate: number, reference = "semaine dernière") =>
    `${rate >= 0 ? "+" : ""}${rate}% vs ${reference}`;

// Évolution en % par rapport à la période précédente (arrondie à 0,1)
export function getGrowthRate(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}
