import Link from 'next/link';

async function getInstrumentBySlug(slug) {
  const response = await fetch(`http://localhost:3000/api/musical-instruments?where[slug][equals]=${slug}&depth=1`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch instrument');
  }

  const data = await response.json();
  // The API returns an array, we just want the first item
  return data.docs[0]; 
}

// The params object will contain the slug from the URL
export default async function InstrumentDetailPage({ params }) {
  const instrument = await getInstrumentBySlug(params.slug);

  if (!instrument) {
    return <div>Instrument not found!</div>;
  }

  return (
    <main>
      <Link href="/instruments">← Back to List</Link>
      <h1>{instrument.name}</h1>
      <p><em>{instrument.description_short}</em></p>
      
      <h2>Details</h2>
      <ul>
        <li><strong>Primary Classification:</strong> {instrument.classification_primary}</li>
        {instrument.primary_ethnic_group && typeof instrument.primary_ethnic_group === 'object' &&
          <li><strong>Primary Ethnic Group:</strong> {instrument.primary_ethnic_group.name}</li>
        }
      </ul>

      {/* The richText field needs special handling later to render HTML */}
      <h2>Description</h2>
      <pre>{JSON.stringify(instrument.description_long, null, 2)}</pre>
    </main>
  );
}