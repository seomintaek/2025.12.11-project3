/**
 * 만능 멘토 챗봇 모듈
 * 페이지별로 다른 역할을 하는 챗봇을 제공하며, 각 페이지별로 독립된 대화 맥락을 유지합니다.
 */

// 페이지별 페르소나 (System Prompts)
const PERSONAS = {
  // 메인 페이지: 감성 케어 봇 (다정한 단짝 친구)
  friend: {
    systemPrompt: `너는 학생의 다정한 단짝 친구야. 이름은 "감성 케어 봇"이고, 프로젝트 시작 전에 학생의 기분을 물어보고 공감해주는 역할을 해.

중요한 가이드라인:
1. 첫 인사는 "안녕! 메이커스 튜터에 온 걸 환영해. 😊 본격적으로 시작하기 전에, 오늘 네 기분은 좀 어때?" 처럼 가볍고 다정하게 시작해.
2. 기술적인 이야기는 먼저 꺼내지 마. 일상적인 대화에 집중해.
3. 사용자가 "우울해"라고 하면 "아, 힘들었구나. 그런 기분도 괜찮아. 나도 네 편이야. 오늘은 조금 쉬면서 시작해도 돼. 🌈"처럼 위로하고 공감해줘.
4. 사용자가 "신나"라고 하면 "와! 그 기분 좋은 에너지로 오늘 멋진 걸 만들어보자! 🚀"처럼 격려하고 학습으로 자연스럽게 유도해줘.
5. 이모지를 많이 사용해서(🌈, ✨, 🍀, 💫, 🌟) 밝고 따뜻한 분위기를 만들어줘.
6. 대화가 충분히 무르익으면 자연스럽게 "자, 이제 기분 좋게 발명하러 가볼까? 아래 메뉴에서 원하는 걸 골라봐! 🚀"라고 안내해줘.
7. 항상 긍정적이고 따뜻한 톤으로 대화해.`,
    welcomeMessage: "안녕! 메이커스 튜터에 온 걸 환영해. 😊 본격적으로 시작하기 전에, 오늘 네 기분은 좀 어때?",
    title: '🍀 감성 케어 봇',
    storageKey: 'chat_main'
  },
  
  // 1페이지: 센서 도서관 (센서 박사)
  sensors: {
    systemPrompt: `너는 센서 박사 챗봇이야. 학생들이 기본 12종 센서를 배운 후, 더 깊이 있는 학습을 도와주는 역할을 해.

중요한 가이드라인:
1. 기본 12종 센서(LED, 버튼, 조도센서, 초음파센서, 서보모터, DC모터, 피에조부저, 가변저항, 틸트센서, 적외선센서, 슬라이드 스위치, 저항)에 대한 심화 설명을 제공해.
2. 기본 12종 외에도 세상에는 정말 신기한 센서가 많다는 것을 알려줘. 예: 가스 센서, 자이로 센서, 압력 센서, 근접 센서, 적외선 거리 센서, 온도 센서, 습도 센서, 초음파 거리 센서 등.
3. 학생이 "가스 센서가 뭐야?"처럼 특수 센서를 물어보면, 그 센서의 원리, 사용 예시, 아두이노 연결 방법을 친절하게 설명해줘.
4. 설명은 중학생이 이해하기 쉽게, 친절하고 격려하는 톤으로 대화해.
5. 드래그 게임에 대한 힌트도 제공해줘. 학생이 막혔을 때 도움을 줄 수 있어.
6. "기본 12종 외에도 세상에는 정말 신기한 센서가 많아! 궁금한 센서 이름을 말해봐."라는 안내를 자연스럽게 해줘.`,
    welcomeMessage: "안녕? 나는 센서 박사란다. 12가지 센서나 다른 신기한 센서들에 대해 무엇이든 물어보렴!",
    title: '📚 센서 박사',
    storageKey: 'chat_sensors'
  },
  
  // 2페이지: 아이디어 톡 (아이디어 뱅크)
  idea: {
    systemPrompt: `너는 아이디어 뱅크 챗봇이야. 학생들이 앞서 배운 12종 센서를 활용하여 구체적인 제품 아이디어를 제안하는 조력자 역할을 해.

중요한 가이드라인:
1. 반드시 기본 12종 센서 중 무엇을 써야 할지 명확하게 알려줘. 센서 이름과 역할을 구체적으로 설명해.
2. 학생이 아이디어를 말하면, 그 아이디어를 실현하기 위해 필요한 센서들을 12종 중에서 골라서 추천해줘.
3. 예시: "🤖 쓰레기 먹는 로봇"이라면 → 초음파센서(장애물 감지), 서보모터(팔 움직임), DC모터(바퀴 이동), LED(상태 표시) 등을 추천.
4. 아이디어가 막연하면 구체적인 질문을 통해 아이디어를 구체화시켜줘. 예: "어떤 문제를 해결하고 싶어?", "어디서 사용할 거야?"
5. 창의적이고 실현 가능한 아이디어를 격려하고, 센서 조합을 제안해줘.
6. 하단 예시 블록(칩)을 활용해 "쓰레기통", "알람" 같은 키워드를 받아 구체적 구현법 제시.
7. 친절하고 열정적인 톤으로 대화해.`,
    welcomeMessage: "반가워! 나는 아이디어 뱅크야. 센서들로 어떤 멋진 물건을 만들고 싶니?",
    title: '💡 아이디어 뱅크',
    storageKey: 'chat_ideas'
  },
  
  // 3페이지: 미리보기 실험실 (아두이노 코딩 쌤)
  practice: {
    systemPrompt: `너는 아두이노 코딩 선생님이야. 아두이노/브레드보드 회로 연결 및 코드 오류 수정을 도와주는 역할을 해.

중요한 가이드라인:
1. 학생이 회로 연결을 물어보면, 아두이노와 브레드보드 이미지를 활용하여 시각적으로 설명해줘. (이미지 경로: /sencors/arduino_uno.png, /sencors/breadboard.png)
2. 회로 연결 설명 시 핀 번호, 전원(VCC), 접지(GND), 저항 연결 등을 구체적으로 알려줘.
3. 코드 오류가 발생하면 에러 메시지를 분석하고, 어떤 부분이 문제인지 단계별로 설명해줘.
4. 코드를 보여줄 때는 각 줄마다 주석(//)으로 아주 친절하게 설명을 달아줘.
5. setup()(설정)과 loop()(반복)의 개념을 먼저 설명하고, 단계별로 코드를 작성하도록 도와줘.
6. 학생이 막혔을 때는 "어떤 부분이 어려운지 말해봐", "에러 메시지가 뭐라고 나와?"처럼 구체적인 질문을 해.
7. 실험 중 안전 수칙을 강조해줘.
8. 친절하고 격려하는 톤으로 대화하되, 학생이 스스로 이해할 수 있도록 단계별로 안내해.`,
    welcomeMessage: "어서 와, 여기는 실험실이야. 나는 코딩 선생님이고. 회로 연결이나 코드가 어려우면 언제든 물어봐!",
    title: '🧪 아두이노 코딩 쌤',
    storageKey: 'chat_practice'
  }
};

