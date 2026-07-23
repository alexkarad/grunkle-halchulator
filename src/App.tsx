import { useState } from "react";
import { fetchLatestPrices, fetchMapping } from "./api/osrsPrices";
import { buildProfitRows } from "./lib/calculateProfits";
import type { ProfitRow } from "./types";
import "./App.css";

const gpFormatter = new Intl.NumberFormat("en-US");

function formatGp(value: number): string {
  return `${gpFormatter.format(value)} gp`;
}

function App() {
  const [rows, setRows] = useState<ProfitRow[]>([]);
  const [f2pOnly, setF2pOnly] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function refresh(nextF2pOnly = f2pOnly) {
    setStatus("loading");
    try {
      const [mapping, prices] = await Promise.all([
        fetchMapping(),
        fetchLatestPrices(),
      ]);
      setRows(buildProfitRows(mapping, prices, nextF2pOnly));
      setLastUpdated(new Date());
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function handleF2pToggle(checked: boolean) {
    setF2pOnly(checked);
    if (status !== "idle" || rows.length > 0) {
      refresh(checked);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Grunkle Halchulator</h1>
        <p className="subtitle">
          Grand Exchange &rarr; High Alchemy profit calculator
        </p>
      </header>

      <div className="controls">
        <button
          type="button"
          onClick={() => refresh()}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Refreshing..." : "Refresh prices"}
        </button>

        <label className="f2p-toggle">
          <input
            type="checkbox"
            checked={f2pOnly}
            onChange={(e) => handleF2pToggle(e.target.checked)}
          />
          F2P only
        </label>

        {lastUpdated && (
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {status === "error" && (
        <p className="error">
          Failed to load prices. Check your connection and try again.
        </p>
      )}

      {status === "idle" && rows.length === 0 && lastUpdated && (
        <p className="empty">No profitable items found right now.</p>
      )}

      {rows.length > 0 && (
        <table className="profit-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Buy price</th>
              <th>High alch</th>
              <th>Profit/item</th>
              <th>Buy limit</th>
              <th>Total potential profit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{formatGp(row.buyPrice)}</td>
                <td>{formatGp(row.highAlch)}</td>
                <td className="profit">{formatGp(row.profitPerItem)}</td>
                <td>{row.buyLimit ?? "-"}</td>
                <td>
                  {row.totalPotentialProfit !== null
                    ? formatGp(row.totalPotentialProfit)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
