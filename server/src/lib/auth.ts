import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../exports/prisma.js";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
    plugins: [expo()],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
    },

    trustedOrigins: [
        "munshi://",

            ...(process.env["NODE_ENV"] === "development" ? [
            "exp://",                      // Trust all Expo URLs (prefix matching)
            "exp://**",                    // Trust all Expo URLs (wildcard matching)
            "exp://192.168.*.*:*/**",      // Trust 192.168.x.x IP range with any port and path
        ] : [])
    ]
});