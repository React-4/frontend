import axios from "axios";

export async function getGPTDisclosure(announcement_id) {
  console.log("id", announcement_id);
  const res = await axios.get(
    `http://43.203.154.25:8080/api/announcement/${announcement_id}`
  );
  const data = await res.data.data;
  return data;
}

// export async function getStockByDisclosure(stock_id) {
//     const res = await axios.get(
//         `http://43.203.154.25:8080/api/announcement/${announcement_id}`
//       );
//       const data = await res.data.data;
//       return data;
// }
