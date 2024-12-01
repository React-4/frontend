import axios from "axios";
import { Cookies } from "react-cookie";
import { useLogin } from "../hooks/useLogin";
const BASE_URL = import.meta.env.VITE_BACK_URL;

export async function getCommentByStock(stock_id) {
  const res = await axios.get(
    `/api/comments/stock/${stock_id}?page=0&size=10`
  );
  const data = await res.data.data;
  return data;
}

export async function getCommentByAnnouncement(announcement_id, page, size) {
  const res = await axios.get(
    `${BASE_URL}/api/comments/announcement/${announcement_id}?page=${page}&size=${size}`
  );
  const data = await res.data.data;
  console.log("commentbyann", data);
  return data;
}

export async function postComment(announcement_id, content) {
  // const { getCookie } = useLogin();

  const res = await axios.post(
    `${BASE_URL}/api/comments/${announcement_id}`,
    { content: content },
    {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0QGdtYWlsLmNvbSIsImV4cCI6MTczMjkzMDA4NywiZW1haWwiOiIxMjM0QGdtYWlsLmNvbSJ9.pKErmT09wKquseC-4b4Ls_q02KyvsegMwhfCI6s5OT36FaLMh-NWZiVW3A84Tx4ZCryRHDN7yOBF5N2GsXxoyw",
      },
      withCredentials: true,
    }
  );

  console.log(res);
}
