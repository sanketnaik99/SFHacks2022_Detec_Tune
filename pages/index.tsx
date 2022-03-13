import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// Hero Icons
import { MusicNoteIcon, UserIcon, SearchIcon } from "@heroicons/react/solid";

// Constants
const LYRICS_COLLECTION = "Lyrics";

export interface Song {
  artist: string;
  filename: string;
  lyrics: string;
  song: string;
  transcript: string;
  translateTo: string;
  translation: string;
  thumbnail: string;
}

const Home: NextPage = () => {
  // Firestore DB
  const db = getFirestore();
  const [songs, setSongs] = useState<Song[]>([]);
  let textInput = React.createRef<HTMLInputElement>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, LYRICS_COLLECTION));
    let songData: Song[] = [];
    querySnapshot.forEach((doc) => {
      let parsed = doc.data() as Song;
      songData.push(parsed);
    });
    setSongs(songData);
  };

  // const getRandomImageIndex = () => {
  //   const randomNumber = Math.floor(Math.random() * images.length);
  //   return randomNumber;
  // };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const query = textInput?.current?.value;
    if (query === "") {
      fetchData();
    } else {
      searchByLyrics(query);
    }
  };

  const searchByLyrics = (query: any) => {
    let result = [];
    result = songs.filter(
      (song) => song.lyrics?.toLowerCase().search(query.toLowerCase()) > -1
    );
    setSongs(result);
  };

  return (
    <div className="mb-10 min-h-screen">
      <div className="header flex flex-col items-center justify-center mt-10 mb-6">
        <h1 className="text-2xl md:text-5xl text-gray-800 dark:text-gray-100 font-sans font-bold">
          Songs History.
        </h1>
        <p className="mt-4 md:mt-6 text-xl text-gray-600 dark:text-gray-300 font-sans text-center px-3 font-semibold">
          Here&apos;s a list of all the songs that have been recognized before.
          Start typing the lyrics to find your song.
        </p>
      </div>

      <div className="pt-6 text-gray-600 dark:text-gray-300 md:w-1/2 mx-auto flex justify-center items-center relative">
        <input
          className="border-2 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-500 h-11 w-full mx-4 px-5 pr-16 rounded-lg text-sm focus:outline-none"
          type="search"
          name="search"
          ref={textInput}
          placeholder="Search for songs by lyrics..."
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute top-3 right-3"
          onClick={handleSearch}
        >
          <SearchIcon className="h-5 w-5 absolute right-5 top-6 text-gray-400 dark:text-gray-300 hover:dark:text-gray-100 z-20 hover:text-gray-500" />
        </button>
      </div>

      {songs.length ? (
        <div className="mt-8 mb-8 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {songs.map((song) => (
            <div
              key={song.filename}
              className="bg-gray-100 dark:bg-gray-700 rounded shadow-md overflow-hidden"
            >
              <div className="flex flex-row justify-center">
                <img src={song.thumbnail} className="w-full" />
              </div>
              <div className="p-6">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  <MusicNoteIcon className="h-5 w-5 inline-block mr-1" />
                  {song.song}
                </span>
                <span className="block text-gray-600 dark:text-gray-100 text-md mb-2">
                  <UserIcon className="h-5 w-5 inline-block mr-1" />
                  {song.artist}
                </span>
                <span className="block text-gray-500 dark:text-gray-300 text-sm mb-4">
                  Translated to{" "}
                  <span className="text-gray-700 dark:text-gray-100 font-semibold">
                    {song.translateTo}
                  </span>
                </span>
                <a
                  className="font-bold py-2 px-6 rounded w-full bg-white dark:bg-blue-500 text-blue-500 dark:text-white hover:shadow-lg hover:bg-blue-500 dark:hover:bg-white hover:text-white dark:hover:text-blue-500 border border-blue-500"
                  href={`/result/${song.filename}`}
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="bg-yellow-100 dark:bg-yellow-200 md:w-1/2 mx-6 md:mx-auto border-l-4 border-yellow-500 text-yellow-700 p-4 mt-10"
          role="alert"
        >
          <p className="font-bold">Warning</p>
          <p>No songs found. Please try again!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
