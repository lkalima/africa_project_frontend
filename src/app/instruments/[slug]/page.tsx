// src/app/instruments/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { serialize } from '@/components/RichText/serialize'; // Our trusted serializer
import { PayloadImage } from '@/components/PayloadImage'; // <-- 1. IMPORT THE NEW COMPONENT

// This server-side function fetches the data for a single instrument
async function getInstrumentBySlug(slug: string) {
  const response = await fetch(`http://localhost:3000/api/musical-instruments?where[slug][equals]=${slug}&depth=2`, {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch instrument');
  const data = await response.json();
  return data.docs[0]; 
}

// The main page component
export default async function InstrumentDetailPage({ params }: { params: { slug: string } }) {
  const instrument = await getInstrumentBySlug(params.slug);

  if (!instrument) {
    return (
      <main className="p-8 text-white text-center">
        <h1 className="text-4xl font-bold">Instrument Not Found</h1>
        <Link href="/instruments" className="mt-4 inline-block text-blue-400 hover:underline">
          ← Back to All Instruments
        </Link>
      </main>
    );
  }

  // A reusable helper component to render lists of links cleanly
  const renderLinkList = (items: { id: string; slug: string; name: string }[], basePath: string) => {
    if (!items || items.length === 0) {
      return <p className="text-gray-500 text-sm">None listed.</p>;
    }
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map(item => (
          <li key={item.id}>
            <Link href={`/${basePath}/${item.slug}`} className="text-blue-400 hover:underline">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link href="/instruments" className="text-blue-400 hover:underline mb-8 inline-block">
          ← Back to All Instruments
        </Link>

        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          {/* Left Column: Media */}
          <div>
            {instrument.primary_image && typeof instrument.primary_image === 'object' && (
                <PayloadImage
                  src={instrument.primary_image.url} // Pass the relative URL
                  alt={instrument.name}
                  width={instrument.primary_image.width}
                  height={instrument.primary_image.height}
                  className="rounded-lg shadow-lg w-full object-cover aspect-square"
                  priority
                />
              )}
            {instrument.audio_sample && typeof instrument.audio_sample === 'object' && (
              <div className="mt-4">
                <p className="font-semibold mb-2 text-white">Listen:</p>     
                <audio controls className="w-full">
                  <source src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${instrument.audio_sample.url}`} type={instrument.audio_sample.mimeType} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          {/* ... Right Column: Title and Details Box ... */}
          <div>
            <h1 className="text-5xl font-extrabold text-white">{instrument.name}</h1>
            <p className="text-xl italic text-gray-400 mt-2">{instrument.description_short}</p>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
              <h2 className="text-2xl font-bold mb-3 text-white">Details</h2>
              <div><strong>Sound Source:</strong> {instrument.sound_source || 'N/A'}</div>
              <div><strong>Playing Technique:</strong> {instrument.playing_technique || 'N/A'}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
          {/* Main Description Column */}
          <div className="md:col-span-2">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Description</h2>
              {instrument.description_long ? (
                <div>{serialize(instrument.description_long.root.children)}</div>
              ) : (
                <p className="text-gray-500">No detailed description available.</p>
              )}
            </div>
            {/* --- ADD THE SOURCES SECTION --- */}
            <div className="prose prose-invert max-w-none mt-12">
              <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Sources</h2>
              {instrument.sources?.root?.children ? (
                // We use the same 'serialize' function that we use for the main description
                <div>{serialize(instrument.sources.root.children)}</div>
              ) : (
                <p className="text-gray-500">No sources listed for this entry.</p>
              )}
            </div>
            {/* ----------------------------- */}
          </div>

          {/* Related Info Sidebar */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-3">Associated Ethnic Groups</h3>
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
            {/* --- ADD THE VIDEO LINKS SECTION --- */}
            {instrument.video_links && instrument.video_links.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-3">Performances</h3>
                <div className="space-y-4">
                  {instrument.video_links.map((video: { url: string; description?: string }, index: number) => (
                    <div key={index}>
                      {/* We can make this an embedded player later */}
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {video.description || video.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ------------------------------------- */}
          </div>
        </div>
      </div>
    </main>
  );
}