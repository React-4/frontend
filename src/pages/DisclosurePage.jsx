import React from "react";
import GptDisclosure from "../components/disclosure/GptDisclosure";
import Comment from "../components/disclosure/Comment";

export default function DisclosurePage() {
  return (
    <div className="flex flex-col mt-9 mb-20 items-center">
      <GptDisclosure />
      <Comment />
    </div>
  );
}
