import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, { error: 'required' })
  .email({ error: 'invalidEmail' });

const password = z
  .string()
  .min(8, { error: 'passwordMinLength' });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: 'required' }),
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, { error: 'required' }),
    email,
    password,
    confirmPassword: z.string().min(1, { error: 'required' }),
  })
  .superRefine(({ password: value, confirmPassword }, context) => {
    if (value !== confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'passwordMismatch',
        path: ['confirmPassword'],
      });
    }
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, { error: 'required' }),
  })
  .superRefine(({ password: value, confirmPassword }, context) => {
    if (value !== confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'passwordMismatch',
        path: ['confirmPassword'],
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
