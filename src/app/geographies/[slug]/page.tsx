// src/app/geographies/[slug]/page.tsx
import Link from 'next/link';
import React from 'react';

// Helper function to render lists of linked items
const renderLinkList = (items: any[] | undefined, basePath: string) => {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">None listed.</p>;
  }
  // Create a Set to store unique IDs to prevent duplicates in the list
  const uniqueIds = new Set();
  const uniqueItems = items.filter(item => {
    if (!uniqueIds.has(item.id)) {
      uniqueIds.add(item.id);
      return true;
    }
    return false;
  });

  return (
    <ul className="list-disc list-inside space-y-1">
      {uniqueItems.map(item => (
        <li key={item.id}>
          <Link href={`/${basePath}/${item.slug}`} className="text-blue-400 hover:underline">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

// Fetches the main geography and its direct relationships
async function getGeographyBySlug(slug: string) {
  const response = await fetch(`http://localhost:3000/api/geographies?where[slug][equals]=${slug}&depth=2`, {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch geography');
  const data = await response.json();
  return data.docs[0];
}

// Fetches all ethnic groups found within a list of nations (for inference)
async function getInferredEthnicGroups(nationIds: string[]) {
  if (!nationIds || nationIds.length === 0) return [];
  const query = `http://localhost:3000/api/ethnic-groups?where[primary_nations][in]=${nationIds.join(',')}&limit=200&depth=0`;
  const response = await fetch(query, { cache: 'no-store' });
  if (!response.ok) return [];
  const data = await response.json();
  return data.docs;
}

export default async function GeographyDetailPage({ params }: { params: { slug: string } }) {
  const geo = await getGeographyBySlug(params.slug);

  if (!geo) {
    return <main className="p-8 text-white"><h1>Geography not found!</h1></main>;
  }

  // --- HIERARCHICAL FETCH LOGIC ---
  // Start with the ethnic groups directly joined to this geography
  let allEthnicGroups = geo.ethnic_groups?.docs || [];

  // If it's a Continental Zone, also fetch groups from its child nations and merge them
  if (geo.type === 'Continental Zone' && geo.child_regions?.docs?.length > 0) {
    const nationIds = geo.child_regions.docs.map((child: any) => child.id);
    const inferredGroups = await getInferredEthnicGroups(nationIds);
    // Combine the direct list with the inferred list
    allEthnicGroups = [...allEthnicGroups, ...inferredGroups];
  }
  // ---------------------------------

  const instruments = geo.instruments?.docs;
  const childRegions = geo.child_regions?.docs;

  return (
    <main className="p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/geographies" className="text-blue-400 hover:underline mb-8 inline-block">
          ← Back to All Geographies
        </Link>
        
        <h1 className="text-5xl font-extrabold text-white">{geo.name}</h1>
        {/* ... Type and Parent Region ... */}
        <p className="text-xl text-gray-400 mt-2">Type: {geo.type}</p>

         {/* --- THIS IS THE UPDATED BLOCK --- */}
        {geo.containing_regions && geo.containing_regions.length > 0 && (
          <div className="text-lg text-gray-300 mt-2">
            <span>Part of: </span>
            {geo.containing_regions.map((parent: { id: string; slug: string; name: string }, index: number) => (
              <React.Fragment key={parent.id}>
                <Link href={`/geographies/${parent.slug}`} className="text-blue-400 hover:underline">
                  {parent.name}
                </Link>
                {/* Add a comma if it's not the last item in the list */}
                {index < geo.containing_regions.length - 1 && ', '}
              </React.Fragment>
            ))}
          </div>
        )}
        {/* ---------------------------------- */}

          <div>
            <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Ethnic Groups</h2>
            {renderLinkList(allEthnicGroups, 'ethnic-groups')}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Instruments from this Region</h2>
            {renderLinkList(instruments, 'instruments')}
          </div>
        </div>
    </main>
  );
}