import React, { useState, useEffect } from "react";

import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utility/data";

import { client } from "../client";
import MasonryLayout from "../Components/MasonryLayout";
import Spinner from "./Spinner";

const ActiveBtnStyle =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyle =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const Userprofile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activebtn, setActivebtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear;

  useEffect(() => {
    const query = userQuery(User?.googleId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [User?.googleId]);
  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(User?.googleId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(User?.googleId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text]);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!User) return <Spinner message=" loading..." />;
  console.log(user);
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src="https://source.unsplash.com/1600x900/?space,nature,photography,art"
              alt="Cover-user"
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            />

            <img
              src={User?.imageUrl}
              alt="user-profile"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />

            <h1 className="font-bold mt-3 text-center text-3xl">{User.name}</h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {User?.googleId && (
                <GoogleLogout
                  clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>

          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActivebtn("created");
              }}
              className={
                activebtn === "created" ? ActiveBtnStyle : notActiveBtnStyle
              }
            >
              Created
            </button>

            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActivebtn("savePins");
              }}
              className={
                activebtn === "savePins" ? ActiveBtnStyle : notActiveBtnStyle
              }
            >
              savePins
            </button>
          </div>

          {pins?.length !== 0 ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