// 챗봇 상태 관리 (페이지별로 독립적으로 관리)
let chatbotHistory = [];
let currentSystemRole = null; // 현재 페이지의 시스템 프롬프트
let currentInitialMessage = null; // 현재 페이지의 초기 메시지
let storageKey = null;
let messagesContainer = null;

// 최대 대화 기록 수 (5쌍 = 10개 메시지)
const MAX_HISTORY_LENGTH = 10;

/**
 * 현재 페이지에 맞는 페르소나를 감지하고 설정합니다.
 * @returns {Object} 페르소나 객체
 */
export function detectPersona() {
  const pathname = window.location.pathname;
  
  // 메인 페이지: index.html 또는 / -> 감성 케어 챗봇 (다정한 단짝 친구)
  if (pathname === '/' || pathname.endsWith('/') || pathname.includes('index.html')) {
    return PERSONAS.friend;
  }
  // 1페이지: sensors.html -> 센서 도서관 (센서 박사)
  else if (pathname.includes('sensors.html')) {
    return PERSONAS.sensors;
  } 
  // 2페이지: ideas.html -> 아이디어 톡 (아이디어 뱅크)
  else if (pathname.includes('ideas.html')) {
    return PERSONAS.idea;
  } 
  // 3페이지: practice.html -> 미리보기 실험실 (아두이노 코딩 전문가)
  else if (pathname.includes('practice.html')) {
    return PERSONAS.practice;
  }
  
  // 기본값: friend 페르소나
  return PERSONAS.friend;
}

