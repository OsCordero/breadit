import Link from "next/link"

import { Icons } from "./Icon"

const Navbar = async () => {
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="mx-w-7xl container mx-auto flex h-full items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Breadit
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
