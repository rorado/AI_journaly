import React from "react";

const NewEntryCard = () => {
  return (
    <div className="mb-6 px-6 py-1.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 cursor-pointer">
      <h2 className="text-xl font-semibold mb-2">Create New Journal Entry</h2>
      <p className="text-gray-600">
        Click here to add a new entry to your journal.
      </p>
    </div>
  );
};

export default NewEntryCard;
