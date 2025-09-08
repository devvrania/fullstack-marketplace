import { z } from 'zod';

export const Email = z.string().email();
export const Password = z.string().min(8, 'Password must be at least 8 characters');
export const Name = z.string().min(1).max(255).optional();
export const Jurisdiction = z.string().max(255).optional();
export const BarNumber = z.string().max(255).optional();

export const CreateUserBaseSchema = z.object({
  email: Email,
  password: Password,
  name: Name,
});

export const SignupClientSchema = CreateUserBaseSchema;

export const SignupLawyerSchema = CreateUserBaseSchema.extend({
  jurisdiction: Jurisdiction,
  barNumber: BarNumber,
});

export const LoginSchema = z.object({
  email: Email,
  password: Password,
});

export type SignupClientInput = z.infer<typeof SignupClientSchema>;
export type SignupLawyerInput = z.infer<typeof SignupLawyerSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export type CreateUserParams =
  | (SignupClientInput & { role: 'client' })
  | (SignupLawyerInput & { role: 'lawyer' });
