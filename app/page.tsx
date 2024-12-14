import Image from "next/image";
import Link from "next/link";
import LinkButton from "./_components/LinkButton";
import itemList from "./_res/itemList.json";

export default function Home() {
  return (
    <main className="m-auto max-w-[1200px] p-10 pt-0">
      <div className="grid gap-x-4 md:grid-cols-1 lg:grid-cols-2">
        {/* description */}
        <div>
          <h1 className="pb-2 pt-4 text-2xl font-bold">About</h1>
          <p className="px-2 pb-2 indent-8 text-lg leading-tight">
            Hi, I&apos;m Seungwan Cho, a front-end developer, and this is my
            personal archive site. I&apos;m collecting interesting web UIs that
            I&apos;ve made or seen somewhere before. Most of them are built with
            React and TypeScript, and you can get the source code on my GitHub.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col">
          <h1 className="pb-2 pt-4 text-2xl font-bold">Links</h1>
          <div className="grid grow content-evenly gap-x-2 gap-y-1 px-2 pb-2 sm:grid-cols-1 md:grid-cols-2">
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
      <h1 className="pb-2 pt-4 text-2xl font-bold">Items</h1>
      <div className="flex flex-wrap items-center">
        {itemList.map((item) => (
          <div
            className="flex items-center justify-center p-2 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            key={item.title}
          >
            {/* item button */}
            <Link
              className="group h-fit w-full rounded-lg border-2 border-solid border-gray-400 p-1 transition hover:border-white"
              href={item.href}
            >
              {/* title */}
              <p className="p-1 text-center text-xl font-bold">{item.title}</p>

              {/*
              images
              first child: static placeholder
              second child: gif that plays when hover
            */}
              <div className="relative mx-auto mb-2 h-48 w-fit">
                <Image
                  src={`/images${item.href}/thumbnail.jpg`}
                  width={500}
                  height={300}
                  style={{ objectFit: "contain", height: "100%" }}
                  alt="item thumbnail"
                />
                <Image
                  src={`/images${item.href}/thumbnail.gif`}
                  width={500}
                  height={300}
                  style={{ objectFit: "contain", height: "100%" }}
                  className="absolute left-0 top-0 opacity-0 group-hover:opacity-100"
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