/**
 * 페이지별 고유 저장소 키를 생성합니다.
 * @returns {string} localStorage 키
 */
function getStorageKey() {
  const pathname = window.location.pathname;
  
  // 메인 페이지: index.html 또는 / -> 감성 케어 챗봇
  if (pathname === '/' || pathname.endsWith('/') || pathname.includes('index.html')) {
    return 'chat_main';
  }
  // 1페이지: sensors.html -> 센서 도서관
  else if (pathname.includes('sensors.html')) {
    return 'chat_sensors';
  } 
  // 2페이지: ideas.html -> 아이디어 톡
  else if (pathname.includes('ideas.html')) {
    return 'chat_ideas';
  } 
  // 3페이지: practice.html -> 미리보기 실험실
  else if (pathname.includes('practice.html')) {
    return 'chat_practice';
  }
  
  // 기본값
  return 'chat_main';
}

/**
 * localStorage에서 대화 내역을 불러옵니다.
 * @returns {Array} 대화 내역 배열
 */
function loadHistory() {
  if (!storageKey) {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('대화 내역 불러오기 실패:', error);
  }
  return [];
}

/**
 * 대화 내역을 localStorage에 저장합니다.
 * 최근 10개(5쌍)만 유지하고 오래된 대화는 삭제합니다.
 */
function saveHistory() {
  if (!storageKey) {
    return;
  }
  
  try {
    // 최대 길이 제한: 오래된 메시지부터 삭제
    while (chatbotHistory.length > MAX_HISTORY_LENGTH) {
      chatbotHistory.shift();
    }
    
    localStorage.setItem(storageKey, JSON.stringify(chatbotHistory));
  } catch (error) {
    console.error('대화 내역 저장 실패:', error);
  }
}

/**
 * 저장된 대화 내역을 UI에 복원합니다.
 */
function renderHistory(container) {
  if (!container) return;
  
  // 기존 메시지 모두 제거 (환영 메시지 제외)
  const welcomeMessage = container.querySelector('.chatbot-message.ai-message:first-child');
  container.innerHTML = '';
  
  // 환영 메시지 다시 추가
  if (welcomeMessage) {
    container.appendChild(welcomeMessage);
  } else {
    // 환영 메시지가 없으면 새로 생성
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'chatbot-message ai-message';
    const cleanedInitialMessage = cleanMarkdown(currentInitialMessage || '안녕하세요! 무엇을 도와드릴까요?');
    welcomeDiv.innerHTML = `
      <div class="message-bubble">
        ${cleanedInitialMessage}
      </div>
    `;
    container.appendChild(welcomeDiv);
  }
  
  // 저장된 대화 내역을 UI에 복원 (시스템 메시지는 제외)
  chatbotHistory.forEach((msg) => {
    // 시스템 메시지는 UI에 표시하지 않음 (API 전용)
    if (msg.role === 'system') {
      return;
    }
    addMessage(container, msg.role === 'user' ? 'user' : 'ai', msg.content, false);
  });
  
  // 스크롤을 맨 아래로
  container.scrollTop = container.scrollHeight;
}

/**
 * 대화 내역을 초기화합니다.
 * @param {HTMLElement} container - 메시지 컨테이너 (선택사항, 없으면 전역 messagesContainer 사용)
 * @param {string} initialMessage - 초기 환영 메시지 (필수)
 */
export function clearHistory(container, initialMessage) {
  // 현재 페이지의 storageKey만 삭제
  if (storageKey) {
    localStorage.removeItem(storageKey);
  }
  
  // 대화 기록 초기화
  chatbotHistory = [];
  
  const targetContainer = container || messagesContainer;
  
  // UI 초기화
  if (targetContainer) {
    targetContainer.innerHTML = '';
    
    // 초기 메시지 다시 추가
    if (initialMessage) {
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'chatbot-message ai-message';
      const cleanedInitialMessage = cleanMarkdown(initialMessage);
      welcomeDiv.innerHTML = `
        <div class="message-bubble">
          ${cleanedInitialMessage}
        </div>
      `;
      targetContainer.appendChild(welcomeDiv);
      
      // 스크롤을 맨 아래로
      targetContainer.scrollTop = targetContainer.scrollHeight;
    }
  }
}

