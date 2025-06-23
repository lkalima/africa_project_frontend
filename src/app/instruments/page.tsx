// Page: src/app/instruments/page.tsx
import Link from 'next/link'; // <-- IMPORT LINK


// This function fetches data from our Payload API
async function getInstruments() {
  // We use depth=1 to populate the primary_ethnic_group relationship
  const response = await fetch('http://localhost:3000/api/musical-instruments?depth=1&limit=100', {
    // This ensures data is freshly fetched every time in development
    cache: 'no-store' 
  });

  if (!response.ok) {
    throw new Error('Failed to fetch instruments');
  }

  const data = await response.json();
  return data.docs; // In Payload, the array of documents is in the 'docs' property
}

// This is our main page component

export default async function InstrumentsPage() {
  const instruments = await getInstruments();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">African Musical Instruments</h1>
        <div className="flex space-x-4">
          <a 
            href="http://localhost:3000/api/musical-instruments/export/json"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            download // The 'download' attribute is helpful but the backend headers handle it
          >
            Download (JSON)
          </a>
          <a 
            href="http://localhost:3000/api/musical-instruments/export/csv"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            download
          >
            Download (CSV)
          </a>
        </div>
      </div>
      <ul className="space-y-2">
        {instruments.map((instrument) => (
          <li key={instrument.id}>
            {/* The Link component now contains the text we want to display */}
            <Link href={`/instruments/${instrument.slug}`} className="text-xl text-blue-400 hover:underline">
              <strong>{instrument.name}</strong> 
              {instrument.primary_ethnic_group && typeof instrument.primary_ethnic_group === 'object' 
                ? <span className="text-gray-400 text-lg"> - ({instrument.primary_ethnic_group.name})</span>
                : ''}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}