// lib/schemas.ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  birthday: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format (YYYY-MM-DD expected)' }),
  height: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().positive('Height must be a positive number').optional()),
  weight: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().positive('Weight must be a positive number').optional()),
  sex: z.enum(['male', 'female'], { invalid_type_error: 'Invalid gender value' }),
});
