import React from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Vid from "../Assets/share.mp4";
import { client } from "../client";

import logowhite from "../Assets/logowhite.png";
import { fetchuser } from "../utility/fetchUser";

const Login = () => {
  const navigate = useNavigate();
  const user = fetchuser();

  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    const { name, googleId, imageUrl } = response.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: user && name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={Vid}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="h-full w-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
          <div className="p5">
            <img src={logowhite} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN} //From The Google.Console
              render={(renderprop) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 mt-2 rounded-lg cursor-pointer output-none"
                  onClick={renderprop.onClick}
                  disabled={renderprop.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle} //User Data responseGoogle
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