/**
 * 챗봇을 초기화합니다.
 * @param {Object} options - 초기화 옵션
 * @param {HTMLElement} options.messagesContainer - 메시지 컨테이너 요소
 * @param {HTMLElement} options.inputElement - 입력 필드 요소
 * @param {HTMLElement} options.sendButton - 전송 버튼 요소
 * @param {HTMLElement} options.toggleButton - 토글 버튼 요소 (선택사항)
 * @param {HTMLElement} options.closeButton - 닫기 버튼 요소 (선택사항)
 * @param {HTMLElement} options.windowElement - 챗봇 창 요소 (선택사항)
 * @param {HTMLElement} options.loadingIndicator - 로딩 표시 요소 (선택사항)
 * @param {HTMLElement} options.titleElement - 제목 요소 (선택사항)
 * @param {HTMLElement} options.clearButton - 대화 지우기 버튼 요소 (선택사항)
 * @param {string} options.systemRole - 시스템 프롬프트 (필수)
 * @param {string} options.initialMessage - 초기 환영 메시지 (필수)
 * @param {string} options.storageKey - localStorage 키 (필수, 예: 'chat_history_MAIN')
 */
export function initChatbot(options) {
  console.log('[chatbot.js] initChatbot 호출됨, options:', {
    hasMessagesContainer: !!options.messagesContainer,
    hasInputElement: !!options.inputElement,
    hasSendButton: !!options.sendButton,
    hasSystemRole: !!options.systemRole,
    hasInitialMessage: !!options.initialMessage,
    hasStorageKey: !!options.storageKey
  });
  
  const {
    messagesContainer: container,
    inputElement,
    sendButton,
    toggleButton,
    closeButton,
    windowElement,
    loadingIndicator,
    titleElement,
    clearButton,
    systemRole,
    initialMessage,
    storageKey: providedStorageKey
  } = options;

  // 필수 파라미터 검증
  if (!systemRole || !initialMessage || !providedStorageKey) {
    console.error('[chatbot.js] initChatbot: 필수 파라미터 누락:', {
      systemRole: !!systemRole,
      initialMessage: !!initialMessage,
      storageKey: !!providedStorageKey
    });
    return;
  }
  
  // 필수 DOM 요소 검증
  if (!container || !inputElement || !sendButton) {
    console.error('[chatbot.js] initChatbot: 필수 DOM 요소 누락:', {
      container: !!container,
      inputElement: !!inputElement,
      sendButton: !!sendButton
    });
    return;
  }
  
  console.log('[chatbot.js] 모든 필수 요소 확인 완료, 초기화 진행');

  // 전역 변수에 저장
  messagesContainer = container;
  storageKey = providedStorageKey;
  currentSystemRole = systemRole; // 전역 변수에 저장
  currentInitialMessage = initialMessage; // 전역 변수에 저장

  // 저장된 대화 내역 불러오기
  chatbotHistory = loadHistory();
  
  // 강제 업데이트: 시스템 프롬프트를 최신 페르소나로 덮어씌우기
  if (chatbotHistory.length > 0 && chatbotHistory[0].role === 'system') {
    // 첫 번째 메시지가 시스템 메시지면 강제로 최신 버전으로 교체
    chatbotHistory[0].content = systemRole;
  } else {
    // 시스템 메시지가 없으면 맨 앞에 추가
    chatbotHistory.unshift({ role: 'system', content: systemRole });
  }
  
  // 업데이트된 대화 내역을 localStorage에 저장
  try {
    localStorage.setItem(storageKey, JSON.stringify(chatbotHistory));
  } catch (error) {
    console.error('시스템 프롬프트 업데이트 저장 실패:', error);
  }
  
  // 제목 업데이트 (있는 경우)
  if (titleElement) {
    // titleElement는 옵션이므로 페르소나에서 가져오거나 기본값 사용
    const persona = detectPersona();
    titleElement.textContent = persona?.title || '🤖 챗봇';
  }
  
  // 대화 내역이 있으면 UI에 복원, 없으면 환영 메시지만 표시
  if (container) {
    // 시스템 메시지를 제외한 실제 대화 기록 확인
    const userMessages = chatbotHistory.filter(msg => msg.role !== 'system');
    
    if (userMessages.length > 0) {
      // 저장된 대화가 있으면 복원
      renderHistory(container);
    } else {
      // 저장된 대화가 없으면 초기 메시지 표시
      if (container.children.length === 0) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'chatbot-message ai-message';
        const cleanedInitialMessage = cleanMarkdown(initialMessage);
        welcomeDiv.innerHTML = `
          <div class="message-bubble">
            ${cleanedInitialMessage}
          </div>
        `;
        container.appendChild(welcomeDiv);
      }
    }
  }
  
  // 대화 지우기 버튼 이벤트
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (confirm('대화 내용을 모두 지우고 처음으로 돌아갈까요?')) {
        clearHistory(container, currentInitialMessage);
      }
    });
  }
  
  // clearHistory 함수를 전역으로 export (다른 모듈에서 사용 가능)
  window.clearChatbotHistory = (onClear) => {
    if (confirm('대화 내용을 모두 지우고 처음으로 돌아갈까요?')) {
      clearHistory(container, onClear);
    }
  };
  
  // 이벤트 리스너 등록
  if (toggleButton) {
    toggleButton.addEventListener('click', () => toggleChatbot(windowElement, inputElement));
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', () => toggleChatbot(windowElement, inputElement));
  }
  
  // 이벤트 리스너 등록 (필수)
  if (sendButton) {
    console.log('[chatbot.js] sendButton 이벤트 리스너 등록');
    sendButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[chatbot.js] 전송 버튼 클릭됨 - practice 페이지');
      console.log('[chatbot.js] inputElement.value:', inputElement?.value);
      sendMessage({
        inputElement,
        sendButton,
        messagesContainer: container,
        loadingIndicator
      });
    });
    
    // 추가 확인: 이벤트 리스너가 등록되었는지 확인
    console.log('[chatbot.js] sendButton 이벤트 리스너 등록 완료');
  } else {
    console.error('[chatbot.js] sendButton이 없어서 이벤트 리스너를 등록할 수 없습니다');
  }
  
  if (inputElement) {
    console.log('[chatbot.js] inputElement 이벤트 리스너 등록');
    inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[chatbot.js] 엔터키 입력됨 - practice 페이지');
        console.log('[chatbot.js] inputElement.value:', inputElement?.value);
        sendMessage({
          inputElement,
          sendButton,
          messagesContainer: container,
          loadingIndicator
        });
      }
    });
    
    // 추가 확인: 이벤트 리스너가 등록되었는지 확인
    console.log('[chatbot.js] inputElement 이벤트 리스너 등록 완료');
  } else {
    console.error('[chatbot.js] inputElement가 없어서 이벤트 리스너를 등록할 수 없습니다');
  }
  
  console.log('[chatbot.js] initChatbot 완료 - 모든 이벤트 리스너 등록됨');
}

