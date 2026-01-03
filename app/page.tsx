import StockTable from "./components/StockTable";
export interface StockData {
  id: number;
  code: string;
  name: string;
  sector: string;
  category: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  value: number;
  yearly_low: number;
  yearly_high: number;
  rsi_14: number;
  Q1: number;
  Q2: number;
  Q3: number;
  EPS: number;
  year_end: string;
  nav: number; // Net Asset Value per share
  public: number; // Public shareholders percentage
  foreign: number; // Foreign ownership percentage
  institute: number; // Institutional investors percentage
  govt: number; // Government ownership percentage
  director: number; // Board directors/insiders percentage
  lowFrom52wHigh: number;
  peg?: number | null;
}

export default async function Home() {
  const data = await fetch("https://stocknow.com.bd/api/v1/data-matrix", {
    cache: "no-store",
  });

  const stocksList: StockData[] = await data.json();

  return (
    <>
      <StockTable stocks={stocksList} />
    </>
  );
}
