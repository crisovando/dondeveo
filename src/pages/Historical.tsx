import { HistoryCard } from "@/features/HistoryCard";
import { HistoryHeader } from "@/features/HistoryHeader";
import { getHistory } from "@/signals/history";

export function Historical() {
  const history = getHistory();
  return (
    <div class="page history">
      <HistoryHeader />

      <div class="list-items">
        {history.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
