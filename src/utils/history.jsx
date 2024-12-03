export const addToHistory = (type, item) => {
  if (!item.id) {
    console.warn("Item does not have an id. Not saving to history.");
    return;
  }

  const history = JSON.parse(
    sessionStorage.getItem("viewHistory") || '{"stock":[], "disclosure":[]}'
  );

  // 최대 저장 개수 설정
  const MAX_ITEMS = 10;

  // 이미 존재하는 항목 제거
  history[type] = history[type].filter(
    (existingItem) => existingItem.id !== item.id
  );

  // 새 항목 추가
  history[type].unshift(item);

  // 최대 개수 유지
  if (history[type].length > MAX_ITEMS) {
    history[type] = history[type].slice(0, MAX_ITEMS);
  }

  // session storage에 저장
  sessionStorage.setItem("viewHistory", JSON.stringify(history));
};

// history에서 항목 삭제 기능 추가
export const removeFromHistory = (type, itemId) => {
  const history = JSON.parse(
    sessionStorage.getItem("viewHistory") || '{"stock":[], "disclosure":[]}'
  );

  // 항목 제거
  history[type] = history[type].filter(
    (existingItem) => existingItem.id != itemId
  );

  // session storage에 저장
  sessionStorage.setItem("viewHistory", JSON.stringify(history));

  return history[type];
};
