"use client";

import { useEffect, useState } from "react";
import SectorFilterDropdown from "./SectorFilterDropdown";
import sectorMap from "../data/sectorMap";
import { StockData } from "../page";

type SortKey = "rsi" | "value" | "peRatio";
type SortOrder = "asc" | "desc";

interface StockDataProps {
  stocks: StockData[];
}
const StockTable = ({ stocks }: StockDataProps) => {
  const [filtered, setFiltered] = useState<StockData[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchSector, setSearchSector] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sectorList = Object.values(sectorMap);

  useEffect(() => {
    let updated = stocks.filter(
      (stock) =>
        stock.code.toLowerCase().includes(searchCode.toLowerCase()) &&
        stock.sector.toLowerCase().includes(searchSector.toLowerCase()) &&
        stock.category === "A"
    );

    if (sortKey) {
      updated = [...updated].sort((a, b) => {
        let aVal: number, bVal: number;

        switch (sortKey) {
          case "rsi":
            aVal = a.rsi_14;
            bVal = b.rsi_14;
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
  }, [searchCode, searchSector, sortKey, sortOrder, stocks]);

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
        Stock Data (A cat & PE:3-20, {stocks.length} Companies)
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Code"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <SectorFilterDropdown
          sectors={sectorList}
          selected={searchSector}
          onSelect={setSearchSector}
        />
      </div>
      <div className="overflow-y-auto max-h-screen border rounded shadow">
        <table className="min-w-full border border-gray-200 shadow-lg rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border">Code, Name, Sector</th>
              <th className="px-4 py-2 border">LTP</th>
              <th className="px-4 py-2 border">52W High-Low</th>
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
                    <span className="font-semibold">
                      {stock.code} ({stock.name.slice(0, 40)})
                    </span>
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
                      % -
                      {(
                        ((stock.yearly_high - stock.close) /
                          stock.yearly_high) *
                        100
                      ).toFixed(2)}
                      %
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
