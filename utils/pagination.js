const MAX_LIMIT = 100;

// 統一解析分頁參數：非法或缺漏值一律回退預設值，並把 limit 夾在 1~MAX_LIMIT 之間
export const parsePagination = ({ page, limit } = {}) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const safePage = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safeLimit =
    Number.isSafeInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : 10;

  return { page: safePage, limit: safeLimit };
};
