import React, { useEffect, useState } from "react";
import { firebaseApp } from "./_app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";

interface Language {
  name: string;
  code: string;
}

const languages: Language[] = [
  { name: "English", code: "en" },
  { name: "Mandarin", code: "zh-TW" },
  { name: "Hindi", code: "hi" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "Arabic", code: "ar" },
  { name: "Bengali", code: "bn" },
  { name: "Portuguese", code: "pt" },
  { name: "Indonesian", code: "id" },
];

const Upload = () => {
  const [recordingProgress, setProgress] = useState(0);
  const [isRecording, setRecording] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isDropdownOpen, setDropDownOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(languages[0]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileKey, setFileKey] = useState("");

  const storage = getStorage(firebaseApp);

  const router = useRouter();

  useEffect(() => {
    if (isRecording && recordingProgress < 100) {
      setTimeout(() => {
        setProgress(recordingProgress + 1);
      }, 95);
    }
  }, [recordingProgress, isRecording]);

  const recordAudio = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("Mic Support works.");
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          // Create Media Recorder Object
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
          });
          const recordedChunks: any[] = [];
          mediaRecorder.addEventListener("dataavailable", (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
          });
          mediaRecorder.addEventListener("stop", function () {
            console.log("Updating download");
            const audioData = new Blob(recordedChunks, { type: "audio/mpeg" });
            uploadAudio(audioData, `recording-${Date.now().toString()}.mp3`);
          });
          setProgress(0);
          mediaRecorder.start();
          setRecording(true);
          setTimeout(() => {
            console.log("Stopping");
            setRecording(false);
            mediaRecorder.stop();
            stream.getTracks().forEach((track) => track.stop());
          }, 20000);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Cannot get user media.");
    }
  };

  const handleFileChange = (e: any) => {
    // console.log(e.target.files[0], e.target.files[0].name);
    uploadAudio(e.target.files[0], e.target.files[0].name);
    setFileKey(" ");
  };

  const uploadAudio = (data: File | Blob, filename: string) => {
    setUploading(true);
    const audioRef = ref(storage, `${filename}`);
    if (data) {
      const uploadTask = uploadBytesResumable(audioRef, data, {
        customMetadata: {
          languageCode: targetLanguage.code,
          languageName: targetLanguage.name,
        },
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
          setFileKey(" ");
          setUploading(false);
          window.location.reload();
        },
        () => {
          console.log("Uploaded File");
          setUploading(false);
          setFileKey(" ");
          setTimeout(() => {
            router.push(`/result/${filename}`);
          }, 1000);
        }
      );
    }
  };

  return (
    <div className="min-h-screen mb-8">
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-4xl md:text-6xl text-gray-800 dark:text-gray-100 font-sans font-bold">
          Upload.
        </h1>
        <h3 className="mt-4 px-4 md:px-2 text-center text-md md:text-xl text-gray-600 dark:text-gray-300 font-sans font-medium">
          Select your target language and upload or record a song.
        </h3>
      </div>
      {/* Dropdown */}
      {isDropdownOpen ? (
        <div
          className={[
            "absolute left-0 top-0 bg-gray-900 w-full h-screen z-0 transition duration-500",
            isDropdownOpen ? "opacity-50" : "opacity-0",
          ].join(" ")}
          onClick={() => setDropDownOpen(false)}
        />
      ) : null}
      <div className="mt-5 flex flex-row items-center justify-center">
        <h3 className="mr-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          Target Language
        </h3>
        <div className="flex flex-row justify-center">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 hover:dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => setDropDownOpen(!isDropdownOpen)}
              >
                {targetLanguage.name}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {isDropdownOpen ? (
              <div
                className={[
                  "transition ease-in-out duration-100 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none",
                  isDropdownOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95",
                ].join(" ")}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                <div className="py-1" role="none">
                  {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                  {languages.map((language) => (
                    <div
                      className={[
                        "text-gray-700 dark:text-gray-100 block px-4 py-2 text-sm cursor-pointer",
                        targetLanguage.code === language.code
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900"
                          : "text-gray-700",
                      ].join(" ")}
                      role="menuitem"
                      tabIndex={-1}
                      key={language.code}
                      onClick={() => {
                        setTargetLanguage(language);
                        setDropDownOpen(false);
                      }}
                      id="menu-item-0"
                    >
                      {language.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* End of Dropdown */}
      <div className="flex flex-col items-center mt-14">
        <div
          className="bg-white dark:bg-blue-500 text-blue-500 dark:text-white rounded-xl p-8 shadow-sm cursor-pointer flex flex-row items-center hover:shadow-lg hover:bg-blue-500 dark:hover:bg-white hover:text-white dark:hover:text-blue-500 border border-blue-500"
          onClick={() => recordAudio()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <h2 className="text-4xl font-bold ml-8">Record.</h2>
        </div>
        {isRecording ? (
          <div className="mt-6 px-4 w-11/12 md:w-1/2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Recoding in progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {recordingProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${recordingProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowraptext-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-8 flex flex-row justify-center items-center">
          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 w-24 md:w-40 mr-2"></div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            OR
          </h3>
          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 w-24 md:w-40 ml-2"></div>
        </div>
        <div className="mt-8">
          <label className="flex flex-row items-center p-8 bg-white dark:bg-blue-500 text-blue-500 dark:text-white rounded-xl shadow-sm tracking-wide border border-blue-500 cursor-pointer hover:shadow-lg hover:bg-blue-500 dark:hover:bg-white hover:text-white dark:hover:text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-4xl font-bold ml-8">Upload.</span>
            <input
              type="file"
              className="hidden"
              accept=".mp3"
              onChange={(e) => handleFileChange(e)}
              key={fileKey}
            />
          </label>
        </div>
        {isUploading ? (
          <div className="mt-6 px-4 w-11/12 md:w-1/2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Uploading File
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowraptext-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Upload;
