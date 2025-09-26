import { AppDataSource } from "../db/data-source";
import { Case } from "../entities/case.entity";
import { CaseFile } from "../entities/caseFile.entity";

export const caseFilesService = {
    async create(caseId: string, input: { filename: string; originalName: string; mimeType: string; size: number }) {
        const repo = AppDataSource.getRepository(CaseFile);

        const file = repo.create({
            caseId,
            filename: input.filename,
            originalName: input.originalName,
            mimeType: input.mimeType,
            size: input.size,
        });

        return await repo.save(file);
    },

    async listByCase(caseId: string) {
        const repo = AppDataSource.getRepository(CaseFile);
        return await repo.find({
            where: { caseId },
            order: { createdAt: 'DESC' },
        });
    },

    async listByCaseForLawyer(lawyerId: string, caseId: string) {
    const caseRepo = AppDataSource.getRepository(Case);
    const kase = await caseRepo.findOne({
      where: { id: caseId },
      relations: ['client'], // optional: for extra validation
    });

    if (!kase) throw Object.assign(new Error('Case not found'), { status: 404 });

    if (kase.status !== 'engaged') {
      throw Object.assign(new Error('Case not engaged'), { status: 403 });
    }

    // In real-world: also check lawyerId matches assigned lawyer for this case
    const repo = AppDataSource.getRepository(CaseFile);
    return await repo.find({
      where: { caseId },
      order: { createdAt: 'DESC' },
    });
  },
};
