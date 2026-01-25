import { XIcon } from "lucide-react"
import { ComponentProps, ElementType } from "react"

export const SUPPORTED_OAUTH_PROVIDERS = ["twitter"] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  twitter: { name: "Twitter", Icon: XIcon },
}
