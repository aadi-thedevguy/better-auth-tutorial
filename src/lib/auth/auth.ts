import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/welcome-email";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "@better-auth/passkey";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { ac, admin, user } from "@/components/auth/permissions";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
import { prisma } from "../prisma";
import { haveIBeenPwned, lastLoginMethod, username } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Better Auth Demo",
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
    },
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          username: profile.data.username,
          image: profile.data.profile_image_url,
          favoriteNumber: Math.floor(Math.random() * 100),
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          username: profile.name,
          image: profile.picture,
          favoriteNumber: Math.floor(Math.random() * 100),
        };
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    username(),
    haveIBeenPwned(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    organization({
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        });
      },
    }),
  ],

  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };

        if (user != null) {
          await sendWelcomeEmail(user);
        }
      }
    }),
  },
  databaseHooks: {
    session: {
      create: {
        before: async (userSession) => {
          const membership = await prisma.member.findFirst({
            where: {
              userId: userSession.userId,
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              organizationId: true,
            },
          });

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          };
        },
      },
    },
  },
});
