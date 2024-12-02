import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACK_URL;

export async function getGPTDisclosure(announcement_id) {
  const res = await axios.get(
    `${BASE_URL}/api/announcement/${announcement_id}`
  );
  const data = await res.data.data;
  return data;
}

export async function getChartDisclosure(stock_id, group_by) {
  console.log(group_by);
  const res = await axios.get(
    `${BASE_URL}/api/announcement/stock/${stock_id}/${group_by}`
  );
  const data = await res.data.data;
  return data;
}
