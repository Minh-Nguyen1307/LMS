import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Posters() {

  const allPosters = [
    {
      id: uuidv4(),
      numberStatus: "25000+",
      describeStatus: "Enrolled students in our courses",
    },
    {
      id: uuidv4(),
      numberStatus: "1000+",
      describeStatus: "Available online courses",
    },
    {
      id: uuidv4(),
      numberStatus: "1500+",
      describeStatus: "Experienced mentors teaching courses",
    },
    {
      id: uuidv4(),
      numberStatus: "2400+",
      describeStatus: "Hours of video content available",
    },
  ];

  const [poster, setPoster] = useState(allPosters);

  const Poster = ({ numberStatus, describeStatus }) => {
    return (
      <div className="flex flex-col justify-center items-center gap-3 w-full sm:w-1/2 md:w-1/4 lg:w-1/5 border-l-4 border-r-4 py-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">{numberStatus}</h3>
        <p className="text-base sm:text-lg text-center">{describeStatus}</p>
      </div>
    );
  };

  const PosterList = ({ poster }) => {
    return (
      <div className="flex flex-wrap justify-around items-center bg-zinc-100 gap-4 mb-5 mt-5 px-4 py-8">
        {poster.map((allPoster) => (
          <Poster
            key={allPoster.id}
            numberStatus={allPoster.numberStatus}
            describeStatus={allPoster.describeStatus}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PosterList poster={poster} />
    </div>
  );
}
