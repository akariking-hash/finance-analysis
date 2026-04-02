'use client';

import { useState, useCallback, useMemo } from 'react';
import CorpSearch from '@/components/CorpSearch';
import FinancialsDashboard from '@/components/FinancialsDashboard';
import AIAnalysis from '@/components/AIAnalysis';

interface SelectedCorp {
  corp_code: string;
  corp_name: string;
  stock_code: string;
}

export default function Home() {
  const [selectedCorp, setSelectedCorp] = useState<SelectedCorp | null>(null);
  const [year, setYear] = useState<string>('2024');
  const [reportCode, setReportCode] = useState<string>('11011');
  const [fsDivFilter, setFsDivFilter] = useState<'CFS' | 'OFS' | 'all'>('CFS');

  const reportOptions = useMemo(
    () => [
      { code: '11011', label: '사업보고서' },
      { code: '11012', label: '반기보고서' },
      { code: '11013', label: '1분기보고서' },
      { code: '11014', label: '3분기보고서' },
    ],
    []
  );

  const handleSelectCorp = useCallback((corp: SelectedCorp) => {
    setSelectedCorp(corp);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">재무 데이터 분석 서비스</h1>
          <p className="text-slate-600 mt-2">쉽고 명확한 재무 정보 검색 및 시각화</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 검색 섹션 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">회사 검색</h2>
          <CorpSearch onSelectCorp={handleSelectCorp} />
          {selectedCorp && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">선택된 회사:</span> {selectedCorp.corp_name} (
                {selectedCorp.stock_code})
              </p>
            </div>
          )}
        </section>

        {/* 차트 및 필터 섹션 */}
        {selectedCorp && (
          <>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">필터 및 컨트롤</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    사업연도
                  </label>
                  <input
                    type="number"
                    min="2015"
                    max={new Date().getFullYear()}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    보고서
                  </label>
                  <select
                    value={reportCode}
                    onChange={(e) => setReportCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {reportOptions.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    재무제표
                  </label>
                  <select
                    value={fsDivFilter}
                    onChange={(e) => setFsDivFilter(e.target.value as 'CFS' | 'OFS' | 'all')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CFS">연결재무제표</option>
                    <option value="OFS">개별재무제표</option>
                    <option value="all">전체</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">재무 현황</h2>
              <FinancialsDashboard
                corpCode={selectedCorp.corp_code}
                corpName={selectedCorp.corp_name}
                year={year}
                reportCode={reportCode}
                fsDivFilter={fsDivFilter}
              />
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">AI 분석</h2>
              <AIAnalysis
                corpCode={selectedCorp.corp_code}
                corpName={selectedCorp.corp_name}
                year={year}
                reportCode={reportCode}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
