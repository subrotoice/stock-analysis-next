"use client";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
};

const sampleData: Item[] = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
];

export default function WatchlistTable() {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  // 1st time Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    // console.log(stored);
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (id: number) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <table className="border-collapse border border-gray-300 w-1/2">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">ID</th>
          <th className="border border-gray-300 p-2">Name</th>
          <th className="border border-gray-300 p-2">Watch</th>
        </tr>
      </thead>
      <tbody>
        {sampleData.map((item) => (
          <tr key={item.id}>
            <td className="border border-gray-300 p-2">{item.id}</td>
            <td className="border border-gray-300 p-2">{item.name}</td>
            <td
              className="border border-gray-300 p-2 cursor-pointer text-xl"
              onClick={() => toggleWatchlist(item.id)}
            >
              {watchlist.includes(item.id) ? "⭐" : "☆"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
