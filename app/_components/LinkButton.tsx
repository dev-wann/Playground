import Image from 'next/image';
import Link from 'next/link';

type Props = {
  name: string;
  href: string;
  imgSrc: string;
};

export default function LinkButton({ name, href, imgSrc }: Props) {
  return (
    <button className="min-w-36 px-2 py-1 border-solid border-2 border-gray-400 hover:border-white transition rounded-lg">
      <Link
        className="flex justify-left items-center gap-2 "
        href={href}
        prefetch={false}
        target="_blank"
      >
        <Image
          src={imgSrc}
          width={28}
          height={28}
          alt={name}
          className="rounded-full"
        />
        <p className="grow">{name}</p>
      </Link>
    </button>
  );
}
