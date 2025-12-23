"use client";

import { TfiReload } from "react-icons/tfi";

const RefreshEntries = ({ handleReload }: { handleReload: () => any }) => {
  return (
    <div className="group relative rounded-full bg-foreground p-1">
      <TfiReload
        size={26}
        className="cursor-pointer text-primary hover:scale-105 transition-transform duration-300"
        onClick={handleReload}
      />
      <div className="p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2 transition-all duration-800">
        <span className="whitespace-nowrap bg-primary px-2 py-1 rounded-md">
          refresh
        </span>
      </div>
    </div>
  );
};

export default RefreshEntries;
