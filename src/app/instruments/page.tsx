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
    <main>
      <h1>African Musical Instruments</h1>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>
            {/* WRAP THE CONTENT IN A LINK */}
            <Link href={`/instruments/${instrument.slug}`}>
              <strong>{instrument.name}</strong> 
              {instrument.primary_ethnic_group && typeof instrument.primary_ethnic_group === 'object' 
                ? ` - (${instrument.primary_ethnic_group.name})` 
                : ''}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}