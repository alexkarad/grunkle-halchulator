import { NATURE_RUNE_ID } from "../api/osrsPrices";
import type { ItemMapping, LatestPricesById, ProfitRow } from "../types";

export function buildProfitRows(
  mapping: ItemMapping[],
  prices: LatestPricesById,
  f2pOnly: boolean,
): ProfitRow[] {
  const natureRunePrice = prices[NATURE_RUNE_ID]?.high;
  if (!natureRunePrice) return [];

  const rows: ProfitRow[] = [];

  for (const item of mapping) {
    if (f2pOnly && item.members) continue;
    if (!item.highalch) continue;

    const buyPrice = prices[item.id]?.high;
    if (!buyPrice) continue;

    const profitPerItem = item.highalch - buyPrice - natureRunePrice;
    if (profitPerItem <= 0) continue;

    rows.push({
      id: item.id,
      name: item.name,
      members: item.members,
      icon: item.icon,
      buyPrice,
      highAlch: item.highalch,
      buyLimit: item.limit ?? null,
      profitPerItem,
      totalPotentialProfit: item.limit ? profitPerItem * item.limit : null,
    });
  }

  rows.sort((a, b) => b.profitPerItem - a.profitPerItem);
  return rows;
}
