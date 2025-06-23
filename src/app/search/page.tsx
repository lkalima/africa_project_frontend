import Link from 'next/link';
import qs from 'qs'; // You have this installed, which is correct.

export const dynamic = 'force-dynamic';

// --- Type Definitions for our Data ---
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  doc: {
    relationTo: string;
    value: string; // The initial fetch only gives us the ID string
  };
}

interface FullDoc {
  id: string;
  slug?: string;
}

// --- API Fetching Functions ---

// 1. Fetches the initial search results (titles and IDs) using the correct 'where' query
async function fetchSearchResults(query: string): Promise<SearchResult[] | null> {
  if (!query) return null;

  // THIS IS THE CORRECT QUERY STRUCTURE BASED ON THE DOCUMENTATION
  const searchQuery = {
    where: {
      or: [
        { title: { like: query } },
        { description: { like: query } },
      ],
    },
    limit: 50,
    depth: 0, // We only need the IDs
  };

  const stringifiedQuery = qs.stringify(searchQuery, { addQueryPrefix: true });
  const endpoint = `http://localhost:3000/api/search${stringifiedQuery}`;
  // -----------------------------------------------------------------

  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`fetchSearchResults failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.docs;
  } catch (error) {
    console.error("Error in fetchSearchResults:", error);
    return null;
  }
}

// 2. Fetches the full details for a list of documents using their IDs
async function fetchFullDocs(results: SearchResult[] | null): Promise<Map<string, FullDoc>> {
  const docMap = new Map<string, FullDoc>();
  if (!results || results.length === 0) return docMap;

  const idsByCollection: { [key: string]: string[] } = {};
  results.forEach(res => {
    // Ensure we are always working with strings for IDs
    const id = String(res.doc.value);
    if (!idsByCollection[res.doc.relationTo]) {
      idsByCollection[res.doc.relationTo] = [];
    }
    idsByCollection[res.doc.relationTo].push(id);
  });

  const promises = Object.entries(idsByCollection).map(async ([collection, ids]) => {
    if (ids.length === 0) return [];
    const query = qs.stringify({ where: { id: { in: ids } } }, { addQueryPrefix: true });
    try {
      const res = await fetch(`http://localhost:3000/api/${collection}${query}`, { cache: 'no-store' });
      if (!res.ok) { console.error(`fetchFullDocs for ${collection} failed: ${res.status}`); return []; }
      const data = await res.json();
      return data.docs;
    } catch (e) {
      console.error(`Error fetching full docs for ${collection}:`, e);
      return [];
    }
  });

  const allDocsArrays = await Promise.all(promises);
  
  // --- THIS IS THE KEY FIX ---
  // When setting the map key, ensure it's a string.
  allDocsArrays.flat().forEach((doc: FullDoc | null) => {
    if (doc) {
      docMap.set(String(doc.id), doc);
    }
  });
  // -------------------------

  return docMap;
}

// --- The Main Page Component ---
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams?.q || '';
  
  const initialResults = await fetchSearchResults(query);
  const fullDocsMap = await fetchFullDocs(initialResults);

  // --- DIAGNOSTIC LOGS ---
  console.log('--- DIAGNOSTIC DATA ---');
  console.log('Step 1: Initial Search Results (IDs):');
  console.log(JSON.stringify(initialResults, null, 2));

  console.log('Step 2: Full Docs Map (Populated Docs):');
  console.log(fullDocsMap);
  // -------------------------

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        {query ? `Search Results for "${query}"` : 'Search'}
      </h1>
      
      {/* ... Error and empty state handling ... */}
      
      {initialResults && initialResults.length > 0 && (
        <ul className="space-y-6">
          {initialResults.map((result) => {
            // --- THIS IS THE KEY FIX ---
            // When getting from the map, ensure we use a string key.
            const docData = fullDocsMap.get(String(result.doc.value));

            // --- DIAGNOSTIC LOG ---
            console.log(`Lookup: Trying to find ID "${result.doc.value}". Found in map: ${fullDocsMap.has(result.doc.value)}`);
            // ----------------------
            
            if (docData?.slug) {
              const collectionSlug = result.doc.relationTo;
              const collectionLabel = collectionSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return (
                <li key={result.id}>
                  <Link href={`/${collectionSlug}/${docData.slug}`} className="block p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-blue-400">{result.title}</h3>
                      <span className="text-xs uppercase font-semibold text-gray-500 bg-gray-700 px-2 py-1 rounded">
                        {collectionLabel}
                      </span>
                    </div>
                    {result.description && (<p className="text-gray-300 mt-2 line-clamp-2">{result.description}</p>)}
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={result.id} className="block p-4 bg-gray-800 rounded-lg border border-gray-700 opacity-60">
                  <h3 className="text-xl font-bold text-gray-400">{result.title}</h3>
                  <p className="text-gray-300 mt-2 line-clamp-2">{result.description}</p>
                  <p className="text-red-500 text-sm mt-2">Could not render link (data not fully populated or has no slug).</p>
                </li>
              );
            }
          })}
        </ul>
      )}
    </main>
  );
}