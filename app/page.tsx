import Image from 'next/image';
import Link from 'next/link';
import LinkButton from './_components/LinkButton';
import itemList from './_res/itemList.json';

export default function Home() {
  return (
    <main className="p-10 pt-0 max-w-[1200px] m-auto">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-x-4">
        {/* description */}
        <div>
          <h1 className="pt-4 pb-2 text-2xl font-bold">About</h1>
          <p className="px-2 pb-2 text-lg indent-8 leading-tight">
            Hi, I'm Seungwan Cho, a front-end developer, and this is my personal
            archive site. I'm collecting interesting web UIs that I've made or
            seen somewhere before. Most of them are built with React and
            TypeScript, and you can get the source code on my GitHub.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col">
          <h1 className="pt-4 pb-2 text-2xl font-bold">Links</h1>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 content-evenly gap-x-2 gap-y-1 px-2 pb-2 grow">
            <LinkButton
              name="GitHub"
              href="https://github.com/dev-wann/Playground"
              imgSrc="/images/github.svg"
            />
            <LinkButton
              name="LinkedIn"
              href="https://www.linkedin.com/in/seung-wan-cho-bb9175212/"
              imgSrc="/images/linked-in.svg"
            />
            <LinkButton
              name="Email"
              href="mailto:swcho8220@gmail.com"
              imgSrc="/images/email.svg"
            />
            <LinkButton
              name="Portfolio"
              href="https://github.com/dev-wann/Playground"
              imgSrc="/images/me.jpg"
            />
          </div>
        </div>
      </div>

      {/* <hr className="mx-2 my-4 border-gray-500" /> */}

      {/* item list */}
      <h1 className="pt-4 pb-2 text-2xl font-bold">Items</h1>
      <div className="flex flex-wrap items-center">
        {itemList.map((item) => (
          <div
            className="xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full flex justify-center items-center p-2"
            key={item.title}
          >
            {/* item button */}
            <Link
              className="w-full h-fit border-solid border-2 border-gray-400 p-1 rounded-lg group hover:border-white transition"
              href={item.href}
            >
              {/* title */}
              <p className="text-xl text-center font-bold p-1">{item.title}</p>

              {/*
              images
              first child: static placeholder
              second child: gif that plays when hover
            */}
              <div className="relative w-fit h-[12rem] mx-auto mb-2">
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
      </div>
    </main>
  );
}
