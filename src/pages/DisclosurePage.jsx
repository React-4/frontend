import React from "react";
import GptDisclosure from "../components/disclosure/GptDisclosure";
import Comment from "../components/disclosure/Comment";
import { useParams } from "react-router-dom";

export default function DisclosurePage() {
  const params = useParams();
  return (
    <div className="flex flex-col mt-9 mb-20 items-center">
      <GptDisclosure announcement_id={params.id} />
      <div className=" mt-3 w-9/12">
        <Comment announcement_id={params.id} />
      </div>
    </div>
  );
}
