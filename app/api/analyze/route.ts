import { NextRequest, NextResponse } from 'next/server';
import { analyzeFinancials, type AnalysisRequest } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.company_name || !body.year || !body.report_type || !body.key_accounts) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: '서버 설정이 필요합니다. Gemini API 키가 없습니다.' },
        { status: 503 }
      );
    }

    const result = await analyzeFinancials(apiKey, body);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ analysis: result.analysis });
  } catch (error) {
    return NextResponse.json(
      { error: `요청 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
