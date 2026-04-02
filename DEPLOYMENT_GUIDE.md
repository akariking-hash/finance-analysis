# ⚡ Vercel 배포 - 웹 대시보드 가이드

GitHub 자동 배포를 통해 쉽게 Vercel에 배포할 수 있습니다.

## 🚀 배포 단계

### Step 1: Vercel 대시보드 접속
```
https://vercel.com/dashboard
```

GitHub 계정으로 로그인하거나 가입

### Step 2: 새 프로젝트 생성
1. Dashboard 페이지에서 **"Add New"** → **"Project"** 클릭
2. **"Continue with GitHub"** 선택
3. GitHub 권한 승인 (필요한 경우)

### Step 3: 저장소 선택
1. **"Import Git Repository"** 섹션에서
2. `akariking-hash/finance-analysis` 검색
3. **"Import"** 버튼 클릭

### Step 4: 프로젝트 설정
자동으로 감지되므로 그대로 유지:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Root Directory: ./
```

### Step 5: 환경 변수 설정 (중요!)

**"Environment Variables"** 섹션에 다음을 추가:

#### 1️⃣ OPENDART_API_KEY
```
Name: OPENDART_API_KEY
Value: 6bad8a7a4aa891bd0de03bf5223d9ed82526701f
```

체크박스:
- ✓ Production
- ✓ Preview  
- ✓ Development

#### 2️⃣ GEMINI_API_KEY
```
Name: GEMINI_API_KEY
Value: AIzaSyDlwM_uD1wz5zRnl5u62Qk0m1bdd2Jon4A
```

체크박스:
- ✓ Production
- ✓ Preview
- ✓ Development

### Step 6: 배포 시작
1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 모니터링 (약 3-5분)

## 📊 배포 진행 상황 확인

배포 중:
```
Creating deployment...
Building...
Generating static pages...
Finalizing page optimization...
```

배포 완료:
```
✓ Deployment complete!
Live URL: https://finance-analysis-*.vercel.app
```

## ✅ 배포 완료 후

### 1️⃣ URL 확인
배포 완료 후 자동으로 생성되는 URL:
```
https://finance-analysis-{username}.vercel.app
```

### 2️⃣ 기능 테스트
- [ ] 메인 페이지 로드
- [ ] 회사 검색 (예: "삼성")
- [ ] 재무 데이터 조회
- [ ] AI 분석 실행

### 3️⃣ 로그 확인
배포 로그 확인:
```
Vercel Dashboard → Deployments → 최신 배포 → Logs
```

## 🔄 자동 배포

이제부터 GitHub에 푸시하면 Vercel이 자동으로 배포합니다:

```bash
git add .
git commit -m "Update: 설명"
git push origin master
```

↓

Vercel이 자동으로 감지하여 배포 시작

## 🆘 문제 해결

### 404 에러
→ 환경 변수 확인 후 재배포

### 빌드 실패
→ 배포 로그 확인, 로컬에서 `npm run build` 테스트

### 환경 변수 미설정
→ Settings → Environment Variables에서 재확인

## 📋 체크리스트

- [ ] Vercel 대시보드에서 GitHub 저장소 연결
- [ ] OPENDART_API_KEY 환경 변수 추가
- [ ] GEMINI_API_KEY 환경 변수 추가
- [ ] "Deploy" 버튼 클릭
- [ ] 배포 완료 대기 (3-5분)
- [ ] 배포된 URL 확인
- [ ] 회사 검색 기능 테스트
- [ ] 재무 데이터 로드 테스트
- [ ] AI 분석 기능 테스트

---

**GitHub Repository**: https://github.com/akariking-hash/finance-analysis

축하합니다! 🎉 이제 Vercel에서 배포할 준비가 완료되었습니다!
