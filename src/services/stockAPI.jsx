const BASE_URL = import.meta.env.VITE_BACK_URL;

export const addFavoriteAnnouncementAPI = async (announcementId) => {
  const response = await fetch(`${BASE_URL}/api/favorite/announcement/${announcementId}`, {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const announcementIds = JSON.parse(localStorage.getItem("favoriteAnnouncementIds") || "[]");
    if (!announcementIds.includes(announcementId)) {
      announcementIds.push(announcementId);
      localStorage.setItem("favoriteAnnouncementIds", JSON.stringify(announcementIds));
    }
  }
  if (!response.ok) {
    console.error("API 요청 실패:", await response.text());
  }

  return response.ok;
};

export const removeFavoriteAnnouncementAPI = async (announcementId) => {
  const response = await fetch(`${BASE_URL}/api/favorite/announcement/${announcementId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.ok) {
    const announcementIds = JSON.parse(localStorage.getItem("favoriteAnnouncementIds") || "[]");
    const updatedAnnouncementIds = announcementIds.filter((id) => id !== announcementId);
    localStorage.setItem("favoriteAnnouncementIds", JSON.stringify(updatedAnnouncementIds));
  }
  if (!response.ok) {
    console.error("API 요청 실패:", await response.text());
  }

  return response.ok;
};

export const addFavoriteStockAPI = async (stockId) => {
  const response = await fetch(`${BASE_URL}/api/favorite/stock/${stockId}`, {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const stockIds = JSON.parse(localStorage.getItem("favoriteStockIds") || "[]");
    if (!stockIds.includes(stockId)) {
      stockIds.push(stockId);
      localStorage.setItem("favoriteStockIds", JSON.stringify(stockIds));
    }
  }
  if (!response.ok) {
    console.error("API 요청 실패:", await response.text());
  }

  return response.ok;
};

export const removeFavoriteStockAPI = async (stockId) => {
  const response = await fetch(`${BASE_URL}/api/favorite/stock/${stockId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.ok) {
    const stockIds = JSON.parse(localStorage.getItem("favoriteStockIds") || "[]");
    const updatedStockIds = stockIds.filter((id) => id !== stockId);
    localStorage.setItem("favoriteStockIds", JSON.stringify(updatedStockIds));
  }
if (!response.ok) {
  console.error("API 요청 실패:", await response.text());
}
  return response.ok;
};

  export const fetchStockPricesAPI = (stockIds) =>
    fetch(`${BASE_URL}/api/favorite/stock/price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stockIds),
      credentials: "include",
    }).then((response) => response.json());
  
  export const fetchAnnouncementListAPI = (announcementIds) =>
    fetch(`${BASE_URL}/api/announcement/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(announcementIds),
      credentials: "include",
    }).then((response) => response.json());
  