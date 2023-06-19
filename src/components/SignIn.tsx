import Link from "next/link";

import { Icons } from "./Icon";
import UserAuthForm from "./UserAuthForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy.
        </p>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-zinc-500 dark:text-slate-50">
          New to Breadit?{" "}
          <Link
            href="/sign-up"
            className="hover:text-zinc-950 underline-offset-4 underline text-sm dark:hover:text-slate-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignIn;
