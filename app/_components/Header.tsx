'use client';

import itemList from '@/app/_res/itemList.json';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const title =
    itemList.filter((item) => item.href === pathname).at(0)?.title ||
    'Playground';

  return (
    <h1 className="text-4xl font-bold text-center p-4 mt-4">
      {title}
      <Link
        href={
          pathname === '/'
            ? 'https://github.com/dev-wann/Playground'
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
          className="inline-block mb-2 invert-[50%] hover:invert-0 transition"
        />
      </Link>
      <Link href="/" className="ml-2">
        <Image
          src="/images/home.svg"
          width={36}
          height={36}
          alt="link to home"
          className="inline-block mb-2 invert-[50%] hover:invert transition"
        />
      </Link>
    </h1>
  );
}
