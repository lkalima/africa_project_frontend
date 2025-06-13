// src/app/instruments/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ClientRichText } from '@/components/RichText/ClientRichText';
import { serializeLexical } from '@/components/RichText/serialize'; // <-- 1. IMPORT THE SERIALIZER


// This function runs ONLY on the server
async function getInstrumentBySlug(slug: string) {
  const response = await fetch(`http://localhost:3000/api/musical-instruments?where[slug][equals]=${slug}&depth=2`, {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch instrument');
  const data = await response.json();
  return data.docs[0];
}

// This is a Server Component. It fetches data and then renders other components.
export default async function InstrumentDetailPage({ params }: { params: { slug: string } }) {
  const instrument = await getInstrumentBySlug(params.slug);


  if (!instrument) {
    return (
      <main className="p-8 text-white">
        <h1 className="text-4xl">Instrument not found!</h1>
        <Link href="/instruments" className="text-blue-400 hover:underline">← Back to List</Link>
      </main>
    );
  }

  // --- 2. PRE-PROCESS THE DATA ON THE SERVER ---
  const serializedDescription = instrument.description_long ? serializeLexical(instrument.description_long.root.children) : null;

  // Helper to render a list of linked items
  const renderLinkList = (items, basePath) => (
    <ul className="list-disc list-inside">
      {items?.map(item => (
        <li key={item.id}>
          <Link href={`/${basePath}/${item.slug}`} className="text-blue-400 hover:underline">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    // --- START OF FIX: WRAP EVERYTHING IN A SINGLE PARENT ELEMENT ---
    <main className="p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link href="/instruments" className="text-blue-400 hover:underline mb-8 inline-block">
          ← Back to All Instruments
        </Link>

        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          <div>
            {instrument.primary_image && typeof instrument.primary_image === 'object' && (
              <Image
                src={instrument.primary_image.url}
                alt={instrument.name}
                width={instrument.primary_image.width}
                height={instrument.primary_image.height}
                className="rounded-lg shadow-lg w-full"
              />
            )}
            {instrument.audio_sample && typeof instrument.audio_sample === 'object' && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Listen:</p>
                <audio controls className="w-full">
                  <source src={instrument.audio_sample.url} type={instrument.audio_sample.mimeType} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-white">{instrument.name}</h1>
            <p className="text-xl italic text-gray-400 mt-2">{instrument.description_short}</p>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-2">
              <h2 className="text-2xl font-bold mb-4 text-white">Details</h2>
              <div><strong>Sound Source:</strong> {instrument.sound_source}</div>
              <div><strong>Playing Technique:</strong> {instrument.playing_technique}</div>
              {instrument.resonator_type && <div><strong>Resonator Type:</strong> {instrument.resonator_type}</div>}
              {instrument.primary_ethnic_group && typeof instrument.primary_ethnic_group === 'object' &&
                <div>
                  <strong>Primary Ethnic Group:</strong>
                  <Link href={`/ethnic-groups/${instrument.primary_ethnic_group.slug}`} className="ml-2 text-blue-400 hover:underline">
                    {instrument.primary_ethnic_group.name}
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT & RELATIONS --- */}
        {/* I've wrapped this section in a grid to properly lay out the description and sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2">Description</h2>
              {/* --- 3. PASS THE "SAFE" SERIALIZED DATA TO THE CLIENT COMPONENT --- */}
              {serializedDescription ? (
                <ClientRichText nodes={serializedDescription} />
              ) : (
                <p className="text-gray-500">No detailed description available.</p>
              )}
            </div>
          </div>

          {/* Related Info Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-3">Related To</h3>
              {renderLinkList(instrument.associated_ethnic_groups, 'ethnic-groups')}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-3">Geographic Origins</h3>
              {renderLinkList(instrument.geography_origin, 'geographies')}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-3">Historical Context</h3>
              {renderLinkList(instrument.historical_context, 'historical-periods')}
            </div>
          </div>
        </div>
      </div>
    </main>
    // --- END OF FIX: EVERYTHING IS NOW INSIDE THE <main> TAG ---
  );
}