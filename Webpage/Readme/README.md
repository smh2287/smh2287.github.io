# Webpage 운영 가이드 (GitHub Pages 기준)

이 문서는 포트폴리오 웹페이지를 `smh2287.github.io` 기준으로 배포/운영하기 위한 기준서다.

## 경로 규칙
- 메인: `https://smh2287.github.io/`
- 카테고리: `https://smh2287.github.io/projects/{category}/`
- 상세: `https://smh2287.github.io/projects/{category}/{project}/`

## 파일 구조 권장
- `projects/<category>/index.html` : 카테고리 허브
- `projects/<category>/<project>/index.html` : 프로젝트 상세
- `assets/images/<category>/<project>/*.webp` : 상세 에셋

## 마이그레이션 시 주의사항
1. 예전 Synology 경로(`songfamhome.synology.me/...`)를 남기지 않는다.
2. 상세 페이지 내부 이미지 경로는 GitHub Pages 기준으로 교체한다.
3. 테스트 단계에서는 미배포 카드 링크를 비활성 처리해 404를 방지한다.

## 현재 테스트 상태
- `projects/iac2022kia/` : 배포됨
- `projects/iac2022kia/mocamper/` : 배포됨
- 나머지 프로젝트: 순차 이전 예정
