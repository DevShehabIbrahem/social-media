import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { feedQuery, searchQuery } from "../utility/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    let cleanUp = true;

    if (categoryId) {
      setLoading(true);

      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        if (cleanUp) {
          setPins(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
    return () => {
      cleanUp = false;
      setLoading(false);
    };
  }, [categoryId]);

  if (loading) return <Spinner message="we are Adding ideas To your feed !" />;

  return (
    <div>
      {pins?.length === 0 && (
        <h1 className="text-center font-bold mt-4"> No pins Available</h1>
      )}
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;
