import React, { useState, useEffect } from "react";
import { client } from "../client";
import { searchQuery, feedQuery } from "../utility/data";

import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== "") {
      setLoading(true);

      const query = searchQuery(searchTerm);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((res) => {
        setPins(res);
      });
    }
  }, [searchTerm]);

  if (loading) return <Spinner message="loading" />;

  return (
    <>
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}

      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No Pins Found!</div>
      )}
    </>
  );
};

export default Search;
