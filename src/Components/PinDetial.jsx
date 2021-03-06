import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

import { client, urlFor } from "../client";

import MasonryLayout from "../Components/MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utility/data";
import Spinner from "./Spinner";

const PinDetial = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetials, setPinDetials] = useState(null);

  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetials(data[0]);

        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);

          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetials) return <Spinner message="this page is loading..." />;

  return (
    <>
      {pinDetials && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetials?.image && urlFor(pinDetials?.image).url()}
              alt="user-post"
            />
          </div>

          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${`${pinDetials.image?.asset?.url}`}?dl=`} //regexpu
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              <a href={pinDetials.destination} target="_blank" rel="noreferrer">
                {pinDetials.destination?.slice(8)}
              </a>
            </div>

            <div>
              <h1 className="text-4x1 font-bold break-words mt-3">
                {pinDetials.title}
              </h1>
              <p className="mt-3">{pinDetials.about}</p>
              <Link
                to={`/user-profile/${pinDetials.postedBy._id}`}
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
              >
                <img
                  src={pinDetials?.postedBy.image}
                  className="w-10 h-10 rounded-full"
                  alt="user-profile"
                />
                <p className="font-bold">{pinDetials?.postedBy.userName}</p>
              </Link>

              <h2 className="mt-3">Comments</h2>
              <div className="max-h-370 overflow-y-auto">
                {pinDetials?.comments?.map((item) => (
                  <div
                    className="flex gap-2 mt-5 cursor-pointer"
                    key={item.comment}
                  >
                    <img
                      src={item.postedBy?.image}
                      alt="user-profile"
                      className=" w-10 h-10 rounded-full cursor-pointer"
                    />

                    <div className="flex flex-col">
                      <p className="font-bold">{item.postedBy?.userName}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap mt-6 gap-3">
                <Link to={`/user-profile/{${pinDetials.postedBy?._id}`}>
                  <img
                    src={user.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>

                <input
                  className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2x1 focus:border-gray-300"
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button
                  type="button"
                  className="bg-red-500 text-white rounded-full px-6 py-6 font-semibold text-bease outline-none"
                  onClick={addComment}
                >
                  {addingComment ? "Doing..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {pins && <MasonryLayout pins={pins} />}
    </>
  );
};

export default PinDetial;