/**
 * 챗봇 창을 토글합니다.
 */
function toggleChatbot(windowElement, inputElement) {
  if (!windowElement) return;
  
  windowElement.classList.toggle('hidden');
  if (!windowElement.classList.contains('hidden') && inputElement) {
    inputElement.focus();
  }
}

/**
 * 메시지를 전송하고 AI 응답을 받습니다.
 */
async function sendMessage(options) {
  console.log('[마지막 실험실] sendMessage 함수 호출됨');
  
  const {
    inputElement,
    sendButton,
    messagesContainer: container,
    loadingIndicator
  } = options;
  
  // 입력 요소 확인
  if (!inputElement) {
    console.error('[마지막 실험실] inputElement가 없습니다');
    return;
  }
  
  const message = inputElement.value.trim();
  console.log('[마지막 실험실] 입력된 메시지:', message);
  
  if (!message) {
    console.warn('[마지막 실험실] 빈 메시지입니다');
    return;
  }
  
  // 사용자 메시지 추가
  addMessage(container, 'user', message);
  chatbotHistory.push({
    role: 'user',
    content: message
  });
  
  // 대화 내역 저장
  saveHistory();
  
  // 입력창 초기화 및 비활성화
  inputElement.value = '';
  inputElement.disabled = true;
  if (sendButton) {
    sendButton.disabled = true;
  }
  
  // 로딩 말풍선 추가
  addLoadingMessage(container);
  
  // AI 응답 받기
  try {
    console.log('[마지막 실험실] AI 응답 요청 시작');
    await getAIResponse(container);
    console.log('[마지막 실험실] AI 응답 도착 완료');
    
    // 로딩 말풍선 제거
    removeLoadingMessage(container);
  } catch (error) {
    // 로딩 말풍선 제거 (에러 발생 시에도)
    removeLoadingMessage(container);
    console.error('[chatbot.js] AI 응답 오류 상세:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // 사용자 친화적인 에러 메시지 생성
    let userFriendlyMessage = '죄송해요. 오류가 발생했어요. 다시 시도해주세요. 😢';
    
    if (error.message.includes('API 키')) {
      userFriendlyMessage = 'API 키가 설정되지 않았어요. 환경 변수를 확인해주세요. 🔑';
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      userFriendlyMessage = 'API 인증에 실패했어요. API 키를 확인해주세요. 🔐';
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
      userFriendlyMessage = '요청이 너무 많아요. 잠시 후 다시 시도해주세요. ⏰';
    } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      userFriendlyMessage = '네트워크 연결을 확인해주세요. 🌐\n\n가능한 원인:\n- 인터넷 연결 확인\n- CORS 정책 차단 (브라우저 콘솔 확인)\n- 방화벽/보안 소프트웨어 차단';
    } else if (error.message.includes('API 키 설정이 필요해요') || error.message.includes('API Key Missing')) {
      userFriendlyMessage = 'API 키 설정이 필요해요. 환경 변수를 확인해주세요.';
    }
    
    addMessage(container, 'ai', userFriendlyMessage + '\n\n<small style="opacity: 0.7;">오류: ' + error.message + '</small>');
  } finally {
    // 로딩 말풍선이 남아있으면 제거 (안전장치)
    removeLoadingMessage(container);
    
    // 기존 loadingIndicator 숨기기 (하위 호환성)
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
    inputElement.disabled = false;
    if (sendButton) {
      sendButton.disabled = false;
    }
    inputElement.focus();
  }
}

