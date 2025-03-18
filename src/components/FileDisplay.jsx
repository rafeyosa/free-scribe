import React from "react";

export default function FileDisplay(props) {
  const { file, handleAudioReset, handleFormSubmission } = props;

  return (
    <main className="flex-1 p-4 flex flex-col justify-center text-center gap-3 sm:gap-4 pb-20 w-full max-w-prose mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 bold">File</span>
      </h1>
      <div className="flex flex-col text-left my-4">
        <h3 className="font-semibold">Name</h3>
        <p>{file ? file.name : 'Custom audio'}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          className="text-slate-400 hover:text-blue-600 duration-200"
          onClick={handleAudioReset}
        >
          <p>Reset</p>
        </button>
        <button className="specialBtn px-3 py-2 rounded-lg text-blue-400 flex items-center gap-2 font-medium" onClick={handleFormSubmission}>
          <p>Transcribe</p>
          <i className="fa-solid fa-pen-nib"/>
        </button>
      </div>
    </main>
  );
}
