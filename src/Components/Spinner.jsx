import React from "react";
import { Circles } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Circles color="#00BFFF" height={60} width={60} className="m-5" />
      <p className="text-lg text-center px-3">{message}</p>
    </div>
  );
};

export default Spinner;
