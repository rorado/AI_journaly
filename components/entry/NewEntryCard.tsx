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
        <div className="group relative p-1S rounded-full bg-foreground">
          <MdAddCircle
            size={34}
            className=" cursor-pointer text-primary hover:scale-105 transition-transform duration-300"
            onClick={handleToggle}
          />
          <div className="p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2 transition-all duration-800">
            <span className="whitespace-nowrap bg-primary px-2 py-1 rounded-md">
              Add new journal
            </span>
          </div>
        </div>
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