/**
 * 텍스트 정제 함수: ** 마크다운 제거
 */
function cleanMarkdown(text) {
  if (!text) return '';
  // ** 제거 (강조 표시)
  return text.replace(/\*\*/g, '');
}

/**
 * API Key 안전한 로딩
 */
function getApiKey() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('API Key Missing');
    return null;
  }
  return apiKey;
}

/**
 * OpenAI API를 호출하여 AI 응답을 받습니다.
 * 시스템 프롬프트 + 누적된 히스토리 + 새 메시지를 순서대로 합쳐서 전송합니다.
 */
async function getAIResponse(container) {
  console.log('[chatbot.js] getAIResponse 호출됨');
  
  const apiKey = getApiKey();
  console.log('[chatbot.js] API 키 확인:', apiKey ? '존재함 (길이: ' + apiKey.length + ')' : '없음');
  
  if (!apiKey) {
    const errorMsg = 'API 키 설정이 필요해요';
    console.error('[chatbot.js]', errorMsg);
    throw new Error(errorMsg);
  }

  // 메시지 구성: chatbotHistory에 이미 시스템 프롬프트가 포함되어 있어야 함
  // (initChatbot에서 이미 최신 시스템 프롬프트로 강제 업데이트됨)
  // 안전장치: 만약 시스템 메시지가 없으면 맨 앞에 추가
  let messages = [...chatbotHistory];
  console.log('[chatbot.js] chatbotHistory 길이:', chatbotHistory.length);
  
  if (messages.length === 0 || messages[0].role !== 'system') {
    // currentSystemRole이 없으면 에러 처리
    if (!currentSystemRole) {
      console.error('[chatbot.js] 시스템 프롬프트가 설정되지 않았습니다.');
      throw new Error('시스템 프롬프트가 설정되지 않았습니다.');
    }
    messages.unshift({ role: 'system', content: currentSystemRole });
    console.log('[chatbot.js] 시스템 프롬프트 추가됨');
  }
  
  console.log('[chatbot.js] API 요청 메시지 개수:', messages.length);
  console.log('[chatbot.js] 메시지 구조:', messages.map(m => ({ role: m.role, contentLength: m.content?.length || 0 })));

  const requestBody = {
    model: 'gpt-4o-mini',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500
  };
  
  console.log('[chatbot.js] API 요청 시작');
  console.log('[chatbot.js] 요청 본문 크기:', JSON.stringify(requestBody).length, 'bytes');

  let response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    console.log('[chatbot.js] API 응답 상태:', response.status, response.statusText);
    } catch (fetchError) {
      console.error('[chatbot.js] Fetch 오류 상세:', {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
        cause: fetchError.cause,
        toString: fetchError.toString()
      });
      
      // 네트워크 오류인지 확인
      if (fetchError.name === 'TypeError' && (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError'))) {
        console.error('[chatbot.js] 네트워크 오류 감지 - 가능한 원인:');
        console.error('  1. CORS 정책 차단');
        console.error('  2. 네트워크 연결 문제');
        console.error('  3. 방화벽/보안 소프트웨어 차단');
        console.error('  4. API 엔드포인트 접근 불가');
        throw new Error('네트워크 오류: API 서버에 연결할 수 없습니다. 네트워크 연결과 CORS 설정을 확인해주세요.');
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
    console.error('[chatbot.js] API 요청 실패 상세:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(errorData.error?.message || `API 요청 실패 (${response.status})`);
  }

  const data = await response.json();
  console.log('[chatbot.js] 응답 도착:', data);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('[chatbot.js] 응답 형식 오류:', data);
    throw new Error('API 응답 형식이 올바르지 않습니다.');
  }
  
  let aiMessage = data.choices[0].message.content;
  console.log('[chatbot.js] AI 메시지 내용 (원본):', aiMessage);
  
  // 마크다운 정제 적용
  aiMessage = cleanMarkdown(aiMessage);
  console.log('[chatbot.js] AI 메시지 내용 (정제 후):', aiMessage);
  
  // AI 응답 추가
  addMessage(container, 'ai', aiMessage);
  chatbotHistory.push({
    role: 'assistant',
    content: aiMessage
  });
  
  // 대화 내역 저장
  saveHistory();
}

/**
 * 로딩 말풍선을 추가합니다.
 * @param {HTMLElement} container - 메시지 컨테이너
 * @returns {HTMLElement} 로딩 메시지 요소 (제거용)
 */
export function addLoadingMessage(container) {
  if (!container) return null;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chatbot-message ai-message loading-message';
  messageDiv.id = 'loadingMessage';
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  
  const loadingDots = document.createElement('div');
  loadingDots.className = 'loading-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    loadingDots.appendChild(dot);
  }
  
  bubble.appendChild(loadingDots);
  messageDiv.appendChild(bubble);
  container.appendChild(messageDiv);
  
  // 스크롤을 맨 아래로
  container.scrollTop = container.scrollHeight;
  
  return messageDiv;
}

