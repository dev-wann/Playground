import Image from 'next/image';
import Link from 'next/link';
import itemList from './itemList.json';

export default function Home() {
  return (
    <main className="flex flex-wrap items-center p-12 max-w-[1200px] m-auto">
      {itemList.map((item) => (
        // wrapper
        <div
          className="xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full flex justify-center items-center p-2"
          key={item.title}
        >
          {/* item button */}
          <Link
            className="w-full h-fit border-solid border-2 border-gray-400 p-1 rounded-lg group"
            href={item.href}
          >
            {/* title */}
            <p className="text-xl text-center font-bold p-1">{item.title}</p>

            {/*
              images
              first child: static placeholder
              second child: gif that plays when hover
            */}
            <div className="relative h-[12rem] m-2 left-1/2 translate-x-[-50%]">
              <Image
                src={`/images${item.href}/thumbnail.jpg`}
                width={500}
                height={300}
                style={{ objectFit: 'contain', height: '100%' }}
                alt="item thumbnail"
              />
              <Image
                src={`/images${item.href}/thumbnail.gif`}
                width={500}
                height={300}
                style={{ objectFit: 'contain', height: '100%' }}
                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                alt="item thumbnail"
              />
            </div>
          </Link>
        </div>
      ))}
    </main>
  );
}
