/* eslint-disable react/prop-types */
import React from "react";
import { formatDate } from "../disclosure/CommentItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StockComment({
  announcementId,
  announcementTitle,
  commentId,
  content,
  createdAt,
  userProfileColor,
  username,
  company,
}) {
  const navigate = useNavigate();
  const colorClasses = [
    "bg-profile",
    "bg-profile-0",
    "bg-profile-1",
    "bg-profile-2",
    "bg-profile-3",
    "bg-profile-4",
    "bg-profile-5",
    "bg-profile-6",
    "bg-profile-7",
    "bg-profile-8",
    "bg-profile-9",
  ];

  const colorClass = colorClasses[userProfileColor];

  return (
    <div
      className="flex flex-row justify-between mt-6 w-full items-center cursor-pointer"
      onClick={() => {
        navigate(`/disclosure/${announcementId}`, {
          state: { data: [{ company: company }] },
        });
      }}
    >
      <div
        className={`rounded-full w-10 h-10 text-white p-1 ${colorClass} flex flex-col items-center justify-center`}
      >
        {username.slice(0, 2)}
      </div>
      <div className="w-full flex flex-col px-4">
        <div className="flex flex-row items-center">
          {username}
          <span className="ml-3 text-xs text-primary-2">
            {formatDate(createdAt)}
          </span>

          <span className="ml-3 text-sm text-primary-2 font-bold ">
            {announcementTitle}
          </span>
        </div>

        <div className="w-full max-h-12 rounded-lg overflow-hidden">
          {content}
        </div>
      </div>
    </div>
  );
}
