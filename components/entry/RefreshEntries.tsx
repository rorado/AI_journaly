"use client";

import { TfiReload } from "react-icons/tfi";

const RefreshEntries = ({ handleReload }: { handleReload: () => any }) => {
  return (
    <button
      type="button"
      title="Refresh"
      className="cssbuttons-io-button"
      onClick={handleReload}
    >
      <TfiReload size={20} />
      <span className="ml-2">Refresh</span>
    </button>
  );
};

export default RefreshEntries;
