import { UserAction } from "@/lib/types";
import { ACTION_META, formatRelativeDate } from "@/lib/utils";

export function RecentActionItem({ action }: { action: UserAction }) {
  const meta = ACTION_META[action.action];
  return (
    <li className="flex items-center justify-between gap-3 border-b border-moss-100 py-3 last:border-0">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${meta.bg}`}
        >
          {meta.icon}
        </span>
        <div>
          <p className="text-sm font-medium text-ink/90">{action.itemName}</p>
          <p className="text-xs text-ink/50">
            {meta.label} · {action.category}
          </p>
        </div>
      </div>
      <span className="whitespace-nowrap text-xs text-ink/40">
        {formatRelativeDate(action.createdAt)}
      </span>
    </li>
  );
}
