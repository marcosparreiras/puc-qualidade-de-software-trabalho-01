import z from "zod";

const envSchema = z.object({
  DB_CONNECTION_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
