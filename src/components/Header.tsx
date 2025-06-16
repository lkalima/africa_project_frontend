import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <nav className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Main Project Link */}
        <Link href="/" className="text-2xl font-extrabold text-white hover:text-blue-400 transition-colors">
          Africa Project
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-lg">
          <Link href="/instruments" className="text-gray-300 hover:text-white">
            Instruments
          </Link>
          <Link href="/ethnic-groups" className="text-gray-300 hover:text-white">
            Ethnic Groups
          </Link>
          <Link href="/geographies" className="text-gray-300 hover:text-white">
            Geographies
          </Link>
        </div>
      </nav>
    </header>
  );
};