# SVGR 기능 구현 로드맵

SVGR(https://react-svgr.com) 기능을 n8n 노드로 구현하기 위한 작업 목록

## 현재 구현 완료

- [x] icon - width/height 제거
- [x] typescript - TypeScript 코드 생성
- [x] dimensions - width/height 유지
- [x] prettier - 코드 포맷팅
- [x] svgo - 기본 최적화 (xmlns, style, shape-rendering 제거)
- [x] componentName - 컴포넌트 이름 지정
- [x] removeViewBox - viewBox 제거
- [x] addFillCurrentColor - fill="currentColor" 추가

---

## Phase 1: 핵심 기능

### 1.1 jsxRuntime 옵션
- [ ] `classic` | `automatic` 선택 지원
- [ ] automatic: import 문 제거
- [ ] Svgr.node.ts에 옵션 추가
- [ ] svgTransformer.ts 템플릿 수정
- [ ] 테스트 케이스 추가

### 1.2 ref (forwardRef) 옵션
- [ ] forwardRef로 컴포넌트 감싸기
- [ ] ref 파라미터 SVG 태그에 전달
- [ ] TypeScript 타입 지원 (Ref<SVGSVGElement>)
- [ ] Svgr.node.ts에 옵션 추가
- [ ] 테스트 케이스 추가

### 1.3 memo 옵션
- [ ] React.memo로 컴포넌트 감싸기
- [ ] import 문에 memo 추가
- [ ] Svgr.node.ts에 옵션 추가
- [ ] 테스트 케이스 추가

### 1.4 replaceAttrValues 옵션
- [ ] Key-Value 매핑으로 속성값 대체
- [ ] 예: `#000` -> `currentColor`
- [ ] 예: `#fff` -> `{props.color}`
- [ ] n8n UI: fixedCollection 타입 사용
- [ ] 테스트 케이스 추가

---

## Phase 2: 확장 기능

### 2.1 svgProps 옵션
- [ ] SVG 태그에 추가 props 주입
- [ ] 예: `role="img"`, `aria-label`
- [ ] n8n UI: fixedCollection 타입 사용
- [ ] 테스트 케이스 추가

### 2.2 expandProps 옵션
- [ ] `start` | `end` | `false` 선택
- [ ] start: `<svg {...props} viewBox="...">`
- [ ] end: `<svg viewBox="..." {...props}>`
- [ ] false: props 스프레드 제거
- [ ] 테스트 케이스 추가

### 2.3 titleProp 옵션
- [ ] title, titleId props 지원
- [ ] `<title>` 요소 동적 생성
- [ ] aria-labelledby 속성 추가
- [ ] 테스트 케이스 추가

### 2.4 descProp 옵션
- [ ] desc, descId props 지원
- [ ] `<desc>` 요소 동적 생성
- [ ] aria-describedby 속성 추가
- [ ] 테스트 케이스 추가

---

## Phase 3: SVGO 모듈 분리

> 파일: `nodes/Svgr/svgo.ts`

SVGO 기능을 별도 모듈로 분리하여 관리

### 3.0 모듈 구조 설계
- [ ] `nodes/Svgr/svgo.ts` 파일 생성
- [ ] `SvgoOptions` 인터페이스 정의
- [ ] `optimizeSvg(svg: string, options: SvgoOptions): string` 메인 함수
- [ ] svgTransformer.ts에서 svgo.ts import
- [ ] 기존 removeAttributes 로직 svgo.ts로 이전

### 3.1 문서 정리 플러그인
- [ ] `removeDoctype` - `<!DOCTYPE>` 제거
- [ ] `removeXMLProcInst` - `<?xml ?>` 제거 (기존 로직 이전)
- [ ] `removeComments` - 주석 제거 (기존 로직 이전)
- [ ] `removeMetadata` - `<metadata>` 요소 제거
- [ ] `removeEditorsNSData` - 편집기 네임스페이스 제거 (Inkscape, Sketch, Illustrator)
- [ ] 테스트 케이스 추가

### 3.2 속성 정리 플러그인
- [ ] `cleanupAttrs` - 속성 값 공백/줄바꿈 정리
- [ ] `removeEmptyAttrs` - 빈 속성 제거 (`attr=""`)
- [ ] `removeUnusedNS` - 미사용 네임스페이스 제거 (기존 xmlns 로직 확장)
- [ ] `prefixIds` - ID/클래스에 접두사 추가 (충돌 방지)
- [ ] 테스트 케이스 추가

### 3.3 요소 제거 플러그인
- [ ] `removeTitle` - `<title>` 요소 제거
- [ ] `removeDesc` - `<desc>` 요소 제거
- [ ] `removeHiddenElems` - 숨겨진 요소 제거 (`display:none`, `visibility:hidden`)
- [ ] `removeEmptyContainers` - 빈 컨테이너 제거 (`<g>`, `<defs>`)
- [ ] `removeEmptyText` - 빈 `<text>` 요소 제거
- [ ] `removeUselessDefs` - 미참조 `<defs>` 내용 제거
- [ ] 테스트 케이스 추가

### 3.4 스타일 최적화 플러그인
- [ ] `convertColors` - 색상 최적화 (`#ff0000` → `red`, `#ffffff` → `#fff`)
- [ ] `minifyStyles` - CSS 압축
- [ ] `inlineStyles` - `<style>` 블록을 인라인으로 변환
- [ ] 테스트 케이스 추가

### 3.5 숫자/경로 최적화 플러그인
- [ ] `cleanupNumericValues` - 숫자 정밀도 최적화 (`0.5` → `.5`, `0px` → `0`)
- [ ] `convertPathData` - path d 속성 최적화 (선택적, 복잡)
- [ ] 테스트 케이스 추가

### 3.6 그룹 최적화 플러그인
- [ ] `collapseGroups` - 불필요한 `<g>` 제거
- [ ] `removeEmptyContainers` - 빈 그룹 제거
- [ ] 테스트 케이스 추가

---

## Phase 4: 추가 기능

### 4.1 native 옵션
- [ ] React Native SVG 호환 코드 생성
- [ ] `react-native-svg` import 문
- [ ] SVG 태그를 Svg 컴포넌트로 변환
- [ ] 하위 요소도 PascalCase로 변환 (path -> Path)
- [ ] 테스트 케이스 추가

### 4.2 exportType 옵션
- [ ] `default` | `named` 선택
- [ ] default: `export default Component`
- [ ] named: `export { Component }`
- [ ] 테스트 케이스 추가

---

## 참고 자료

- SVGR 공식 문서: https://react-svgr.com/docs/options/
- SVGR GitHub: https://github.com/gregberge/svgr
- SVGO GitHub: https://github.com/svg/svgo
