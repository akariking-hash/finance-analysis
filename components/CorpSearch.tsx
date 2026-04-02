'use client';

import { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';

interface Corp {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
}

interface CorpSearchProps {
  onSelectCorp: (corp: {
    corp_code: string;
    corp_name: string;
    stock_code: string;
  }) => void;
}

export default function CorpSearch({ onSelectCorp }: CorpSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Corp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        if (searchTerm.length < 1) {
          setResults([]);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch(`/api/corp-search?q=${encodeURIComponent(searchTerm)}`);
          const data = await response.json();
          setResults(data.results || []);
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleSelectResult = (corp: Corp) => {
    onSelectCorp({
      corp_code: corp.corp_code,
      corp_name: corp.corp_name,
      stock_code: corp.stock_code,
    });
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="회사명, 종목코드 또는 corp_code로 검색..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && <div className="flex items-center px-4 text-slate-500">검색 중...</div>}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
          <div className="max-h-96 overflow-y-auto">
            {results.map((corp) => (
              <button
                key={corp.corp_code}
                onClick={() => handleSelectResult(corp)}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 border-b border-slate-100 last:border-b-0 transition"
              >
                <p className="font-medium text-slate-900">{corp.corp_name}</p>
                <p className="text-sm text-slate-600">
                  {corp.stock_code} • {corp.corp_code}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && results.length === 0 && query && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10 p-4">
          <p className="text-slate-600">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
