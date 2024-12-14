"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import itemList from "@/app/_res/itemList.json";

export default function Header() {
  const pathname = usePathname();
  const title =
    itemList.filter((item) => item.href === pathname).at(0)?.title ||
    "Playground";

  return (
    <h1 className="mt-4 p-4 text-center text-4xl font-bold">
      {title}
      <Link
        href={
          pathname === "/"
            ? "https://github.com/dev-wann/Playground"
            : `https://github.com/dev-wann/Playground/tree/master/app/${pathname}`
        }
        target="_blank"
        prefetch={false}
        className="ml-4"
      >
        <Image
          src="/images/github.svg"
          width={36}
          height={36}
          alt="link to github"
          className="mb-2 inline-block invert-[50%] transition hover:invert-0"
        />
      </Link>
      <Link href="/" className="ml-2">
        <Image
          src="/images/home.svg"
          width={36}
          height={36}
          alt="link to home"
          className="mb-2 inline-block invert-[50%] transition hover:invert"
        />
      </Link>
    </h1>
  );
}
