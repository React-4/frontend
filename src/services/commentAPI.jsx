import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACK_URL;

export async function getCommentByStock(stock_id) {
  const res = await axios.get(
    `${BASE_URL}/api/comments/stock/${stock_id}?page=0&size=10`
  );
  const data = await res.data.data;
  return data;
}

export async function getCommentByAnnouncement(announcement_id, page, size) {
  const res = await axios.get(
    `${BASE_URL}/api/comments/announcement/${announcement_id}?page=${page}&size=${size}`
  );
  const data = await res.data.data;
  return data;
}

export async function postComment(announcement_id, content) {
  const res = await axios.post(
    `${BASE_URL}/api/comments/${announcement_id}`,
    { content: content },
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function patchComment(comment_id, content) {
  console.log(comment_id, content);
  const res = await axios.patch(
    `${BASE_URL}/api/comments/${comment_id}`,
    { content: content },
    {
      withCredentials: true,
    }
  );
  console.log(res);
}

export async function deleteComment(comment_id) {
  const res = await axios.delete(`${BASE_URL}/api/comments/${comment_id}`, {
    withCredentials: true,
  });
  console.log(res);
}
