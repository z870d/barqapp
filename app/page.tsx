"use client"

import * as React from "react"
import Image from "next/image"
import {
  EyeIcon,
  EyeOffIcon,
  LanguagesIcon,
  User2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction, type LoginState } from "@/actions/login"

const initialState: LoginState = { error: "" }

export default function Home() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [state, formAction, pending] = React.useActionState<
    LoginState,
    FormData
  >(loginAction, initialState)

  return (
    <main className="min-h-screen bg-[#d7d8da]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        <section className="flex flex-col bg-[#cfe2e3] px-6 pb-10 pt-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between text-sm font-semibold text-[#1d1d1f]">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 transition hover:bg-white/50"
            >
              العربية
              <LanguagesIcon className="size-4" />
            </button>
<div className="flex h-12 w-12 items-center justify-center overflow-hidden">
  <Image
    src="/barq-icon-black.png"
    alt="Barq Logo"
    width={32}
    height={32}
    className="object-contain"
    priority
  />
</div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-8 pt-6">

            <div className="w-full max-w-md rounded-[32px] bg-white/90 px-10 py-8 text-center shadow-[0px_35px_90px_rgba(15,15,15,0.08)]">
              <p className="text-xl font-semibold text-[#111]">Title</p>
              <p className="mt-3 text-sm text-[#5f6266]">
                Onboarding text description about the available services.
              </p>
              <div className="mt-8 flex items-center justify-center gap-2">
                <span className="h-2 w-8 rounded-full bg-[#1d1d1f]" />
                <span className="h-2 w-2 rounded-full bg-[#c8c9cb]" />
                <span className="h-2 w-2 rounded-full bg-[#c8c9cb]" />
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center bg-white px-4 py-10 sm:px-8">
          <div className="w-full max-w-[420px] rounded-[36px] bg-white px-6 py-10 shadow-[0px_35px_90px_rgba(17,17,17,0.12)] sm:px-10">
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-[#0f0f0f]">Welcome</p>
              <p className="text-sm text-[#6c6c6f]">
                Please enter username and password registered with us
              </p>
            </div>
            <form className="mt-8 space-y-6" action={formAction}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm text-[#111]">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter username"
                    className="h-12 rounded-2xl border-[#ededf0] bg-[#f9f9fb]"
                  />
                  <User2Icon className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-muted-foreground sm:block" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-[#111]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="h-12 rounded-2xl border-[#ededf0] bg-[#f9f9fb] pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl text-muted-foreground hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="font-semibold text-[#4b4c4d] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

<Button
  type="submit"
  disabled={pending}
  className="h-12 w-full rounded-2xl bg-black text-base font-semibold text-white hover:bg-black/90 disabled:opacity-60"
>
  {pending ? "Signing in..." : "Login"}
</Button>
              {state?.error ? (
                <p className="text-sm font-semibold text-red-500">{state.error}</p>
              ) : null}
              <p className="text-center text-xs text-[#6c6c6f]">
                By clicking continue you agree to our{" "}
                <span className="font-semibold text-black">Terms of Service</span>{" "}
                and{" "}
                <span className="font-semibold text-black">Privacy Policy</span>.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
