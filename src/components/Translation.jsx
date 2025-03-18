import React from "react";
import { LANGUAGES } from "../utils/presets";

export default function Translation(props) {
  const {
    translating,
    toLanguage,
    setToLanguage,
    textResult,
    generateTranslation,
  } = props;
  return (
    <div className="flex flex-col gap-4 max-w-[400px] w-full mx-auto">
      {!translating && (
        <div className="flex flex-col gap-2">
          <p className="text-xs sm:text-sm font-medium text-slate-500 mr-auto">
            To language
          </p>
          <div className="flex items-stretch gap-3">
            <select
              value={toLanguage}
              onChange={(e) => {
                setToLanguage(e.target.value);
              }}
              className="flex-1 outline-none bg-white focus:outline-none border border-solid border-transparent hover:border-blue-300 duration-200 rounded p-2"
            >
              <option value="">Select language</option>
              {Object.entries(LANGUAGES).map(([key, value]) => {
                return (
                  <option key={key} value={value}>
                    {key}
                  </option>
                );
              })}
            </select>
            <button
              className="specialBtn px-3 py-2 rounded-lg text-blue-400 hover:text-blue-600 duration-200"
              onClick={generateTranslation}
            >
              Translate
            </button>
          </div>
        </div>
      )}
      {textResult && !translating && <p>{textResult}</p>}
      {translating && (
        <div className="grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin" />
        </div>
      )}
    </div>
  );
}
