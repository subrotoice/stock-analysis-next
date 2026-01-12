"use client";

import { useEffect, useState } from "react";
import SectorFilterDropdown from "./SectorFilterDropdown";
import sectorMap from "../data/sectorMap";
import { StockData } from "../page";
import StockPopup from "./StockPopup";

type SortKey = "rsi" | "value" | "peRatio" | "lowFrom52wHigh";
type SortOrder = "asc" | "desc";

interface StockDataProps {
  stocks: StockData[];
}

const StockTable = ({ stocks }: StockDataProps) => {
  const [filtered, setFiltered] = useState<StockData[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("watchlist");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [searchCode, setSearchCode] = useState("");
  const [searchSector, setSearchSector] = useState("");
  const [lowFrom52wHighInput, setlowFrom52wHighInput] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

  const sectorList = Object.values(sectorMap);

  useEffect(() => {
    let updated = stocks
      .filter(
        (stock) =>
          stock.code.toLowerCase().includes(searchCode.toLowerCase()) &&
          stock.sector.toLowerCase().includes(searchSector.toLowerCase()) &&
          ((stock.yearly_high - stock.close) / stock.yearly_high) * 100 >
            (parseFloat(lowFrom52wHighInput) || 0) &&
          stock.category === "A" &&
          stock.close / stock.EPS > 0 &&
          30 > stock.close / stock.EPS &&
          stock.close &&
          stock.EPS
      )
      .map((stock) => ({
        ...stock,
        lowFrom52wHigh: (stock.yearly_high - stock.close) / stock.yearly_high,
      }));

    if (sortKey) {
      updated = [...updated].sort((a, b) => {
        let aVal: number, bVal: number;

        switch (sortKey) {
          case "rsi":
            aVal = a.rsi_14;
            bVal = b.rsi_14;
            break;
          case "lowFrom52wHigh":
            aVal = a.lowFrom52wHigh;
            bVal = b.lowFrom52wHigh;
            break;
          case "peRatio":
            aVal = a.close && a.EPS ? a.close / a.EPS : 0;
            bVal = b.close && b.EPS ? b.close / b.EPS : 0;
            break;
          default:
            return 0;
        }

        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    setFiltered(updated);
  }, [
    stocks,
    searchCode,
    searchSector,
    sortKey,
    sortOrder,
    lowFrom52wHighInput,
  ]);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (id: number) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center pb-4">
        Stock Data (A cat & PE:3-30, {filtered.length} Companies)
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Code"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <SectorFilterDropdown
          sectors={sectorList}
          selected={searchSector}
          onSelect={setSearchSector}
        />
        <input
          type="text"
          placeholder="% Low From 52w High"
          value={lowFrom52wHighInput == "" ? "" : lowFrom52wHighInput}
          onChange={(e) => {
            if (e.target.value.trim() !== "" && !isNaN(Number(e.target.value)))
              setlowFrom52wHighInput(e.target.value);
            else setlowFrom52wHighInput("");
          }}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
      </div>
      <div className="overflow-y-auto max-h-screen border rounded shadow">
        <table className="min-w-full border border-gray-200 shadow-lg rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">Code, Name, Sector</th>
              <th className="px-4 py-2 border">LTP</th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => toggleSort("lowFrom52wHigh")}
              >
                52W High-Low {sortArrow("lowFrom52wHigh")}
              </th>
              <th className="px-4 py-2 border">EPS</th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => toggleSort("peRatio")}
              >
                PE Ratio {sortArrow("peRatio")}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => toggleSort("rsi")}
              >
                RSI {sortArrow("rsi")}
              </th>
              <th className="px-4 py-2 border">NAV</th>
              <th className="px-4 py-2 border">Public+Fore+Inst+Gov+Dir</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  No matching stocks found.
                </td>
              </tr>
            ) : (
              filtered.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <span
                      onClick={() => setSelectedStock(stock)}
                      className="font-semibold cursor-pointer hover:text-[#16a085] transition-colors duration-300"
                    >
                      {stock.id} {stock.code} ({stock.name.slice(0, 40)})
                    </span>
                    {selectedStock && selectedStock.id === stock.id && (
                      <StockPopup
                        stock={selectedStock}
                        onClose={() => setSelectedStock(null)}
                      />
                    )}
                    <div className="relative group inline-block">
                      <span
                        className="cursor-pointer ml-1"
                        onClick={() => toggleWatchlist(stock.id)}
                      >
                        {watchlist.includes(stock.id) ? (
                          "⭐"
                        ) : (
                          <strong className="">☆</strong>
                        )}
                      </span>

                      <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg whitespace-nowrap">
                        Add/Remove Watch List
                      </div>
                    </div>
                    <br />
                    {stock.sector} <br />
                    <a
                      href="https://lankabd.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lankabd
                    </a>{" "}
                    -
                    <a
                      href={`https://ost.ecosoftbd.com/Analysis`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      EcoSoftbd
                    </a>
                    -
                    <a
                      href={`https://stocknow.com.bd/search?symbol=${stock.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Stocknow
                    </a>
                    -
                    <a
                      href={`https://www.amarstock.com/stock/${stock.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Amarstock
                    </a>{" "}
                    -
                    <a
                      href={`https://biniyog.com.bd/company/${stock.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Biniyog
                    </a>
                    -
                    <a
                      href={`https://www.dsebd.org/displayCompany.php?name=${stock.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dsebd
                    </a>
                  </td>
                  <td className="px-4 py-2 border">{stock.close}</td>
                  <td className="px-4 py-2 border">
                    {stock.yearly_low} - {stock.yearly_high} (
                    {(
                      ((stock.yearly_high - stock.yearly_low) /
                        stock.yearly_low) *
                      100
                    ).toFixed(1)}
                    %)
                    <p>
                      {(
                        ((stock.close - stock.yearly_low) / stock.yearly_low) *
                        100
                      ).toFixed(2)}
                      % - {(stock.lowFrom52wHigh * 100).toFixed(2)}%
                    </p>
                  </td>
                  <td className="px-4 py-2 border">
                    {`Q1: ${stock.Q1}, Q2: ${stock.Q2}, Q3: ${stock.Q3} (${stock.year_end} end)`}
                    <p>EPS: {stock.EPS}</p>
                  </td>
                  <td className="px-4 py-2 border">
                    {stock.close && stock.EPS
                      ? (stock.close / stock.EPS).toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{stock.rsi_14}</td>
                  <td className="px-4 py-2 border">{stock.nav}</td>
                  <td className="px-4 py-2 border">{`${stock.public} + ${stock.foreign} + ${stock.institute} + ${stock.govt} + ${stock.director}`}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
