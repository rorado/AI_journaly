"use client";

import { MdAddCircle } from "react-icons/md";
import NewEntryModel from "./NewEntryModel";
import { useState } from "react";

const NewEntryCard = ({ handleReload }: { handleReload: () => any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          title="Add New Entry"
          className="cssbuttons-io-button"
          onClick={handleToggle}
        >
          <MdAddCircle size={20} />
          <span className="ml-2">New Entry</span>
        </button>
      </div>
      <NewEntryModel
        toggle={handleToggle}
        isOpen={isOpen}
        handleReload={handleReload}
      />
    </>
  );
};

export default NewEntryCard;
