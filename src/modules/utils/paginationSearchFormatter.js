export default function paginationSearchFormatter({
  page,
  limit,
  searchResultCount,
  searchResult,
}) {
  // Подсчет страниц
  const pageCount = Math.ceil(searchResultCount / limit);
  const pageCurrent = page > pageCount ? pageCount : page;

  return {
    pager: {
      pageCurrent,
      pageCount,
      limit,
      itemsCount: searchResultCount,
      isFirst: page === 1,
      isLast: page >= pageCount,
    },
    items: searchResult,
  };
}
