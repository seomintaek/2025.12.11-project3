import './style.css'
import { ProgressManager } from './progress.js'
import { initChatbot } from './chatbot.js'

// ============================================
// 미션 데이터
// ============================================

const missions = [
  {
    id: 1,
    title: '기초 회로 맛보기 🔋',
    objective: '아두이노 없이 건전지, LED, 저항만 연결해서 불을 켜보세요! (+, - 연결 이해하기)',
    hint: '건전지의 (+)극과 LED의 긴 다리를 연결하고, LED의 짧은 다리와 저항을 거쳐 건전지의 (-)극으로 연결하세요.',
    wokwiUrl: 'https://wokwi.com/projects/450645630910703617'
  },
  {
    id: 2,
    title: '아두이노 코딩 시작 💻',
    objective: '아두이노 13번 핀에 LED를 꽂고, 코드로 깜빡이게 제어해보세요.',
    hint: 'digitalWrite(13, HIGH);와 delay() 함수를 사용하여 LED를 켜고 끄세요.',
    wokwiUrl: 'https://wokwi.com/projects/450009305951296513'
  },
  {
    id: 3,
    title: '소리 만들기🎵',
    objective: '피에조 부저를 연결해서 \'도-레-미\' 소리를 내보세요.',
    hint: 'tone() 함수를 사용하여 주파수를 제어하세요. 도(262Hz), 레(294Hz), 미(330Hz)',
    wokwiUrl: 'https://wokwi.com/projects/450645789905252353'
  }
];

// ============================================
// DOM 요소
// ============================================

const missionList = document.getElementById('missionList');
const guideTitle = document.getElementById('guideTitle');
const guideObjective = document.getElementById('guideObjective');
const guideHint = document.getElementById('guideHint');
const wokwiSimulator = document.getElementById('wokwiSimulator');

// ============================================
// 미션 목록 렌더링
// ============================================

function renderMissionList() {
  missionList.innerHTML = '';
  
  missions.forEach(mission => {
    const missionButton = document.createElement('button');
    missionButton.className = 'mission-tab-button';
    missionButton.dataset.missionId = mission.id;
    // 이모지 추출
    const emojiMatch = mission.title.match(/[\u{1F300}-\u{1F9FF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '📋';
    const titleText = mission.title.replace(/[\u{1F300}-\u{1F9FF}]/u, '').trim();
    
    missionButton.innerHTML = `
      <span class="mission-tab-icon">${emoji}</span>
      <span class="mission-tab-text">${titleText}</span>
    `;
    
    missionButton.addEventListener('click', () => selectMission(mission.id));
    
    missionList.appendChild(missionButton);
  });
}

// ============================================
// 미션 선택 처리
// ============================================

function selectMission(missionId) {
  const mission = missions.find(m => m.id === missionId);
  if (!mission) return;

  // 모든 버튼에서 active 클래스 제거
  document.querySelectorAll('.mission-tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // 선택된 버튼에 active 클래스 추가
  const selectedButton = document.querySelector(`[data-mission-id="${missionId}"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }

  // 가이드 창 업데이트
  guideTitle.textContent = mission.title;
  guideObjective.textContent = mission.objective;
  guideHint.textContent = mission.hint || '힌트가 없습니다. 직접 시도해보세요!';

  // Wokwi 시뮬레이터 URL 업데이트
  wokwiSimulator.src = mission.wokwiUrl;
}

// ============================================
// 네비게이션 초기화
// ============================================

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const stageNum = parseInt(item.dataset.stage, 10);
    const currentPage = window.location.pathname.includes('practice.html') ? 3 : 0;
    
    if (stageNum === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ============================================
// 챗봇 초기화
// ============================================

function initChatbotModule() {
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSendButton = document.getElementById('chatbotSendButton');
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotLoading = document.getElementById('chatbotLoading');
  
  if (chatbotMessages && chatbotInput && chatbotSendButton && chatbotToggle && chatbotClose && chatbotWindow) {
    initChatbot({
      messagesContainer: chatbotMessages,
      inputElement: chatbotInput,
      sendButton: chatbotSendButton,
      toggleButton: chatbotToggle,
      closeButton: chatbotClose,
      windowElement: chatbotWindow,
      loadingIndicator: chatbotLoading,
      titleElement: document.getElementById('chatbotTitle'),
      clearButton: document.getElementById('chatbotClear'),
      systemRole: `너는 아두이노 코딩 선생님이야. 아두이노/브레드보드 회로 연결 및 코드 오류 수정을 도와주는 역할을 해.

중요한 가이드라인:
1. 학생이 회로 연결을 물어보면, 아두이노와 브레드보드 이미지를 활용하여 시각적으로 설명해줘. (이미지 경로: /sencors/arduino_uno.png, /sencors/breadboard.png)
2. 회로 연결 설명 시 핀 번호, 전원(VCC), 접지(GND), 저항 연결 등을 구체적으로 알려줘.
3. 코드 오류가 발생하면 에러 메시지를 분석하고, 어떤 부분이 문제인지 단계별로 설명해줘.
4. 코드를 보여줄 때는 각 줄마다 주석(//)으로 아주 친절하게 설명을 달아줘.
5. setup()(설정)과 loop()(반복)의 개념을 먼저 설명하고, 단계별로 코드를 작성하도록 도와줘.
6. 학생이 막혔을 때는 "어떤 부분이 어려운지 말해봐", "에러 메시지가 뭐라고 나와?"처럼 구체적인 질문을 해.
7. 실험 중 안전 수칙을 강조해줘.
8. 친절하고 격려하는 톤으로 대화하되, 학생이 스스로 이해할 수 있도록 단계별로 안내해.`,
      initialMessage: "어서 와, 여기는 실험실이야. 나는 **코딩 선생님**이고. 회로 연결이나 코드가 어려우면 언제든 물어봐!",
      storageKey: 'chat_history_PRACTICE'
    });
  }
}


// ============================================
// 초기화
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // 네비게이션 초기화
  initNavigation();
  
  // 미션 목록 렌더링
  renderMissionList();
  
  // 첫 번째 미션 자동 선택
  if (missions.length > 0) {
    selectMission(1);
  }
  
  // 챗봇 초기화
  initChatbotModule();
});
