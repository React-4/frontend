import axios from "axios";

export async function getCommentByStock(stock_id) {
  const res = await axios.get(
    "http://43.203.154.25:8080/api/comments/stock/4360?page=0&size=10"
  );
  const data = await res.data.data;
  return data;
}

export async function getCommentByAnnouncement(announcement_id) {
  const res = await axios.get(
    `http://43.203.154.25:8080/api/comments/announcement/${announcement_id}`
  );
  const data = await res.data.data;
  return data;
}
