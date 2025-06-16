// src/app/ethnic-groups/[slug]/page.tsx
import Link from 'next/link';

// Helper function to render lists of instruments
const renderInstrumentList = (instruments) => {
  if (!instruments || !instruments.docs || instruments.docs.length === 0) {
    return <p className="text-gray-500">None listed.</p>;
  }
  return (
    <ul className="list-disc list-inside space-y-1">
      {instruments.docs.map(instrument => (
        <li key={instrument.id}>
          <Link href={`/instruments/${instrument.slug}`} className="text-blue-400 hover:underline">
            {instrument.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

async function getEthnicGroupBySlug(slug: string) {
  const response = await fetch(`http://localhost:3000/api/ethnic-groups?where[slug][equals]=${slug}&depth=1`, {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch ethnic group');
  const data = await response.json();
  return data.docs[0];
}

export default async function EthnicGroupDetailPage({ params }: { params: { slug: string } }) {
  const group = await getEthnicGroupBySlug(params.slug);

  if (!group) {
    return <main className="p-8 text-white"><h1>Ethnic Group not found!</h1></main>;
  }

  return (
    <main className="p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link href="/ethnic-groups" className="text-blue-400 hover:underline mb-8 inline-block">
          ← Back to All Ethnic Groups
        </Link>
        
        <h1 className="text-5xl font-extrabold text-white">{group.name}</h1>
        <p className="text-xl italic text-gray-400 mt-2">{group.description_short}</p>

        <div className="mt-12 space-y-12">
          {/* Geographic Distribution */}
          <div>
            <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Geographic Distribution</h2>
            {group.geographies && group.geographies.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {group.geographies.map(geo => (
                  <li key={geo.id}>
                    <Link href={`/geographies/${geo.slug}`} className="text-blue-400 hover:underline">{geo.name}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Geographic distribution not specified.</p>
            )}
          </div>

          {/* Instruments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                  <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Primary Instruments</h2>
                  {renderInstrumentList(group.primary_instruments)}
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Associated Instruments</h2>
                  {renderInstrumentList(group.associated_instruments)}
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}