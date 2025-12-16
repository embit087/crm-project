import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: "./db.sqlite",
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
});

