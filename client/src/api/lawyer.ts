import api from "./axios";

export const getMarketplaceCases = () =>
  api.get("/lawyer/marketplace", { withCredentials: true });

export const submitQuote = (data: { caseId: string; amount: number; expectedDays: number; note: string }) =>
  api.post("/lawyer/quotes", data, { withCredentials: true });
