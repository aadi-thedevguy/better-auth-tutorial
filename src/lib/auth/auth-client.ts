import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import {
  inferAdditionalFields,
  twoFactorClient,
  adminClient,
  organizationClient,
  lastLoginMethodClient,
  usernameClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { ac, admin, user } from "@/components/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    lastLoginMethodClient(),
    usernameClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }),
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    organizationClient(),
  ],
});
