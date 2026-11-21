import { Ban, CalendarClock, Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPENSE_STATUS_LABELS } from "@/lib/expense-status";
import type { ExpenseStatus } from "@/lib/generated/prisma/enums";

const STATUS_STYLES = {
  scheduled: {
    icon: CalendarClock,
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  in_progress: {
    icon: Loader,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  done: {
    icon: Check,
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  cancelled: {
    icon: Ban,
    className: "bg-destructive/10 text-destructive",
  },
} satisfies Record<ExpenseStatus, { icon: typeof Check; className: string }>;

export function ExpenseStatusBadge({
  status,
  className,
}: {
  status: ExpenseStatus;
  className?: string;
}) {
  const { icon: Icon, className: statusClassName } = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap",
        statusClassName,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {EXPENSE_STATUS_LABELS[status]}
    </span>
  );
}
