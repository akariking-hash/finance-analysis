'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface FinancialItem {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  fs_div: string;
  fs_nm: string;
  sj_div: string;
  sj_nm: string;
  account_nm: string;
  thstrm_nm: string;
  thstrm_dt: string;
  thstrm_amount: string;
  frmtrm_nm: string;
  frmtrm_dt: string;
  frmtrm_amount: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
}

interface FinancialsDashboardProps {
  corpCode: string;
  corpName: string;
  year: string;
  reportCode: string;
  fsDivFilter: 'CFS' | 'OFS' | 'all';
}

const KEY_ACCOUNTS = [
  '매출액',
  '영업이익',
  '당기순이익(손실)',
  '자산총계',
  '부채총계',
  '자본총계',
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  return parseInt(amountStr.replace(/,/g, ''), 10);
}

function formatAmount(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}조`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}십억`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}백만`;
  return value.toString();
}

export default function FinancialsDashboard({
  corpCode,
  corpName,
  year,
  reportCode,
  fsDivFilter,
}: FinancialsDashboardProps) {
  const [data, setData] = useState<FinancialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          corp_code: corpCode,
          year: year,
          report_code: reportCode,
        });
        const response = await fetch(`/api/financials?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '재무 데이터 조회 실패');
        }

        const result = await response.json();
        setData(result.list || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (corpCode && year && reportCode) {
      fetchData();
    }
  }, [corpCode, year, reportCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">데이터 로드 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">오류</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">조회 가능한 재무 데이터가 없습니다.</p>
      </div>
    );
  }

  const filtered = data.filter((item) => {
    if (fsDivFilter !== 'all' && item.fs_div !== fsDivFilter) return false;
    return KEY_ACCOUNTS.includes(item.account_nm);
  });

  if (filtered.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">선택한 필터에 해당하는 데이터가 없습니다.</p>
      </div>
    );
  }

  const chartData = filtered
    .filter((item) => item.sj_div === 'IS' || item.sj_div === 'BS')
    .map((item) => ({
      account: item.account_nm,
      current: parseAmount(item.thstrm_amount),
      previous: parseAmount(item.frmtrm_amount),
    }))
    .slice(0, 6);

  const statementTypes = Array.from(new Set(filtered.map((item) => item.sj_div)));

  return (
    <div className="space-y-8">
      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">보고서명</p>
          <p className="font-semibold text-slate-900">
            {filtered[0]?.fs_nm || '정보 없음'}
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">통화</p>
          <p className="font-semibold text-slate-900">
            {filtered[0]?.currency || 'KRW'}
          </p>
        </div>
      </div>

      {/* 비교 차트 */}
      {chartData.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-4">주요 계정 비교</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="account"
                tick={{ fontSize: 12, fill: '#64748b' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => formatAmount(value)}
              />
              <Tooltip
                formatter={(value) => formatAmount(value as number)}
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
              />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="당기" radius={[8, 8, 0, 0]} />
              <Bar dataKey="previous" fill="#93c5fd" name="전기" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 재무제표별 상세 정보 */}
      {statementTypes.map((statementType) => {
        const statementData = filtered.filter((item) => item.sj_div === statementType);
        const statementName =
          statementType === 'BS' ? '재무상태표' : statementType === 'IS' ? '손익계산서' : '';

        if (statementData.length === 0) return null;

        const chartData = statementData
          .filter((item) => KEY_ACCOUNTS.includes(item.account_nm))
          .map((item) => ({
            account: item.account_nm.substring(0, 8),
            current: parseAmount(item.thstrm_amount),
            previous: parseAmount(item.frmtrm_amount),
          }));

        return (
          <div key={statementType} className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-4">{statementName} 추이</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="text-left py-2 px-3 font-semibold text-slate-900">계정</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-900">당기</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-900">전기</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-900">변화율</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, idx) => {
                    const changeRate =
                      row.previous !== 0 ? ((row.current - row.previous) / row.previous) * 100 : 0;
                    return (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-white">
                        <td className="py-2 px-3 text-slate-900">{row.account}</td>
                        <td className="text-right py-2 px-3 text-slate-900 font-medium">
                          {formatAmount(row.current)}
                        </td>
                        <td className="text-right py-2 px-3 text-slate-600">
                          {formatAmount(row.previous)}
                        </td>
                        <td
                          className={`text-right py-2 px-3 font-medium ${
                            changeRate >= 0 ? 'text-red-600' : 'text-blue-600'
                          }`}
                        >
                          {changeRate >= 0 ? '+' : ''}
                          {changeRate.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
