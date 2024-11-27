import React from "react";
import GptDisclosure from "../components/disclosure/GptDisclosure";
import Comment from "../components/disclosure/Comment";

export default function DisclosurePage() {
  const announcement_id = 908;
  return (
    <div className="flex flex-col mt-9 mb-20 items-center">
      <GptDisclosure announcement_id={announcement_id} />
      <div className=" mt-3 w-9/12">
        <Comment announcement_id={announcement_id} />
      </div>
    </div>
  );
}
