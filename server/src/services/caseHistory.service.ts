import { AppDataSource } from "../db/data-source";
import { CaseHistory } from "../entities/caseHistory.entity";

export const caseHistoryService = {
  async log(caseId: string, action: string, actorId: string, note?: string) {
    const repo = AppDataSource.getRepository(CaseHistory);
    const history = repo.create({ caseId, action, actorId, note: note ?? "" });
    return await repo.save(history);
  },

  async listByCase(caseId: string) {
    const repo = AppDataSource.getRepository(CaseHistory);
    return await repo.find({
      where: { caseId },
      order: { createdAt: "ASC" },
    });
  },
};
