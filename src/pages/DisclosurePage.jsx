import React from "react";
import GptDisclosure from "../components/disclosure/GptDisclosure";
import Comment from "../components/disclosure/Comment";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGPTDisclosure } from "../services/disclosureAPI";

export default function DisclosurePage() {
  const [announcement, setAnnouncement] = useState([]);
  const location = useLocation();

  const data = location.state?.data[0];
  const params = useParams();

  useEffect(() => {
    getGPTDisclosure(params.id)
      .then((data) => {
        setAnnouncement(data);
      })
      .catch((error) => {
        console.error("Error fetching announcement data:", error);
      });
  }, [params.id]);
  return (
    <div className="flex flex-col mt-9 mb-20 items-center">
      <GptDisclosure
        announcement={announcement}
        company={data ? data.company : ""}
      />
      <div className=" mt-3 w-9/12">
        <Comment announcement={announcement} announcement_id={params.id} />
      </div>
    </div>
  );
}
