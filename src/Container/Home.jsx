import React, { useEffect, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Routes, Link, Route } from "react-router-dom";

import { Sidebar, Userprofile } from "../Components";
import Pins from "./Pins";
import { userQuery } from "../utility/data";
import { client } from "../client.js";
import logo from "../Assets/logo.png";
import { fetchuser } from "../utility/fetchUser";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchuser();

  useEffect(() => {
    let cleanUp = true;
    const query = userQuery(userInfo?.googleId);
    client.fetch(query).then((data) => {
      if (cleanUp) {
        setUser(data[0]);
      }
    });

    return () => {
      cleanUp = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>

      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md w-full">
          <HiMenu
            fontSize={30}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/"${user?._id}"`}>
            <img src={user?.image} alt="logo" className="w-28  rounded-full" />
          </Link>
        </div>

        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute flex w-full justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={20}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>

            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<Userprofile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
