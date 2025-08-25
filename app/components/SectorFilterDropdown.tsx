import React from "react";

interface Sector {
  id: number;
  name: string;
}

interface SectorFilterDropdownProps {
  sectors: Sector[];
  selected: string;
  onSelect: (value: string) => void;
}

const SectorFilterDropdown: React.FC<SectorFilterDropdownProps> = ({
  sectors,
  selected,
  onSelect,
}) => {
  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      className="border rounded px-3 py-2 w-full md:w-1/3"
    >
      <option value="">All Sectors</option>
      {sectors.map((sector) => (
        <option key={sector.id} value={sector.name}>
          {sector.name}
        </option>
      ))}
    </select>
  );
};

export default SectorFilterDropdown;
