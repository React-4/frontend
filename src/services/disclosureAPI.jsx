import axios from "axios";
import { BASE_URL } from "../utils/api";

export async function getGPTDisclosure(announcement_id) {
  console.log("id", announcement_id);
  const res = await axios.get(
    `${BASE_URL}/api/announcement/${announcement_id}`
  );
  const data = await res.data.data;
  return data;
}
