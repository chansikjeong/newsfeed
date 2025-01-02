# 뉴스 피드 프로젝트

## 목차

- [뉴스 피드 프로젝트](#뉴스-피드-프로젝트)
  - [목차](#목차)
  - [프로젝트 개요](#프로젝트-개요)
  - [주요 기능](#주요-기능)
  - [폴더 구조](#폴더-구조)
  - [설치 및 실행 방법](#설치-및-실행-방법)
    - [1. 레포지토리 클론](#1-레포지토리-클론)
    - [2. 패키지 설치](#2-패키지-설치)
    - [3. 환경 변수 설정](#3-환경-변수-설정)
    - [4. 데이터베이스 설정](#4-데이터베이스-설정)
    - [5. 서버 실행](#5-서버-실행)
  - [협업 및 회고](#협업-및-회고)
    - [협업 과정](#협업-과정)
    - [회고](#회고)

## 프로젝트 개요

**뉴스 피드 프로젝트**뉴스 피드란? 내 게시물을 포함한 모든 게시물을 볼 수 있는 공간으로. 게시글을 업로드하고 다른 사람의 게시물을 보며 정보를 취득하고 교류하는
허브 공간 웹사이트입니다.

## 주요 기능

- 이메일인증 기능
- 소셜 로그인 기능
- 게시글, 프로필 이미지 업로드 기능

## 폴더 구조

```
newsfeed-project
├── node_modules
├── prisma
│    ├── migrations
│    └── schema.prisma
├── src
│   ├── middlewares
│   │   ├── authorization.js
│   │   ├── errorHandler.js
│   │   └── s3upload.js
│   ├── public
│   │   ├── css
│   │   │   └── style.css
│   │   ├── js
│   │   │   ├── login.js
│   │   │   ├── main.js
│   │   │   ├── post-get.js
│   │   │   ├── post.js
│   │   │   ├── profile.js
│   │   │   └── signUp.js
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── postcreate.html
│   │   ├── postget.html
│   │   ├── profile.html
│   │   └── signUp.html
│   ├──
│   ├── routes
│   │   ├── comments.router.js
│   │   ├── getPosts.router.js
│   │   ├── like.router.js
│   │   ├── post.router.js
│   │   ├── profile.router.js
│   │   ├── user.router.js
│   ├── utils
│   │   └── prisma
│   │       └── index.js
│   └── validations
│       ├── comments.validator.js
        └── user.validator.js
└── app.js
```

## 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
git clone git@github.com:chansikjeong/newsfeed.git
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일 생성 후, 아래 항목 설정:

```
DATABASE_URL=mysql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<your_jwt_secret>
```

### 4. 데이터베이스 설정

```bash
npx prisma migrate dev --name <마이그레이션 이름>
```

### 5. 서버 실행

```bash
npm run dev
```

## 협업 및 회고

### 협업 과정

- 기초 게임 기획 및 와이어프레임 설계
- ERD 설계 및 테이블 스키마 작성
- 역할 분담 후 GitHub를 이용한 PR 기반 협업
- Insomnia를 활용한 주요 기능 테스트
- 프론트 생성 및 기능 구현
- 최종 PR(Merge) 후 전체적인 테스트 진행

### 회고

이 프로젝트는 기획부터 개발, 테스트까지 팀원들과 함께하며 협업의 중요성을 느낄 수 있었습니다. 초기 설계 단계에서 같이 그림을 그려가며, 각자의 맡은 역할을 충실히 수행하였습니다. 코드 리뷰와 테스트 과정을 통해 문제를 빠르게 해결하고 효율적으로 작업할 수 있었습니다.

- **성공**: 원활한 소통으로 처음에 목표로 했던 결과물을 도출할 수 있었습니다.
- **아쉬운 점**: 테이블 스키마 설계가 부족해 개발 중간에 몇 차례 수정이 필요했던 점이 아쉬웠습니다.
- **배운 점**: 초기 설계의 중요성과 명확한 역할 분담의 필요성을 느꼈고, 지속적인 팀원 간의 소통의 중요성에 대해 배웠습니다.
