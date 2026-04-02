import { NextRequest, NextResponse } from 'next/server';
import { fetchFinancials, type OpenDartResponse, type OpenDartError } from '@/lib/opendart';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const corpCode = searchParams.get('corp_code');
  const year = searchParams.get('year');
  const reportCode = searchParams.get('report_code');

  if (!corpCode || !year || !reportCode) {
    return NextResponse.json(
      {
        error: '필수 파라미터가 누락되었습니다: corp_code, year, report_code',
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENDART_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: '서버 설정이 필요합니다. OpenDart API 키가 없습니다.',
      },
      { status: 503 }
    );
  }

  const result = await fetchFinancials(apiKey, corpCode, year, reportCode);

  if ('statusCode' in result) {
    const error = result as OpenDartError;
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  const data = result as OpenDartResponse;
  return NextResponse.json(data);
}
