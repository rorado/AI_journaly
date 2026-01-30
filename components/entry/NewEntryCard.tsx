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
          title="Add"
          className="cssbuttons-io-button"
          onClick={handleToggle}
        >
          <svg
            height="25"
            width="25"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
              fill="currentColor"
            ></path>
          </svg>
          <span>Add</span>
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
