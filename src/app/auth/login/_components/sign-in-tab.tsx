"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasskeyButton } from "./passkey-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const signInSchema = z.object({
  password: z.string().min(6),
  email: z.email().optional(),
  username: z.string().optional(),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab({
  openEmailVerificationTab,
  openForgotPassword,
  lastLoginMethod,
}: {
  openEmailVerificationTab: (email: string) => void;
  openForgotPassword: () => void;
  lastLoginMethod?: string;
}) {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      // email: "",
      // username: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSignIn(data: SignInForm) {
    if (data.username) {
      return await authClient.signIn.username(
        {
          username: data.username,
          password: data.password,
          callbackURL: "/",
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign in");
          },
          onSuccess: () => {
            router.push("/");
          },
        },
      );
    }

    if (data.email) {
      return await authClient.signIn.email(
        { email: data.email, password: data.password, callbackURL: "/" },
        {
          onError: (error) => {
            if (error.error.code === "EMAIL_NOT_VERIFIED") {
              openEmailVerificationTab(data?.email as string);
            }
            toast.error(error.error.message || "Failed to sign in");
          },
          onSuccess: () => {
            router.push("/");
          },
        },
      );
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" autoComplete="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h5 className="font-semibold text-center text-xl">OR</h5>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Button
                    onClick={openForgotPassword}
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-sm font-normal underline"
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between gap-6 pt-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative"
            >
              <LoadingSwap isLoading={isSubmitting}>
                Sign In
                {lastLoginMethod === "email" ||
                  (lastLoginMethod === "username" && (
                    <Badge
                      variant="secondary"
                      className="ml-2 absolute -top-3.5 right-0"
                    >
                      Last used
                    </Badge>
                  ))}
              </LoadingSwap>
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex flex-col gap-5">
        <PasskeyButton />
      </div>
    </div>
  );
}
