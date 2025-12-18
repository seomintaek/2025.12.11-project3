import './style.css'
import { ProgressManager } from './progress.js'

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
// 아두이노 전문가 챗봇
// ============================================

// 챗봇 설정
const CHATBOT_CONFIG = {
  systemRole: `당신은 중학생을 위한 아두이노 전문가입니다. Wokwi 시뮬레이터의 회로 연결 문제와 코드 에러를 친절하게 해결해줍니다.`,
  initialMessage: "안녕! 아두이노 실험 중에 막히는 게 있으면 물어봐!",
  storageKey: 'chat_history_practice'
};

// DOM 요소
let chatbotMessages, chatbotInput, chatbotSendButton, chatbotToggle, chatbotClose, chatbotWindow, chatbotLoading, chatbotClear;
let apiStatusBar, apiStatusText;

// API Key 로드 및 상태 확인
function getApiKey() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return apiKey || null;
}

function updateApiStatus() {
  const apiKey = getApiKey();
  if (apiKey) {
    apiStatusBar.className = 'api-status-bar api-status-connected';
    apiStatusText.textContent = '🟢 API Key 연결됨';
  } else {
    apiStatusBar.className = 'api-status-bar api-status-disconnected';
    apiStatusText.textContent = '🔴 API Key 없음';
  }
}

// 대화 기록 로드
function loadHistory() {
  try {
    const stored = localStorage.getItem(CHATBOT_CONFIG.storageKey);
    if (stored) {
      const history = JSON.parse(stored);
      // 시스템 프롬프트 강제 업데이트
      if (history.length > 0 && history[0].role === 'system') {
        history[0].content = CHATBOT_CONFIG.systemRole;
      } else {
        history.unshift({ role: 'system', content: CHATBOT_CONFIG.systemRole });
      }
      return history;
    }
  } catch (error) {
    console.error('대화 기록 로드 실패:', error);
  }
  // 새 대화 시작
  return [{ role: 'system', content: CHATBOT_CONFIG.systemRole }];
}

// 대화 기록 저장
function saveHistory(history) {
  try {
    localStorage.setItem(CHATBOT_CONFIG.storageKey, JSON.stringify(history));
  } catch (error) {
    console.error('대화 기록 저장 실패:', error);
  }
}

