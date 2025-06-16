// src/app/geographies/page.tsx
import Link from 'next/link';

async function getGeographies() {
  const response = await fetch('http://localhost:3000/api/geographies?limit=200', {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch geographies');
  const data = await response.json();
  return data.docs;
}

export default async function GeographiesPage() {
  const geographies = await getGeographies();

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Geographies of Africa</h1>
      <ul className="space-y-2">
        {geographies.map((geo) => (
          <li key={geo.id}>
            <Link href={`/geographies/${geo.slug}`} className="text-xl text-blue-400 hover:underline">
              <strong>{geo.name}</strong>
              <span className="text-gray-400 text-lg"> - ({geo.type})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}