// src/app/historical-periods/[slug]/page.tsx
import Link from 'next/link';

async function getPeriodBySlug(slug: string) {
  const response = await fetch(`http://localhost:3000/api/historical-periods?where[slug][equals]=${slug}&depth=1`, {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch historical period');
  const data = await response.json();
  return data.docs[0];
}

export default async function PeriodDetailPage({ params }: { params: { slug: string } }) {
  const period = await getPeriodBySlug(params.slug);

  if (!period) {
    return <main className="p-8 text-white"><h1>Period not found!</h1></main>;
  }

  return (
    <main className="p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/historical-periods" className="text-blue-400 hover:underline mb-8 inline-block">
          ← Back to All Periods
        </Link>
        
        <h1 className="text-5xl font-extrabold text-white">{period.name}</h1>
        
        {period.period_date && (
          <p className="text-xl text-gray-400 mt-2">
            {period.period_date.precision} {Math.abs(period.period_date.year)} {period.period_date.era === 'BCE/CE' && period.period_date.year < 0 ? 'BCE' : ''}
          </p>
        )}

        <div className="prose prose-invert mt-4">
          {period.description}
        </div>
        
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Instruments from this Period</h2>
          {period.instruments && period.instruments.docs && period.instruments.docs.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {period.instruments.docs.map(instrument => (
                <li key={instrument.id}>
                  <Link href={`/instruments/${instrument.slug}`} className="text-blue-400 hover:underline">{instrument.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No instruments listed for this period yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}