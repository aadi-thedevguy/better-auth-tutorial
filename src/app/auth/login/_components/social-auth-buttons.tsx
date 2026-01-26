"use client";

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/auth/o-auth-providers";
import { Badge } from "@/components/ui/badge";

export function SocialAuthButtons({
  lastLoginMethod,
}: {
  lastLoginMethod?: string;
}) {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <BetterAuthActionButton
        variant="outline"
        className="relative"
        key={provider}
        action={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: "/",
          });
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
        {lastLoginMethod === provider && (
          <Badge className="ml-2 absolute -top-3.5 right-0">Last used</Badge>
        )}
      </BetterAuthActionButton>
    );
  });
}
