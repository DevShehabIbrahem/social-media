import React from "react";
import { Circles } from "react-loader-spinner";

const Spinnersaving = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Circles color="#ffff" height={15} width={15} className="m-5" />
      <p className="text-lg text-center px-3">{message}</p>
    </div>
  );
};

export default Spinnersaving;
