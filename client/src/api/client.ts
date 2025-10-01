import api from "./axios";

export const createCase = (data: { title: string; description: string, category: string }) =>
  api.post("/client/cases", data, { withCredentials: true });

export const getMyCases = () =>
  api.get("/client/cases", { withCredentials: true });

export const uploadCaseFile = (caseId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/client/cases/${caseId}/files`, formData, { withCredentials: true });
};
