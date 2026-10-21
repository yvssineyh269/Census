import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    unit?: string;
    trend?: number;
    trendLabel?: string;
    description?: string
}

export default function MetricCard({ title, value, unit, trend, trendLabel, description }: Props) {

    // -- 
    const isUp = trend !== null && trend !== undefined && trend >= 0

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
                    {unit && <span className="text-primary text-xs ml-1">{unit}</span>}
                </CardTitle>
                <CardAction>
                    <Badge
                        variant="outline"
                        className={trend !== null && trend !== undefined
                            ? isUp
                                ? "border-green-500 bg-green-500/10 text-green-500"
                                : "border-destructive bg-destructive/10 text-destructive"
                            : undefined}
                    >
                        {trend !== null && trend !== undefined ? (
                            isUp ? (
                                <TrendingUpIcon className="size-4 text-green-500" />


                            ) : (
                                <TrendingDownIcon className="size-4 text-destructive" />
                            )

                        ) : null}
                        
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                {trendLabel && (
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {trendLabel}
                        {trend !== null && trend !== undefined ? (
                            isUp ? (
                                <TrendingUpIcon className="size-4 text-green-500" />

                            ) : (
                                <TrendingDownIcon className="size-4 text-destructive" />
                            )

                        ) : null}
                    </div>
                )}
                {description && (
                    <div className="text-muted-foreground">{description}</div>
                )}

            </CardFooter>
        </Card>
    )
}
