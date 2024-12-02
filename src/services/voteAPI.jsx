import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACK_URL;

export async function getVote(announcement_id) {
  const res = await axios.get(`${BASE_URL}/api/feedback/${announcement_id}`);
  const data = await res.data.data;
  return data;
}

export async function postVote(announcement_id, content) {
  const res = await axios.post(
    `${BASE_URL}/api/feedback/${announcement_id}`,
    content,
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      withCredentials: true,
    }
  );
  return res;
}

export async function deleteVote(announcement_id) {
  const res = await axios.delete(
    `${BASE_URL}/api/feedback/${announcement_id}`,
    {
      withCredentials: true,
    }
  );
  return res;
}
