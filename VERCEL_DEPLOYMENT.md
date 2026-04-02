# Vercel 배포 가이드

GitHub에 업로드가 완료되었습니다. 이제 Vercel에 배포하는 방법입니다.

## 📋 저장소 정보

- **Repository**: https://github.com/akariking-hash/finance-analysis
- **Branch**: master

## 🚀 Vercel 배포 단계

### 1단계: Vercel 대시보드 접속
1. https://vercel.com에 접속
2. GitHub 계정으로 로그인 (또는 가입)

### 2단계: 새 프로젝트 생성
1. Dashboard → "Add New..." → "Project" 클릭
2. GitHub 계정 연동 확인 (이미 연동된 경우 생략)
3. `finance-analysis` 저장소 선택

### 3단계: 프로젝트 설정
1. **Framework**: Next.js (자동 감지됨)
2. **Root Directory**: ./ (기본값 유지)
3. **Build Command**: `npm run build` (자동 감지됨)
4. **Output Directory**: `.next` (자동 감지됨)

### 4단계: 환경 변수 설정 (필수)
**Environment Variables** 섹션에서 다음을 추가하세요:

```
OPENDART_API_KEY=6bad8a7a4aa891bd0de03bf5223d9ed82526701f
GEMINI_API_KEY=AIzaSyDlwM_uD1wz5zRnl5u62Qk0m1bdd2Jon4A
```

**각 환경에 추가:**
- ✓ Production
- ✓ Preview
- ✓ Development (선택사항)

### 5단계: 배포
1. "Deploy" 버튼 클릭
2. 배포 진행 상황 모니터링
3. 완료 후 배포된 URL 확인

## ✅ 배포 후 확인사항

배포 완료 후 다음을 확인하세요:

1. **메인 페이지 로드**
   ```
   https://your-project.vercel.app/
   ```

2. **회사 검색 테스트**
   - 검색창에 "삼성" 입력
   - 결과 나타나는지 확인

3. **재무 데이터 조회 테스트**
   - 회사 선택 후 연도/보고서 설정
   - 차트 및 테이블 로드 확인

4. **AI 분석 테스트**
   - AI 분석 섹션에서 분석 결과 확인

5. **API 엔드포인트 테스트**
   ```
   https://your-project.vercel.app/api/corp-search?q=삼성
   https://your-project.vercel.app/api/financials?corp_code=00126380&year=2024&report_code=11011
   ```

## 🔒 보안 체크리스트

- ✓ `.env.local` 파일은 커밋되지 않음 (`.gitignore` 적용)
- ✓ API 키는 환경 변수로만 관리
- ✓ 공개 저장소에 민감 정보 없음
- ✓ 배포된 앱에서 API 호출은 서버 사이드만 사용

## 🆘 트러블슈팅

### 환경 변수 미설정 오류
```
Error: 서버 설정이 필요합니다. OpenDart API 키가 없습니다.
```
**해결**: Vercel 프로젝트 설정에서 Environment Variables 다시 확인

### 404 에러 (페이지 없음)
```
Error: 필수 파라미터가 누락되었습니다
```
**해결**: 쿼리 파라미터 확인 (corp_code, year, report_code)

### 레이트 리밋 에러
```
OpenDart API 요청 실패
```
**해결**: OpenDart API는 초당 10회 호출 제한, 잠시 후 재시도

## 📊 배포된 프로젝트 정보

- **Framework**: Next.js 16.2.2
- **Runtime**: Node.js
- **Database**: 없음 (정적 corp-index.json 사용)
- **External APIs**:
  - OpenDart API (한국 공시 정보)
  - Google Gemini API (AI 분석)

## 🔄 배포 후 업데이트

코드를 변경한 경우:

```bash
git add .
git commit -m "Update: [설명]"
git push origin master
```

Vercel이 자동으로 감지하여 새로운 배포를 시작합니다.

---

**배포 완료 후 URL**: https://your-project.vercel.app

축하합니다! 🎉 재무 데이터 시각화 서비스가 배포되었습니다!
