# 재무 데이터 검색·시각화·AI 분석 서비스

누구나 쉽게 이해할 수 있는 **재무 데이터 시각화 및 AI 분석** 서비스입니다. React(Next.js)로 구현되었으며, OpenDart API와 Google Gemini를 활용하여 실제 상장 기업의 재무 정보를 검색, 시각화, AI 분석합니다.

## 주요 기능

### 1. 회사 검색 (검색)
- `corp.xml` 기반 3,864개 회사 데이터 검색
- 회사명, 영문명, 종목코드, corp_code로 검색 가능
- 실시간 검색 결과 제시

### 2. 재무 현황 (시각화)
- OpenDart API 연동으로 실제 재무 데이터 조회
- 연도별, 보고서별(사업/반기/1분기/3분기) 선택 가능
- 연결(CFS) / 개별(OFS) 재무제표 필터링
- **주요 계정 차트**: 막대 차트로 당기/전기 수치 비교
- **재무제표 분석**: 손익계산서(IS) 및 재무상태표(BS) 항목별 상세 조회
- 변화율 계산으로 추이 분석

### 3. AI 분석 (Gemini)
- Google Gemini 2.5-Flash 모델을 활용한 자동 재무 분석
- **비전문가 친화적**: 전문 용어 쉽게 설명, 예시 제시
- **객관적 분석**: 수치 인용, 사실 기반 해석
- 투자 조언 금지, 미래 예측 제외

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript | 16.2.2 |
| UI 라이브러리 | React | 19.2.4 |
| 스타일링 | Tailwind CSS | 4.x |
| 차트 | Recharts | 3.8.1 |
| XML 파싱 | fast-xml-parser | 5.5.9 |
| AI | Google Generative AI SDK | 0.24.1 |
| 유틸 | lodash (debounce) | latest |

## 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치
```bash
cd "c:\Users\yslee\OneDrive - YBM, Inc\00_바이브코딩\finance"
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenDart API
OPENDART_API_KEY=your_opendart_api_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

참고: `.env.example` 파일을 참고하세요.

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 프로젝트 구조

```
.
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # Gemini AI 분석 API
│   │   ├── corp-search/route.ts      # 회사 검색 API
│   │   └── financials/route.ts       # OpenDart 재무 데이터 프록시
│   ├── page.tsx                      # 메인 페이지
│   ├── layout.tsx                    # 레이아웃
│   └── globals.css                   # 글로벌 스타일
├── components/
│   ├── CorpSearch.tsx               # 회사 검색 컴포넌트
│   ├── FinancialsDashboard.tsx       # 재무 시각화 대시보드
│   └── AIAnalysis.tsx               # AI 분석 패널
├── lib/
│   ├── opendart.ts                  # OpenDart API 유틸
│   └── gemini.ts                    # Gemini API 유틸
├── scripts/
│   └── build-corp-index.mjs         # corp.xml → corp-index.json 변환 스크립트
├── data/
│   └── corp.xml                     # 회사 정보 원본 데이터
├── public/
│   └── corp-index.json              # 빌드 후 생성되는 검색용 인덱스
├── .env.local                       # 환경 변수 (로컬, gitignore)
├── .env.example                     # 환경 변수 샘플
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

## API 명세

### 1. 회사 검색: `GET /api/corp-search?q=검색어`

**요청:**
```bash
GET /api/corp-search?q=삼성
```

**응답:**
```json
{
  "results": [
    {
      "corp_code": "00126380",
      "corp_name": "삼성전자",
      "corp_eng_name": "SAMSUNG ELECTRONICS CO,.LTD",
      "stock_code": "005930"
    }
  ]
}
```

### 2. 재무 데이터: `GET /api/financials?corp_code=&year=&report_code=`

**요청:**
```bash
GET /api/financials?corp_code=00126380&year=2024&report_code=11011
```

**파라미터:**
- `corp_code`: 회사 고유번호 (8자리)
- `year`: 사업연도 (2015 이후)
- `report_code`: 보고서 코드
  - `11011`: 사업보고서
  - `11012`: 반기보고서
  - `11013`: 1분기보고서
  - `11014`: 3분기보고서

**응답:**
```json
{
  "status": "000",
  "message": "정상",
  "list": [
    {
      "account_nm": "매출액",
      "thstrm_amount": "243,771,415,000,000",
      "frmtrm_amount": "239,575,376,000,000",
      ...
    }
  ]
}
```

### 3. AI 분석: `POST /api/analyze`

**요청:**
```bash
POST /api/analyze
Content-Type: application/json

{
  "company_name": "삼성전자",
  "year": "2024",
  "report_type": "사업보고서",
  "key_accounts": {
    "매출액": {
      "current": 243771415000000,
      "previous": 239575376000000
    }
  }
}
```

**응답:**
```json
{
  "analysis": "삼성전자의 2024년 재무 현황을 분석하면... (AI 생성 분석 텍스트)"
}
```

## Vercel 배포

### 1. 저장소 준비
```bash
git init
git add .
git commit -m "Initial commit: Finance analysis service"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Vercel 배포
1. [Vercel 대시보드](https://vercel.com)에서 "New Project"
2. GitHub 저장소 선택
3. **Project Settings → Environment Variables** 추가:
   - `OPENDART_API_KEY`: OpenDart API 키
   - `GEMINI_API_KEY`: Google Gemini API 키
4. Deploy 클릭

### 3. 배포 후 확인
- 메인 페이지 접속: `https://your-project.vercel.app`
- 환경 변수가 정상 로드되었는지 API 테스트로 확인

## 보안 주의사항

⚠️ **중요**: 이 프로젝트에 사용된 API 키(OpenDart, Gemini)는 **데모용이므로 즉시 폐기 및 재발급**하시기 바랍니다.

- **API 키는 절대 GitHub에 커밋하지 마세요.**
- `.env.local`과 `.env` 파일은 `.gitignore`에 포함됩니다.
- 프로덕션 환경에서는 반드시 환경 변수로만 관리하세요.

## 제한사항 및 향후 개선

- **데이터 범위**: 2015년 이후 공시대상회사만 조회 가능
- **레이트 리밋**: OpenDart API는 초당 10회 호출 제한
- **AI 모델**: Gemini 2.5-Flash 사용 (최신 모델 변경 시 지원)
- **차트**: 주요 6개 계정만 표시 (커스터마이징 가능)

향후 개선 사항:
- 다중 년도 비교 분석
- 업종별 벤치마킹
- 재무 비율 분석 (ROE, ROA, 부채비율 등)
- 트렌드 예측 (AI 기반)
- 엑셀 내보내기

## 참고 자료

- [OpenDart API 가이드](https://opendart.fss.or.kr)
- [Google Generative AI 문서](https://ai.google.dev)
- [Next.js 문서](https://nextjs.org)
- [Recharts 문서](https://recharts.org)

## 라이선스

이 프로젝트는 개인 학습 및 분석용입니다.

## 문의

개선 사항이나 버그 리포트는 이슈로 등록해주세요.
