import React from "react";
import GptDisclosure from "../components/disclosure/GptDisclosure";
import Comment from "../components/disclosure/Comment";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGPTDisclosure } from "../services/disclosureAPI";
import { addToHistory } from "../utils/history";

export default function DisclosurePage() {
  const [announcement, setAnnouncement] = useState([]);
  const location = useLocation();
  const [isGoodAnimating, setIsGoodAnimating] = useState(false); // 애니메이션 상태
  const [isBadAnimating, setIsBadAnimating] = useState(false); // 애니메이션 상태
  console.log(location.state);
  let data = location.state?.data[0];
  const params = useParams();

  useEffect(() => {
    getGPTDisclosure(params.id)
      .then((data) => {
        setAnnouncement(data);
        const disclosureItem = {
          id: params.id,
          company: location.state?.data[0].company,
          title: data.title,
          date: data.announcementDate,
          stockId: data.stockId,
        };
        addToHistory("disclosure", disclosureItem);
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
        // stockId={data.}
      />

      <div className=" mt-3 w-9/12">
        <Comment announcement={announcement} announcement_id={params.id} />
      </div>
    </div>
  );
}
