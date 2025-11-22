import React, { useState } from 'react';
import axios from 'axios';

interface SearchResult {
  module_id: string;
  score: number;
  snippet: string;
  metadata: {
    title: string;
    category: string;
    language: string;
    sector_tags: string[];
    tags: string[];
  };
}

interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  error?: string;
}

const SearchModule: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [sector, setSector] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get<SearchResponse>('/llm/search', {
        params: {
          query,
          lang: language,
          sector: sector || undefined,
          topic: topic || undefined,
          limit: 10
        }
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.error || 'Failed to search modules');
      }
    } catch (err) {
      setError('Failed to search modules');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-module">
      <form onSubmit={handleSearch} className="search-form mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Sector filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <h2 className="text-xl font-bold mb-4">Search Results ({results.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {results.map((result) => (
              <div key={result.module_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold">{result.metadata.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Category: {result.metadata.category} | 
                  Language: {result.metadata.language} |
                  Score: {result.score.toFixed(2)}
                </p>
                <p className="text-gray-700 mb-2">{result.snippet}</p>
                <div className="flex flex-wrap gap-2">
                  {result.metadata.sector_tags?.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {result.metadata.tags?.map((tag, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <a 
                    href={`/module/${result.module_id}`} 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Module
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && query && (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchModule;