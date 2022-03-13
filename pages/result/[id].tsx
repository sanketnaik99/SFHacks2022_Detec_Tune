import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
// Components
import Image from "next/image";
// Hero Icons
import { MusicNoteIcon, UserIcon } from "@heroicons/react/solid";
const LYRICS_COLLECTION = "Lyrics";

export interface Song {
  filename: string;
  song: string;
  artist: string;
  transcript: string;
  lyrics: string;
  translateCode: string;
  translateTo: string;
  translation: string[0];
  thumbnail: string;
}

const Result = () => {
  const router = useRouter();
  const { id } = router.query;

  const db = getFirestore();
  const [displaySong, setDisplaySong] = useState<Song>();

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const docRef = doc(db, LYRICS_COLLECTION, id + "");
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());

    setDisplaySong(docSnap.data() as Song);
  };

  return (
    <div className="min-h-screen mb-10">
      <div className="mt-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-sans font-bold text-gray-700 dark:text-gray-100">
          Result.
        </h1>
        <h4 className="mt-2 text-lg md:text-xl font-sans font-semibold text-gray-600 dark:text-gray-300">
          Here&apos;s the result of your song detection.
        </h4>
      </div>
      <div
        style={{ alignContent: "center", alignItems: "center" }}
        className="mt-8 mx-2 sm:mx-auto w-full lg:w-3/4"
      >
        <div className="flex flex-row justify-center mx-2">
          <img src={displaySong?.thumbnail} />
        </div>
        <div className="mt-6 flex flex-col items-center">
          <div>
            {displaySong?.song ? (
              <div className="flex flex-row items-center">
                <MusicNoteIcon className="h-7 w-7 inline-block mr-2 dark:text-gray-300 text-gray-600" />
                <span className="mr-4 font-semibold text-2xl dark:text-gray-300 text-gray-600">
                  Song:
                </span>
                <span className="font-bold text-2xl dark:text-gray-100 text-gray-700">
                  {displaySong.song}
                </span>
              </div>
            ) : (
              <p className="bg-gray-500 animate-pulse h-6 w-full mb-2 px-10 py-2"></p>
            )}
          </div>
          <span className="mt-4 block text-lg dark:text-gray-200 font-semibold text-gray-600 text-md mb-2">
            {displaySong?.artist ? (
              <div className="flex flex-row items-center">
                <UserIcon className="h-7 w-7 inline-block mr-2 dark:text-gray-300 text-gray-600" />
                <span className="mr-4 font-semibold text-2xl dark:text-gray-300 text-gray-600">
                  Artist:
                </span>
                <span className="font-bold text-2xl dark:text-gray-100 text-gray-700">
                  {displaySong.artist}
                </span>
              </div>
            ) : (
              <p className="bg-gray-400 animate-pulse h-4 w-full mb-2 px-10 py-2"></p>
            )}
          </span>
        </div>
        <div className="mt-8 mx-2 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <div className="font-bold text-2xl text-center text-gray-700 dark:text-gray-200 font-sans mb-4">
              Lyrics (English)
            </div>
            {displaySong ? (
              <p
                className="block text-center text-gray-600 dark:text-gray-200 text-md mb-2"
                style={{ whiteSpace: "pre" }}
              >
                {displaySong?.lyrics
                  ? `${displaySong?.lyrics}`
                  : `${displaySong?.transcript}`}
              </p>
            ) : (
              <>
                <p className="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-300"></p>
                <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-300"></p>
                <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-300"></p>
              </>
            )}
          </div>
          <div>
            <div className="font-bold text-2xl text-center text-gray-700 dark:text-gray-200 mb-4 font-sans">
              Translation ({displaySong?.translateTo})
            </div>
            <p
              className="block text-gray-600 text-center dark:text-gray-200 text-md mb-2"
              style={{ whiteSpace: "pre" }}
            >
              {displaySong?.translation ? (
                `${displaySong?.translation}`
              ) : (
                <>
                  <p className="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-300"></p>
                  <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-300"></p>
                  <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-300"></p>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
