import type { ItemMapping, LatestPricesById } from "../types";

const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";

export const NATURE_RUNE_ID = 561;

// Browsers block scripts from overriding the User-Agent header, so we can't
// send the identification string the API asks for; CORS is open regardless.
export async function fetchMapping(): Promise<ItemMapping[]> {
  const res = await fetch(`${BASE_URL}/mapping`);
  if (!res.ok) throw new Error(`Failed to fetch item mapping: ${res.status}`);
  return res.json();
}

export async function fetchLatestPrices(): Promise<LatestPricesById> {
  const res = await fetch(`${BASE_URL}/latest`);
  if (!res.ok) throw new Error(`Failed to fetch latest prices: ${res.status}`);
  const body = await res.json();
  return body.data;
}
