'use client';

import { useEffect, useState } from 'react';

interface FinancialItem {
  account_nm: string;
  thstrm_amount: string;
  frmtrm_amount: string;
  sj_div: string;
}

interface AIAnalysisProps {
  corpCode: string;
  corpName: string;
  year: string;
  reportCode: string;
}

const KEY_ACCOUNTS = [
  '매출액',
  '영업이익',
  '당기순이익(손실)',
  '자산총계',
  '부채총계',
  '자본총계',
];

function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  return parseInt(amountStr.replace(/,/g, ''), 10);
}

const REPORT_NAMES: { [key: string]: string } = {
  '11011': '사업보고서',
  '11012': '반기보고서',
  '11013': '1분기보고서',
  '11014': '3분기보고서',
};

export default function AIAnalysis({
  corpCode,
  corpName,
  year,
  reportCode,
}: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeFinancials = async () => {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        // 먼저 재무 데이터 조회
        const params = new URLSearchParams({
          corp_code: corpCode,
          year: year,
          report_code: reportCode,
        });

        const financialResponse = await fetch(`/api/financials?${params}`);
        if (!financialResponse.ok) {
          throw new Error('재무 데이터 조회 실패');
        }

        const financialData = await financialResponse.json();
        const items: FinancialItem[] = financialData.list || [];

        // 주요 계정만 추출
        const keyAccounts: { [key: string]: { current: number | null; previous: number | null } } =
          {};

        KEY_ACCOUNTS.forEach((account) => {
          const item = items.find((i) => i.account_nm === account);
          if (item) {
            keyAccounts[account] = {
              current: parseAmount(item.thstrm_amount) || null,
              previous: parseAmount(item.frmtrm_amount) || null,
            };
          }
        });

        // AI 분석 요청
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company_name: corpName,
            year: year,
            report_type: REPORT_NAMES[reportCode] || '보고서',
            key_accounts: keyAccounts,
          }),
        });

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json();
          throw new Error(errorData.error || 'AI 분석 요청 실패');
        }

        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData.analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    if (corpCode && year && reportCode) {
      analyzeFinancials();
    }
  }, [corpCode, corpName, year, reportCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">AI가 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">분석 오류</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">분석 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-slate-900 leading-relaxed">
          {analysis}
        </div>
      </div>
    </div>
  );
}
