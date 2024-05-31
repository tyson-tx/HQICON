"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import './globals.css';

interface Icon {
  name: string;
  path: string;
}

function IconSearch() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [country, setCountry] = useState('us');
  const [entity, setEntity] = useState('software');
  const [limit, setLimit] = useState('10');
  const [cut, setCut] = useState('1');
  const [resolution, setResolution] = useState('512');
  const [format, setFormat] = useState('png');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('name');
    const country = searchParams.get('country') || 'us';
    const entity = searchParams.get('entity') || 'software';
    const limit = searchParams.get('limit') || '10';
    const cut = searchParams.get('cut') || '1';
    const resolution = searchParams.get('resolution') || '512';
    const format = searchParams.get('format') || 'png';
    if (name) {
      const fetchIcons = async () => {
        try {
          const response = await fetch(`/api/icons?name=${encodeURIComponent(name)}&country=${country}&entity=${entity}&limit=${limit}&cut=${cut}&resolution=${resolution}&format=${format}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setIcons(data);
          } else {
            setIcons([]);
          }
        } catch (error) {
          console.error('Failed to load icons:', error);
          setIcons([]);
        }
      };
      fetchIcons();
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchInput) {
      router.push(`/?name=${encodeURIComponent(searchInput)}&country=${country}&entity=${entity}&limit=${limit}&cut=${cut}&resolution=${resolution}&format=${format}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl mb-8 flex items-center">
        <input
          type="text"
          placeholder="Search by App name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={handleSearch}
          className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 focus:outline-none"
        >
          Search
        </button>
      </div>
      <div className="w-full max-w-2xl mb-8 flex flex-wrap gap-4 justify-center">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-white text-black px-4 py-2 rounded-lg shadow focus:outline-none"
        >
          <option value="us">US/美</option>
          <option value="cn">China/中</option>
          <option value="jp">Japan/日</option>
          <option value="kr">Korea/韩</option>
        </select>
        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          className="bg-white text-black px-4 py-2 rounded-lg shadow focus:outline-none"
        >
          <option value="software">iOS</option>
          <option value="macSoftware">macOS</option>
        </select>
        <select
          value={cut}
          onChange={(e) => setCut(e.target.value)}
          className="bg-white text-black px-4 py-2 rounded-lg shadow focus:outline-none"
        >
          <option value="1">裁切圆角</option>
          <option value="0">原始图像</option>
        </select>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="bg-white text-black px-4 py-2 rounded-lg shadow focus:outline-none"
        >
          <option value="256">256px</option>
          <option value="512">512px</option>
          <option value="1024">1024px</option>
        </select>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-white text-black px-4 py-2 rounded-lg shadow focus:outline-none"
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {icons.map((icon, index) => (
          <a
            key={index}
            href={icon.path}
            download={`${icon.name}.${format}`}
            className="flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg transform transition-transform hover:scale-110"
          >
            <Image src={icon.path} alt={icon.name} width={100} height={100} className="mb-2 rounded-lg border-2 border-white" />
            <p className="text-white">{icon.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col items-center">
      <div className="mt-20 w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-2">HQ ICON</h1>
        <h2 className="text-2xl font-semibold text-white text-opacity-75 mb-8">
          Get high-definition app icons from the App Store
        </h2>
        <Suspense fallback={<div>Loading...</div>}>
          <IconSearch />
        </Suspense>
      </div>
    </div>
  );
}
