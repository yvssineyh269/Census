
export const trendLabel = (rate: number) => `${rate >= 0 ? "+" : ""}${rate}% vs semaine dernière`;

// Évolution en % par rapport à la semaine dernière (arrondie à 0,1)
export function getGrowthRate(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}
