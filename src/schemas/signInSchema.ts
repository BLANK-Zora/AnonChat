import {z} from 'zod';

export const signInSchema = z.object({
    email: z.string().min(3, { message: 'email must be at least 3 characters long' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})