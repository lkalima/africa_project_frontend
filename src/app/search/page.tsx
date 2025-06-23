import Link from 'next/link';
import qs from 'qs';

export const dynamic = 'force-dynamic';

// --- Type Definitions ---
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  doc: {
    relationTo: string;
    value: string; // The ID of the original document
  };
}

// Fetches the initial search results (titles and IDs)
async function fetchSearchResults(query: string): Promise<SearchResult[] | null> {
  if (!query) return null;
  const endpoint = `http://localhost:3000/api/search?search=${encodeURIComponent(query)}&limit=25&depth=0`;
  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return null;
  }
}

// Fetches the full details for a list of documents
async function fetchFullDocs(results: SearchResult[]) {
  if (!results || results.length === 0) return [];
  
  // Group IDs by collection
  const idsByCollection: { [key: string]: string[] } = {};
  results.forEach(res => {
    if (!idsByCollection[res.doc.relationTo]) {
      idsByCollection[res.doc.relationTo] = [];
    }
    idsByCollection[res.doc.relationTo].push(res.doc.value);
  });

  // Perform a fetch for each collection that has results
  const promises = Object.entries(idsByCollection).map(async ([collection, ids]) => {
    const query = qs.stringify({ where: { id: { in: ids } } }, { addQueryPrefix: true });
    const response = await fetch(`http://localhost:3000/api/${collection}${query}`, { cache: 'no-store' });
    if (!response.ok) return { collection, docs: [] };
    const data = await response.json();
    return { collection, docs: data.docs };
  });

  const allDocs = await Promise.all(promises);

  // Create a simple lookup map for easy access: 'collection-id' -> fullDoc
  const docMap = new Map();
  allDocs.forEach(collectionResult => {
    collectionResult.docs.forEach(doc => {
      docMap.set(`${collectionResult.collection}-${doc.id}`, doc);
    });
  });

  return docMap;
}

// --- The Main Page Component ---
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams?.q || '';
  
  // --- TWO-STEP FETCH ---
  const initialResults = await fetchSearchResults(query);
  const fullDocsMap = await fetchFullDocs(initialResults);
  // --------------------

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        {query ? `Search Results for "${query}"` : 'Search'}
      </h1>
      
      {!query && <p className="text-gray-400">Please enter a term in the header to search the archive.</p>}

      {query && !initialResults && <p className="text-red-400">There was an error performing the search.</p>}
      
      {query && initialResults && initialResults.length === 0 && <p className="text-gray-400">No results found for your query.</p>}

      {initialResults && initialResults.length > 0 && (
        <ul className="space-y-6">
          {initialResults.map((result) => {
            // Get the full document from our map
            const docData = fullDocsMap.get(`${result.doc.relationTo}-${result.doc.value}`);
            
            // If we couldn't fetch the full doc for some reason, we can't render a link
            if (!docData?.slug) {
              return (
                <li key={result.id} className="block p-4 bg-gray-800 rounded-lg border border-gray-700 opacity-60">
                  <h3 className="text-xl font-bold text-gray-400">{result.title}</h3>
                  <p className="text-gray-500 mt-2">Could not render link (data not fully populated).</p>
                </li>
              );
            }

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
                  {result.description && (
                    <p className="text-gray-300 mt-2 line-clamp-2">{result.description}</p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
