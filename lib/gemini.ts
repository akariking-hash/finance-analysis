import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AnalysisRequest {
  company_name: string;
  year: string;
  report_type: string;
  key_accounts: {
    [key: string]: {
      current: number | null;
      previous: number | null;
    };
  };
}

export async function analyzeFinancials(
  apiKey: string,
  request: AnalysisRequest
): Promise<{ analysis: string } | { error: string }> {
  if (!apiKey) {
    return {
      error: 'Gemini API 키가 설정되지 않았습니다.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const accountsText = Object.entries(request.key_accounts)
      .map(([name, values]) => {
        const current = values.current ? `${(values.current / 1e12).toFixed(2)}조원` : '정보 없음';
        const previous = values.previous ? `${(values.previous / 1e12).toFixed(2)}조원` : '정보 없음';
        return `${name}: 당기 ${current} / 전기 ${previous}`;
      })
      .join('\n');

    const systemPrompt = `당신은 재무 분석 전문가입니다. 다음의 원칙을 따라 재무 정보를 누구나 이해할 수 있게 쉬운 한국어로 분석해주세요:

1. 누구나 이해할 수 있는 언어 사용
   - 금융 용어는 반드시 쉽게 설명하세요.
   - 예시를 들어 직관적으로 설명하세요.

2. 객관적이고 사실 기반의 분석
   - 제시된 수치를 직접 인용하세요.
   - 수치의 변화 추이와 그 의미를 설명하세요.

3. 피해야 할 내용
   - 투자 조언이나 미래 예측은 하지 마세요.
   - 주관적인 의견이나 추측은 포함하지 마세요.

4. 문체와 길이
   - 3-4개 문단으로 간결하게 작성하세요.
   - 문장을 짧고 명확하게 하세요.`;

    const userPrompt = `회사명: ${request.company_name}
사업연도: ${request.year}
보고서: ${request.report_type}

주요 재무 계정:
${accountsText}

이 재무정보를 분석해주세요.`;

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    const responseData = response as any;
    let analysisText = '';

    if (responseData.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      analysisText = responseData.response.candidates[0].content.parts[0].text;
    } else if (responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
      analysisText = responseData.candidates[0].content.parts[0].text;
    }

    if (!analysisText) {
      return {
        error: 'AI 분석 응답이 비어있습니다.',
      };
    }

    return { analysis: analysisText };
  } catch (error) {
    return {
      error: `AI 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    };
  }
}