// 메시지 추가
function addMessage(sender, text, scroll = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${sender}-message`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = text;
  
  messageDiv.appendChild(bubbleDiv);
  chatbotMessages.appendChild(messageDiv);
  
  if (scroll) {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}

// 로딩 말풍선 추가
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chatbot-message ai-message loading-message';
  messageDiv.id = 'loadingMessage';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  
  const loadingDots = document.createElement('div');
  loadingDots.className = 'loading-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    loadingDots.appendChild(dot);
  }
  
  bubbleDiv.appendChild(loadingDots);
  messageDiv.appendChild(bubbleDiv);
  chatbotMessages.appendChild(messageDiv);
  
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  
  return messageDiv;
}

// 로딩 말풍선 제거
function removeLoadingMessage() {
  const loadingMsg = document.getElementById('loadingMessage');
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

// 대화 기록 렌더링
function renderHistory() {
  chatbotMessages.innerHTML = '';
  const history = loadHistory();
  
  // 시스템 메시지 제외하고 렌더링
  const userMessages = history.filter(msg => msg.role !== 'system');
  
  if (userMessages.length === 0) {
    // 초기 인사말 표시
    addMessage('ai', CHATBOT_CONFIG.initialMessage);
  } else {
    // 저장된 대화 표시
    userMessages.forEach(msg => {
      addMessage(msg.role === 'user' ? 'user' : 'ai', msg.content, false);
    });
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}

// OpenAI API 호출
async function getAIResponse(userMessage) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  // 대화 기록 불러오기
  let history = loadHistory();
  
  // 사용자 메시지 추가
  history.push({ role: 'user', content: userMessage });
  
  // 최대 10개 메시지만 유지 (시스템 메시지 제외)
  const systemMsg = history[0];
  const otherMessages = history.slice(1);
  const recentMessages = otherMessages.slice(-10);
  const trimmedHistory = [systemMsg, ...recentMessages];

  // API 호출
  let response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: trimmedHistory,
        temperature: 0.7,
        max_tokens: 500
      })
    });
  } catch (fetchError) {
    console.error('[practice.js] Fetch 오류:', {
      name: fetchError.name,
      message: fetchError.message,
      stack: fetchError.stack
    });
    
    // 네트워크 오류인지 확인
    if (fetchError.name === 'TypeError' && (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError'))) {
      throw new Error('네트워크 오류: API 서버에 연결할 수 없습니다. CSP 설정과 네트워크 연결을 확인해주세요.');
    }
    throw fetchError;
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
    }
    throw new Error(errorData.error?.message || `API 요청 실패 (${response.status})`);
  }

  const data = await response.json();
  const aiMessage = data.choices[0].message.content;
  
  // 대화 기록 업데이트 및 저장
  trimmedHistory.push({ role: 'assistant', content: aiMessage });
  saveHistory(trimmedHistory);
  
  return aiMessage;
}

// 메시지 전송
async function sendMessage() {
  const message = chatbotInput.value.trim();
  if (!message) return;
  
  // 사용자 메시지 UI에 추가
  addMessage('user', message);
  
  // 입력창 초기화 및 비활성화
  chatbotInput.value = '';
  chatbotInput.disabled = true;
  chatbotSendButton.disabled = true;
  
  // 로딩 말풍선 추가
  addLoadingMessage();
  
  try {
    const aiMessage = await getAIResponse(message);
    // 로딩 말풍선 제거
    removeLoadingMessage();
    // 실제 답변 추가
    addMessage('ai', aiMessage);
  } catch (error) {
    console.error('챗봇 오류:', error);
    // 로딩 말풍선 제거 (에러 발생 시에도)
    removeLoadingMessage();
    // 에러 메시지 추가
    const errorMsg = error.message.includes('API 키') 
      ? 'API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.'
      : `죄송해요. 오류가 발생했어요. 다시 시도해주세요. 😢\n오류: ${error.message}`;
    addMessage('ai', errorMsg);
  } finally {
    // 로딩 말풍선이 남아있으면 제거 (안전장치)
    removeLoadingMessage();
    // 기존 loadingIndicator 숨기기 (하위 호환성)
    if (chatbotLoading) {
      chatbotLoading.style.display = 'none';
    }
    chatbotInput.disabled = false;
    chatbotSendButton.disabled = false;
    chatbotInput.focus();
  }
}

// 대화 초기화
function clearHistory() {
  if (confirm('대화 내용을 지울까요?')) {
    localStorage.removeItem(CHATBOT_CONFIG.storageKey);
    renderHistory();
  }
}

// 챗봇 토글
function toggleChatbot() {
  chatbotWindow.classList.toggle('hidden');
}

// 챗봇 닫기
function closeChatbot() {
  chatbotWindow.classList.add('hidden');
}

// 챗봇 초기화
function initChatbot() {
  // DOM 요소 가져오기
  chatbotMessages = document.getElementById('chatbotMessages');
  chatbotInput = document.getElementById('chatbotInput');
  chatbotSendButton = document.getElementById('chatbotSendButton');
  chatbotToggle = document.getElementById('chatbotToggle');
  chatbotClose = document.getElementById('chatbotClose');
  chatbotWindow = document.getElementById('chatbotWindow');
  chatbotLoading = document.getElementById('chatbotLoading');
  chatbotClear = document.getElementById('chatbotClear');
  apiStatusBar = document.getElementById('apiStatusBar');
  apiStatusText = document.getElementById('apiStatusText');
  
  if (!chatbotMessages || !chatbotInput || !chatbotSendButton) {
    console.error('챗봇 DOM 요소를 찾을 수 없습니다.');
    return;
  }
  
  // API 상태 업데이트
  updateApiStatus();
  
  // 이벤트 리스너 등록
  chatbotSendButton.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', toggleChatbot);
  }
  
  if (chatbotClose) {
    chatbotClose.addEventListener('click', closeChatbot);
  }
  
  if (chatbotClear) {
    chatbotClear.addEventListener('click', clearHistory);
  }
  
  // 대화 기록 렌더링
  renderHistory();
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
  initChatbot();
});
