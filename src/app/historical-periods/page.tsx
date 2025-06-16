// src/app/historical-periods/page.tsx
import Link from 'next/link';

async function getHistoricalPeriods() {
  const response = await fetch('http://localhost:3000/api/historical-periods?limit=200', {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch historical periods');
  const data = await response.json();
  return data.docs;
}

export default async function HistoricalPeriodsPage() {
  const periods = await getHistoricalPeriods();

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Historical Periods</h1>
      <ul className="space-y-2">
        {periods.map((period) => (
          <li key={period.id}>
            <Link href={`/historical-periods/${period.slug}`} className="text-xl text-blue-400 hover:underline">
              <strong>{period.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}