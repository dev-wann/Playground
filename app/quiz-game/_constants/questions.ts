import type { Category, Difficulty, Question } from "../_types";

type QuestionPool = Record<Category, Record<Difficulty, Question[]>>;

export const QUESTION_POOL: QuestionPool = {
  general: {
    easy: [
      {
        q: "세계에서 가장 높은 산은?",
        options: ["에베레스트", "K2", "킬리만자로", "몽블랑"],
        answer: 0,
      },
      {
        q: "1년은 몇 개월인가?",
        options: ["10개월", "11개월", "12개월", "13개월"],
        answer: 2,
      },
      {
        q: "태양계에서 가장 큰 행성은?",
        options: ["토성", "목성", "해왕성", "천왕성"],
        answer: 1,
      },
      { q: "물의 화학식은?", options: ["CO2", "H2O", "O2", "NaCl"], answer: 1 },
      {
        q: "무지개는 몇 가지 색으로 이루어져 있나?",
        options: ["5가지", "6가지", "7가지", "8가지"],
        answer: 2,
      },
    ],
    normal: [
      {
        q: "세계에서 가장 긴 강은?",
        options: ["아마존강", "나일강", "양쯔강", "미시시피강"],
        answer: 1,
      },
      {
        q: "올림픽은 몇 년마다 개최되는가?",
        options: ["2년", "3년", "4년", "5년"],
        answer: 2,
      },
      {
        q: "UN 본부가 위치한 도시는?",
        options: ["제네바", "파리", "뉴욕", "런던"],
        answer: 2,
      },
      {
        q: "인체에서 가장 큰 장기는?",
        options: ["간", "폐", "피부", "심장"],
        answer: 2,
      },
      {
        q: "세계에서 가장 많이 사용되는 언어는?",
        options: ["영어", "스페인어", "중국어", "힌디어"],
        answer: 2,
      },
    ],
    hard: [
      {
        q: "노벨상을 만든 알프레드 노벨이 발명한 것은?",
        options: ["전구", "다이너마이트", "전화기", "증기기관"],
        answer: 1,
      },
      {
        q: "국제우주정거장(ISS)의 궤도 고도는 약 몇 km인가?",
        options: ["200km", "400km", "800km", "1200km"],
        answer: 1,
      },
      {
        q: "세계에서 가장 큰 사막은?",
        options: ["사하라 사막", "고비 사막", "남극 사막", "아라비아 사막"],
        answer: 2,
      },
      {
        q: "'GDP'는 무엇의 약자인가?",
        options: [
          "Gross Domestic Product",
          "General Development Plan",
          "Global Data Protocol",
          "Government Deficit Program",
        ],
        answer: 0,
      },
      {
        q: "인체의 뼈는 총 몇 개인가?",
        options: ["186개", "196개", "206개", "216개"],
        answer: 2,
      },
    ],
  },
  science: {
    easy: [
      {
        q: "지구에서 달까지의 거리는 약 얼마인가?",
        options: ["38만 km", "380만 km", "3800만 km", "3억 8천만 km"],
        answer: 0,
      },
      {
        q: "소금의 화학식은?",
        options: ["NaCl", "KCl", "CaCl2", "MgCl2"],
        answer: 0,
      },
      {
        q: "빛의 3원색이 아닌 것은?",
        options: ["빨강", "초록", "파랑", "노랑"],
        answer: 3,
      },
      {
        q: "공기 중 가장 많은 기체는?",
        options: ["산소", "질소", "이산화탄소", "아르곤"],
        answer: 1,
      },
      {
        q: "물이 끓는 온도는? (1기압 기준)",
        options: ["90°C", "95°C", "100°C", "105°C"],
        answer: 2,
      },
    ],
    normal: [
      {
        q: "DNA의 이중나선 구조를 발견한 과학자는?",
        options: ["아인슈타인", "왓슨과 크릭", "다윈", "멘델"],
        answer: 1,
      },
      {
        q: "광합성에서 필요하지 않은 것은?",
        options: ["빛", "물", "이산화탄소", "산소"],
        answer: 3,
      },
      {
        q: "원자번호 1번 원소는?",
        options: ["헬륨", "수소", "리튬", "탄소"],
        answer: 1,
      },
      {
        q: "소리가 전달되지 않는 곳은?",
        options: ["물속", "공기 중", "진공", "금속 내부"],
        answer: 2,
      },
      {
        q: "뉴턴의 운동 제2법칙의 공식은?",
        options: ["F=mv", "F=ma", "F=mg", "F=mc²"],
        answer: 1,
      },
    ],
    hard: [
      {
        q: "플랑크 상수의 단위는?",
        options: ["J·s", "J/s", "kg·m/s", "N·m"],
        answer: 0,
      },
      {
        q: "인간 게놈에는 약 몇 개의 유전자가 있는가?",
        options: ["약 5천 개", "약 2만 개", "약 10만 개", "약 50만 개"],
        answer: 1,
      },
      {
        q: "절대영도는 섭씨 몇 도인가?",
        options: ["-173.15°C", "-273.15°C", "-373.15°C", "-473.15°C"],
        answer: 1,
      },
      {
        q: "빛의 속도는 약 초속 몇 km인가?",
        options: ["약 10만 km", "약 20만 km", "약 30만 km", "약 40만 km"],
        answer: 2,
      },
      {
        q: "슈뢰딩거 방정식이 설명하는 것은?",
        options: ["전자기파", "양자역학적 상태", "상대성 이론", "열역학"],
        answer: 1,
      },
    ],
  },
  history: {
    easy: [
      {
        q: "한글을 창제한 왕은?",
        options: ["태종", "세종대왕", "성종", "영조"],
        answer: 1,
      },
      {
        q: "제2차 세계대전이 끝난 해는?",
        options: ["1943년", "1944년", "1945년", "1946년"],
        answer: 2,
      },
      {
        q: "고려를 건국한 사람은?",
        options: ["왕건", "이성계", "견훤", "궁예"],
        answer: 0,
      },
      {
        q: "피라미드가 있는 나라는?",
        options: ["인도", "이집트", "그리스", "터키"],
        answer: 1,
      },
      {
        q: "대한민국의 광복절은 몇 월 며칠인가?",
        options: ["3월 1일", "6월 25일", "8월 15일", "10월 3일"],
        answer: 2,
      },
    ],
    normal: [
      {
        q: "임진왜란이 발생한 해는?",
        options: ["1492년", "1592년", "1692년", "1792년"],
        answer: 1,
      },
      {
        q: "프랑스 대혁명이 일어난 해는?",
        options: ["1776년", "1789년", "1804년", "1815년"],
        answer: 1,
      },
      {
        q: "조선의 마지막 왕은?",
        options: ["고종", "순종", "철종", "헌종"],
        answer: 1,
      },
      {
        q: "로마 제국이 동서로 분열된 해는?",
        options: ["295년", "395년", "495년", "595년"],
        answer: 1,
      },
      {
        q: "삼국 중 가장 먼저 멸망한 나라는?",
        options: ["고구려", "백제", "신라", "가야"],
        answer: 1,
      },
    ],
    hard: [
      {
        q: "갑오개혁이 실시된 해는?",
        options: ["1884년", "1894년", "1904년", "1910년"],
        answer: 1,
      },
      {
        q: "백년전쟁의 기간은?",
        options: ["1237~1337년", "1337~1453년", "1453~1553년", "1553~1653년"],
        answer: 1,
      },
      {
        q: "동학농민운동의 지도자는?",
        options: ["김옥균", "전봉준", "안중근", "유관순"],
        answer: 1,
      },
      {
        q: "마그나 카르타가 서명된 해는?",
        options: ["1115년", "1215년", "1315년", "1415년"],
        answer: 1,
      },
      {
        q: "6·25 전쟁의 정전협정이 체결된 해는?",
        options: ["1951년", "1952년", "1953년", "1954년"],
        answer: 2,
      },
    ],
  },
  geography: {
    easy: [
      {
        q: "세계에서 가장 넓은 나라는?",
        options: ["캐나다", "미국", "중국", "러시아"],
        answer: 3,
      },
      {
        q: "대한민국의 수도는?",
        options: ["부산", "인천", "서울", "대전"],
        answer: 2,
      },
      {
        q: "일본의 수도는?",
        options: ["오사카", "도쿄", "교토", "나고야"],
        answer: 1,
      },
      {
        q: "가장 넓은 대양은?",
        options: ["대서양", "인도양", "태평양", "북극해"],
        answer: 2,
      },
      {
        q: "호주의 수도는?",
        options: ["시드니", "멜버른", "캔버라", "브리즈번"],
        answer: 2,
      },
    ],
    normal: [
      {
        q: "아프리카에서 가장 큰 나라는?",
        options: ["나이지리아", "이집트", "남아공", "알제리"],
        answer: 3,
      },
      {
        q: "세계에서 가장 깊은 호수는?",
        options: ["카스피해", "바이칼호", "빅토리아호", "미시간호"],
        answer: 1,
      },
      {
        q: "적도가 지나지 않는 나라는?",
        options: ["브라질", "케냐", "인도네시아", "이집트"],
        answer: 3,
      },
      {
        q: "한반도의 최고봉은?",
        options: ["한라산", "지리산", "설악산", "백두산"],
        answer: 3,
      },
      {
        q: "세계에서 가장 인구가 많은 나라는? (2024 기준)",
        options: ["중국", "인도", "미국", "인도네시아"],
        answer: 1,
      },
    ],
    hard: [
      {
        q: "마리아나 해구의 최대 깊이는 약 얼마인가?",
        options: ["약 8,000m", "약 9,000m", "약 11,000m", "약 13,000m"],
        answer: 2,
      },
      {
        q: "세계에서 가장 긴 산맥은?",
        options: ["히말라야", "록키", "안데스", "알프스"],
        answer: 2,
      },
      {
        q: "사해(Dead Sea)의 해발 고도는 약?",
        options: ["-200m", "-430m", "-600m", "-800m"],
        answer: 1,
      },
      {
        q: "내륙국이 아닌 나라는?",
        options: ["몽골", "스위스", "볼리비아", "콜롬비아"],
        answer: 3,
      },
      {
        q: "세계에서 가장 작은 나라는?",
        options: ["모나코", "산마리노", "바티칸", "리히텐슈타인"],
        answer: 2,
      },
    ],
  },
  culture: {
    easy: [
      {
        q: "'모나리자'를 그린 화가는?",
        options: ["미켈란젤로", "레오나르도 다빈치", "라파엘로", "렘브란트"],
        answer: 1,
      },
      {
        q: "'해리 포터' 시리즈의 작가는?",
        options: ["J.R.R. 톨킨", "C.S. 루이스", "J.K. 롤링", "로알드 달"],
        answer: 2,
      },
      {
        q: "올림픽의 상징 링 개수는?",
        options: ["3개", "4개", "5개", "6개"],
        answer: 2,
      },
      {
        q: "피아노의 건반 수는 보통 몇 개인가?",
        options: ["76개", "82개", "88개", "92개"],
        answer: 2,
      },
      {
        q: "한국의 전통 음악을 무엇이라 하는가?",
        options: ["가야금", "판소리", "국악", "사물놀이"],
        answer: 2,
      },
    ],
    normal: [
      {
        q: "'별이 빛나는 밤'을 그린 화가는?",
        options: ["모네", "고흐", "르누아르", "세잔"],
        answer: 1,
      },
      {
        q: "셰익스피어의 4대 비극이 아닌 것은?",
        options: ["햄릿", "오셀로", "맥베스", "로미오와 줄리엣"],
        answer: 3,
      },
      {
        q: "베토벤의 교향곡 9번의 별명은?",
        options: ["운명", "전원", "합창", "영웅"],
        answer: 2,
      },
      {
        q: "UNESCO 세계문화유산에 등재된 한국 유산이 아닌 것은?",
        options: ["불국사", "수원 화성", "경복궁", "종묘"],
        answer: 2,
      },
      {
        q: "르네상스가 시작된 나라는?",
        options: ["프랑스", "이탈리아", "독일", "영국"],
        answer: 1,
      },
    ],
    hard: [
      {
        q: "'게르니카'를 그린 화가는?",
        options: ["달리", "피카소", "마티스", "몬드리안"],
        answer: 1,
      },
      {
        q: "일본의 전통 연극 '가부키'가 시작된 시대는?",
        options: ["헤이안 시대", "가마쿠라 시대", "에도 시대", "메이지 시대"],
        answer: 2,
      },
      {
        q: "바흐의 '평균율 클라비어 곡집'에 수록된 곡 수는?",
        options: ["24곡", "36곡", "48곡", "60곡"],
        answer: 2,
      },
      {
        q: "현존하는 세계 최고(最古)의 소설로 알려진 작품은?",
        options: ["일리아드", "겐지모노가타리", "데카메론", "돈키호테"],
        answer: 1,
      },
      {
        q: "'인상주의'라는 용어의 유래가 된 작품은?",
        options: ["수련", "인상, 해돋이", "풀밭 위의 점심", "별이 빛나는 밤"],
        answer: 1,
      },
    ],
  },
  it: {
    easy: [
      {
        q: "HTML은 무엇의 약자인가?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Main Link",
          "Home Tool Markup Language",
        ],
        answer: 0,
      },
      {
        q: "인터넷의 www는 무엇의 약자인가?",
        options: [
          "World Wide Web",
          "Western Web World",
          "World Web Wide",
          "Wide World Web",
        ],
        answer: 0,
      },
      {
        q: "1바이트는 몇 비트인가?",
        options: ["4비트", "8비트", "16비트", "32비트"],
        answer: 1,
      },
      {
        q: "CPU는 무엇의 약자인가?",
        options: [
          "Central Process Unit",
          "Central Processing Unit",
          "Computer Personal Unit",
          "Core Processing Unit",
        ],
        answer: 1,
      },
      {
        q: "안드로이드 운영체제를 만든 회사는?",
        options: ["애플", "마이크로소프트", "구글", "삼성"],
        answer: 2,
      },
    ],
    normal: [
      {
        q: "Git에서 원격 저장소의 변경사항을 가져오는 명령어는?",
        options: ["git push", "git pull", "git commit", "git merge"],
        answer: 1,
      },
      {
        q: "OSI 모델은 몇 계층으로 구성되어 있는가?",
        options: ["4계층", "5계층", "7계층", "8계층"],
        answer: 2,
      },
      {
        q: "HTTP의 기본 포트 번호는?",
        options: ["21", "22", "80", "443"],
        answer: 2,
      },
      {
        q: "SQL에서 데이터를 조회하는 명령어는?",
        options: ["INSERT", "UPDATE", "DELETE", "SELECT"],
        answer: 3,
      },
      {
        q: "프로그래밍에서 'API'는 무엇의 약자인가?",
        options: [
          "Application Programming Interface",
          "Advanced Program Integration",
          "Automated Process Input",
          "Application Process Integration",
        ],
        answer: 0,
      },
    ],
    hard: [
      {
        q: "TCP와 UDP의 차이점으로 올바른 것은?",
        options: [
          "TCP는 비연결형이다",
          "UDP는 신뢰성을 보장한다",
          "TCP는 3-way handshake를 사용한다",
          "UDP는 순서를 보장한다",
        ],
        answer: 2,
      },
      {
        q: "빅오 표기법에서 O(n log n)의 대표적인 정렬 알고리즘은?",
        options: ["버블 정렬", "삽입 정렬", "병합 정렬", "선택 정렬"],
        answer: 2,
      },
      {
        q: "REST API에서 멱등성(Idempotent)을 보장하지 않는 HTTP 메서드는?",
        options: ["GET", "PUT", "POST", "DELETE"],
        answer: 2,
      },
      {
        q: "Docker 컨테이너와 가상머신(VM)의 차이로 올바른 것은?",
        options: [
          "컨테이너는 하이퍼바이저를 사용한다",
          "VM은 호스트 OS 커널을 공유한다",
          "컨테이너는 호스트 OS 커널을 공유한다",
          "둘 다 동일한 방식으로 동작한다",
        ],
        answer: 2,
      },
      {
        q: "CAP 정리에서 동시에 만족할 수 없는 세 가지 속성은?",
        options: [
          "Consistency, Availability, Partition tolerance",
          "Capacity, Accuracy, Performance",
          "Concurrency, Atomicity, Persistence",
          "Caching, Authentication, Processing",
        ],
        answer: 0,
      },
    ],
  },
};
