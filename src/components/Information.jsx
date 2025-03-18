import React, { useEffect, useRef, useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState("transcription");
  const [translation, setTranslation] = useState(null);
  const [translating, setTranslating] = useState(null);
  const [toLanguage, setToLanguage] = useState("");

  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../utils/translate.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = async (e) => {
      switch (e.data.status) {
        case "initiate":
          console.log("Initiate");
          break;
        case "progress":
          console.log("Progress");
          break;
        case "update":
          console.log("Update", e.data.output);
          setTranslation(e.data.output);
          break;
        case "complete":
          console.log("Complete");
          setTranslating(false);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  }, []);

  function generateTranslation() {
    if (translating || toLanguage == "") {
      return;
    }
    setTranslating(true);

    worker.current.postMessage({
      text: output.map((val) => val.text),
      src_lang: "eng_Latn",
      tgt_lang: toLanguage,
    });
  }

  const textResult =
    tab === "transcription" ? output.map((val) => val.text) : translation || "";

  function handleCopy() {
    navigator.clipboard.writeText(textResult);
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([textResult], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `FreeScribe_${+new Date()}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <main className="flex-1 p-4 flex flex-col justify-center text-center gap-3 sm:gap-4 pb-20 w-full max-w-prose mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 bold">Transcription</span>
      </h1>
      <div className="grid grid-cols-2 items-center mx-auto bg-white shadow rounded-full overflow-hidden">
        <button
          className={
            "px-4 py-1 duration-200 " +
            (tab === "transcription"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
          onClick={() => setTab("transcription")}
        >
          Transcription
        </button>
        <button
          className={
            "px-4 py-1 duration-200 " +
            (tab === "translation"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
          onClick={() => setTab("translation")}
        >
          Translation
        </button>
      </div>
      <div className="flex flex-col my-8">
        {tab === "transcription" ? (
          <Transcription textResult={textResult} />
        ) : (
          <Translation
            translating={translating}
            toLanguage={toLanguage}
            setToLanguage={setToLanguage}
            textResult={textResult}
            generateTranslation={generateTranslation}
          />
        )}
      </div>
      <div className="flex items-center gap-4 mx-auto text-base">
        <button
          title="Copy"
          className="bg-white text-blue-300 hover:text-blue-400 duration-200 rounded aspect-square px-4"
          onClick={handleCopy}
        >
          <i className="fa-solid fa-copy" />
        </button>
        <button
          title="Download"
          className="bg-white text-blue-300 hover:text-blue-400 duration-200 rounded aspect-square px-4"
          onClick={handleDownload}
        >
          <i className="fa-solid fa-download" />
        </button>
      </div>
    </main>
  );
}