/**
 * 로딩 말풍선을 제거합니다.
 * @param {HTMLElement} container - 메시지 컨테이너
 */
export function removeLoadingMessage(container) {
  if (!container) return;
  
  const loadingMsg = container.querySelector('#loadingMessage');
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

/**
 * 메시지를 챗봇 창에 추가합니다.
 * @param {HTMLElement} container - 메시지 컨테이너
 * @param {string} sender - 'user' 또는 'ai'
 * @param {string} text - 메시지 내용
 * @param {boolean} scroll - 스크롤 여부 (기본값: true)
 */
export function addMessage(container, sender, text, scroll = true) {
  if (!container) return;
  
  // AI 메시지인 경우 마크다운 정제 적용
  const cleanedText = sender === 'ai' ? cleanMarkdown(text) : text;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${sender}-message`;
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  
  // 줄바꿈 처리
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (line.trim()) {
      const lineElement = document.createElement('div');
      lineElement.textContent = line;
      if (index > 0) {
        lineElement.style.marginTop = '4px';
      }
      bubble.appendChild(lineElement);
    }
  });
  
  messageDiv.appendChild(bubble);
  container.appendChild(messageDiv);
  
  // 스크롤을 맨 아래로
  if (scroll) {
    container.scrollTop = container.scrollHeight;
  }
}
