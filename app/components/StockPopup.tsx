"use client";

import { StockData } from "../page";

interface StockPopupProps {
  stock: StockData;
  onClose: () => void;
}

const StockPopup = ({ stock, onClose }: StockPopupProps) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center"
      onClick={onClose} // click outside → close
    >
      {/* Popup Box */}
      <div
        className="w-[95vw] h-[95vh] rounded-md bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()} // prevent close on popup click
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {stock.code} - {stock.name}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-red-500 cursor-pointer"
            aria-label="Close popup"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(95vh-72px)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border rounded">Column 1</div>
            <div className="p-4 border rounded">Column 2</div>
            <div className="p-4 border rounded">Column 3</div>
            <div className="p-4 border rounded">Column 4</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPopup;
