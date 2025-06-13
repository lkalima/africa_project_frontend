// page.tsx
// Page: src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold">Africa Project</h1>
        <p className="text-xl text-gray-400 mt-4">An archive and encyclopedia of the African continent and its peoples.</p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* Card for Musical Instruments */}
        <Link href="/instruments" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
          <h2 className="text-2xl font-bold">Musical Instruments</h2>
          <p className="text-gray-400 mt-2">Explore the diverse soundscape of Africa, from the Kora to the Mbira.</p>
        </Link>

        {/* Placeholder Card for Ethnic Groups */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 opacity-50 cursor-not-allowed">
          <h2 className="text-2xl font-bold">Ethnic Groups</h2>
          <p className="text-gray-400 mt-2">Discover the rich tapestry of cultures and peoples. (Coming Soon)</p>
        </div>

        {/* Placeholder Card for Geographies */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 opacity-50 cursor-not-allowed">
          <h2 className="text-2xl font-bold">Geographies</h2>
          <p className="text-gray-400 mt-2">Journey through the continent's diverse landscapes. (Coming Soon)</p>
        </div>
      </div>
    </main>
  );
}