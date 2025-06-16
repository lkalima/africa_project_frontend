// src/app/ethnic-groups/page.tsx
import Link from 'next/link';

// This function fetches all ethnic groups from our Payload API
async function getEthnicGroups() {
  const response = await fetch('http://localhost:3000/api/ethnic-groups?limit=200', {
    cache: 'no-store' 
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ethnic groups');
  }

  const data = await response.json();
  return data.docs;
}

// The main page component
export default async function EthnicGroupsPage() {
  const groups = await getEthnicGroups();

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Ethnic Groups of Africa</h1>
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/ethnic-groups/${group.slug}`} className="text-xl text-blue-400 hover:underline">
              <strong>{group.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}