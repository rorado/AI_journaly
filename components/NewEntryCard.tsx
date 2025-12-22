"use client";

import { MdAddCircle } from "react-icons/md";
import NewEntryModel from "./entry/NewEntryModel";
import { useState } from "react";

const NewEntryCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6 px-6 py-1.50">
      <div className="flex justify-between items-center">
        <h1 className="text-[40px] my-2 font-thin">Journals</h1>

        <div className="flex flex-col items-center gap-2">
          <div className="group relative bg-zinc-300 p-2 rounded-full">
            <MdAddCircle
              size={34}
              className="hover:scale-140 cursor-pointer"
              onClick={handleToggle}
            />
            <div className="bg-zinc-800 p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2 transition-all duration-800">
              <span className="text-zinc-400 whitespace-nowrap">
                Add new journal
              </span>
            </div>
          </div>
        </div>
        <NewEntryModel toggle={handleToggle} isOpen={isOpen} />
      </div>
    </div>
  );
};

export default NewEntryCard;
