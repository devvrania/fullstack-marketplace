export type PageResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type PageQueryInput = {
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
};

export function normalizePage(q: PageQueryInput) {
  const pageNum = typeof q.page === 'number' ? q.page : Number(q.page);
  const sizeNum = typeof q.pageSize === 'number' ? q.pageSize : Number(q.pageSize);

  const page = Number.isFinite(pageNum) && pageNum > 0 ? Math.floor(pageNum) : 1;
  const rawSize = Number.isFinite(sizeNum) && sizeNum > 0 ? Math.floor(sizeNum) : 20;

  const pageSize = Math.max(1, Math.min(50, rawSize));
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
}
