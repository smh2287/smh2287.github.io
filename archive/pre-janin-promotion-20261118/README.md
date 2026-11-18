# smh2287.github.io

Minho Song 포트폴리오의 GitHub Pages 호스팅 저장소.

## 목적
- 기존 Synology WebStation 기반 포트폴리오/QR 운영을 GitHub Pages로 단계 전환
- 1차 테스트 범위: `IAC2022 KIA`만 우선 배포/검증
- 검증 후 5대 프로젝트(IAC2022 KIA/HYUNDAI, IAC2021 KIA, VISHOW, NIVA)로 확장

## 현재 구조 (요약)
- `index.html` : 루트 랜딩(임시)
- `projects/*` : 카테고리/프로젝트 페이지 모음
- 이미지/썸네일 원본은 Synology (`/web/portfolio/images/...`)를 단일 소스로 사용
- GitHub 저장소는 HTML/구성 파일 중심으로 유지

## 운영 원칙
1. 링크 기준 도메인은 `https://smh2287.github.io`로 통일
2. 테스트 단계에서 미배포 페이지는 비활성 처리(404 노출 금지)
3. 보안/억제(우클릭 방지, 비밀번호 게이트 등)는 기존 정책 유지

## 단계별 확장 계획
1) IAC2022 KIA 완성
2) 카테고리 인덱스 확장
3) 5대 프로젝트 전체 연결
4) QR 링크 전면 치환 및 최종 QA
