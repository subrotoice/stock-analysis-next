import { StockData } from "../page";
import StockTable from "./_components/StockTable";

const Top15 = async () => {
  const data = await fetch("https://stocknow.com.bd/api/v1/data-matrix", {
    cache: "no-store",
  });

  const stocksList: StockData[] = await data.json();

  return (
    <>
      <StockTable stocks={stocksList} />
    </>
  );
};

export default Top15;
