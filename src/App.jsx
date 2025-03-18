import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";
import { MessageTypes } from "./utils/presets";

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAudioAvailable = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case MessageTypes.DOWNLOADING:
          console.log(MessageTypes.DOWNLOADING);
          break;
        case MessageTypes.LOADING:
          console.log(MessageTypes.LOADING);
          setIsLoading(true);
          break;
        case MessageTypes.RESULT:
          console.log(MessageTypes.RESULT, e.data.results);
          setOutput(e.data.results);
          break;
        case MessageTypes.INFERENCE_DONE:
          console.log(MessageTypes.INFERENCE_DONE);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  }, []);

  async function readAudioFrom(file) {
    const samplingRate = 16000;
    const audioCtx = new AudioContext({ sampleRate: samplingRate });
    const response = await file.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      return;
    }

    let audio = await readAudioFrom(file ? file : audioStream);

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
    });
  }

  return (
    <div className="felx flex-col max-w-[1000px] mx-auto">
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? (
          <Information output={output} />
        ) : isLoading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay
            file={file}
            audioStream={audioStream}
            handleAudioReset={handleAudioReset}
            handleFormSubmission={handleFormSubmission}
          />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
