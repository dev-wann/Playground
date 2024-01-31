import Link from 'next/link';
import itemList from './itemList.json';

export default function Home() {
  return (
    <main className='flex flex-wrap items-center p-12'>
      {itemList.map((item) => (
        <div
          className='w-1/3 h-32 flex justify-center items-center p-2'
          key={item.title}
        >
          <Link
            className='w-full h-full border-solid border-2 border-gray-400'
            href={item.href}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </main>
  );
}
