/**
 * 만능 멘토 챗봇 모듈
 * 페이지별로 다른 역할을 하는 챗봇을 제공하며, 각 페이지별로 독립된 대화 맥락을 유지합니다.
 */

// 페이지별 페르소나 (System Prompts)
const PERSONAS = {
  // 메인 페이지: 감성 케어 챗봇 (다정한 단짝 친구)
  friend: {
    systemPrompt: `너는 학생의 다정한 단짝 친구야. 이름은 "메이커스 프렌드"이고, 프로젝트 시작 전에 학생의 기분을 물어보고 공감해주는 역할을 해.

중요한 가이드라인:
1. 첫 인사는 "안녕! 오늘 학교 오는 길은 어땠어? 기분은 좀 어때?" 처럼 가볍고 다정하게 시작해.
2. 기술적인 이야기는 먼저 꺼내지 마. 일상적인 대화에 집중해.
3. 사용자가 "피곤해"라고 하면 "저런, 당 충전이 필요하겠다! 그래도 오늘 멋진 걸 만들면 기분이 좋아질 거야. ✨"처럼 위로하고 격려해줘.
4. 이모지를 많이 사용해서(🌈, ✨, 🍀, 💫, 🌟) 밝고 따뜻한 분위기를 만들어줘.
5. 약 5~10턴 정도 일상적인 대화를 주고받으며 친밀감을 형성해.
6. 대화가 충분히 무르익으면 자연스럽게 "자, 이제 기분 좋게 발명하러 가볼까? 아래 메뉴에서 원하는 걸 골라봐! 🚀"라고 안내해줘.
7. 항상 긍정적이고 따뜻한 톤으로 대화해.`,
    welcomeMessage: "안녕! 오늘 학교 오는 길은 어땠어? 기분은 좀 어때? 🍀\n오늘 하루가 어땠는지 나한테 이야기해줄래?",
    title: '🍀 메이커스 프렌드'
  },
  
  // 1페이지: 센서 도서관 (센서 박사)
  sensors: {
    systemPrompt: `너는 센서 박사 챗봇이야. 학생들이 기본 12종 센서를 배운 후, 더 깊이 있는 학습을 도와주는 역할을 해.

중요한 가이드라인:
1. 기본 12종 센서(LED, 버튼, 조도센서, 초음파센서, 서보모터, DC모터, 피에조부저, 가변저항, 틸트센서, 적외선센서, 슬라이드 스위치, 저항)에 대한 심화 설명을 제공해.
2. 기본 12종 외에도 세상에는 정말 신기한 센서가 많다는 것을 알려줘. 예: 가스 센서, 자이로 센서, 압력 센서, 근접 센서, 적외선 거리 센서, 온도 센서, 습도 센서, 초음파 거리 센서 등.
3. 학생이 "가스 센서가 뭐야?"처럼 특수 센서를 물어보면, 그 센서의 원리, 사용 예시, 아두이노 연결 방법을 친절하게 설명해줘.
4. 설명은 중학생이 이해하기 쉽게, 친절하고 격려하는 톤으로 대화해.
5. "기본 12종 외에도 세상에는 정말 신기한 센서가 많아! 궁금한 센서 이름을 말해봐."라는 안내를 자연스럽게 해줘.`,
    welcomeMessage: "안녕! 센서 박사야! 📚\n기본 12종 센서를 배웠다면, 이제 더 신기한 센서들을 탐험해볼까?\n궁금한 센서 이름을 말해봐! (예: 가스 센서, 자이로 센서, 압력 센서 등)",
    title: '📚 센서 박사'
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
6. 친절하고 열정적인 톤으로 대화해.`,
    welcomeMessage: "안녕! 아이디어 뱅크야! 💡\n배운 센서들을 활용해서 멋진 프로젝트를 만들어봐요!\n아래 예시를 클릭하거나, 직접 아이디어를 말해봐!",
    title: '💡 아이디어 뱅크'
  },
  
  // 3페이지: 미리보기 실험실 (아두이노 코딩 전문가)
  practice: {
    systemPrompt: `너는 아두이노 코딩 전문가야. 아두이노/브레드보드 회로 연결 및 코드 오류 수정을 도와주는 역할을 해.

중요한 가이드라인:
1. 학생이 회로 연결을 물어보면, 아두이노와 브레드보드 이미지를 활용하여 시각적으로 설명해줘. (이미지 경로: /sencors/arduino_uno.png, /sencors/breadboard.png)
2. 회로 연결 설명 시 핀 번호, 전원(+), 접지(-), 저항 연결 등을 구체적으로 알려줘.
3. 코드 오류가 발생하면 에러 메시지를 분석하고, 어떤 부분이 문제인지 단계별로 설명해줘.
4. 코드를 보여줄 때는 각 줄마다 주석(//)으로 아주 친절하게 설명을 달아줘.
5. setup()(설정)과 loop()(반복)의 개념을 먼저 설명하고, 단계별로 코드를 작성하도록 도와줘.
6. 학생이 막혔을 때는 "어떤 부분이 어려운지 말해봐", "에러 메시지가 뭐라고 나와?"처럼 구체적인 질문을 해.
7. 친절하고 격려하는 톤으로 대화하되, 학생이 스스로 이해할 수 있도록 단계별로 안내해.`,
    welcomeMessage: "안녕! 아두이노 코딩 전문가야! 🧪\n회로 연결이나 코드 작성 중 막히면 언제든 물어봐!\n아두이노와 브레드보드 이미지를 활용해서 시각적으로 도와줄게!",
    title: '🧪 아두이노 코딩 전문가'
  }
};

// 챗봇 상태 관리 (페이지별로 독립적으로 관리)
let chatbotHistory = [];
let currentPersona = null;
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
 * @returns {string} sessionStorage 키
 */
function getStorageKey() {
  const pathname = window.location.pathname;
  
  // 메인 페이지: index.html 또는 / -> 감성 케어 챗봇 (휘발성, 저장 안 함)
  if (pathname === '/' || pathname.endsWith('/') || pathname.includes('index.html')) {
    return null; // 메인 페이지는 대화 내용 저장하지 않음 (휘발성)
  }
  // 1페이지: sensors.html -> 센서 도서관
  else if (pathname.includes('sensors.html')) {
    return 'chat_history_sensor';
  } 
  // 2페이지: ideas.html -> 아이디어 톡
  else if (pathname.includes('ideas.html')) {
    return 'chat_history_idea';
  } 
  // 3페이지: practice.html -> 미리보기 실험실
  else if (pathname.includes('practice.html')) {
    return 'chat_history_coding';
  }
  
  // 기본값
  return null;
}

/**
 * sessionStorage에서 대화 내역을 불러옵니다.
 * @returns {Array} 대화 내역 배열
 */
function loadHistory() {
  // 메인 페이지는 대화 내용 저장하지 않음 (휘발성)
  if (!storageKey) {
    return [];
  }
  
  try {
    const stored = sessionStorage.getItem(storageKey);
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
 * 대화 내역을 sessionStorage에 저장합니다.
 * 최근 10개(5쌍)만 유지하고 오래된 대화는 삭제합니다.
 */
function saveHistory() {
  // 메인 페이지는 대화 내용 저장하지 않음 (휘발성)
  if (!storageKey) {
    return;
  }
  
  try {
    // 최대 길이 제한: 오래된 메시지부터 삭제
    while (chatbotHistory.length > MAX_HISTORY_LENGTH) {
      chatbotHistory.shift();
    }
    
    sessionStorage.setItem(storageKey, JSON.stringify(chatbotHistory));
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
    welcomeDiv.innerHTML = `
      <div class="message-bubble">
        ${currentPersona.welcomeMessage}
      </div>
    `;
    container.appendChild(welcomeDiv);
  }
  
  // 저장된 대화 내역을 UI에 복원
  chatbotHistory.forEach((msg) => {
    addMessage(container, msg.role === 'user' ? 'user' : 'ai', msg.content, false);
  });
  
  // 스크롤을 맨 아래로
  container.scrollTop = container.scrollHeight;
}

/**
 * 대화 내역을 초기화합니다.
 */
function clearHistory(container) {
  chatbotHistory = [];
  sessionStorage.removeItem(storageKey);
  
  // UI 초기화
  if (container) {
    container.innerHTML = '';
    
    // 환영 메시지 다시 추가
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'chatbot-message ai-message';
    welcomeDiv.innerHTML = `
      <div class="message-bubble">
        ${currentPersona.welcomeMessage}
      </div>
    `;
    container.appendChild(welcomeDiv);
  }
}

/**
 * 챗봇을 초기화합니다.
 * @param {Object} options - 초기화 옵션
 * @param {HTMLElement} options.messagesContainer - 메시지 컨테이너 요소
 * @param {HTMLElement} options.inputElement - 입력 필드 요소
 * @param {HTMLElement} options.sendButton - 전송 버튼 요소
 * @param {HTMLElement} options.toggleButton - 토글 버튼 요소
 * @param {HTMLElement} options.closeButton - 닫기 버튼 요소
 * @param {HTMLElement} options.windowElement - 챗봇 창 요소
 * @param {HTMLElement} options.loadingIndicator - 로딩 표시 요소
 * @param {HTMLElement} options.titleElement - 제목 요소 (선택사항)
 * @param {HTMLElement} options.clearButton - 대화 지우기 버튼 요소 (선택사항)
 */
export function initChatbot(options) {
  const {
    messagesContainer: container,
    inputElement,
    sendButton,
    toggleButton,
    closeButton,
    windowElement,
    loadingIndicator,
    titleElement,
    clearButton
  } = options;

  // 전역 변수에 저장
  messagesContainer = container;

  // 페르소나 감지 및 설정
  currentPersona = detectPersona();
  
  // 저장소 키 설정
  storageKey = getStorageKey();
  
  // 저장된 대화 내역 불러오기
  chatbotHistory = loadHistory();
  
  // 제목 업데이트 (있는 경우)
  if (titleElement) {
    titleElement.textContent = currentPersona.title;
  }
  
  // 대화 내역이 있으면 UI에 복원, 없으면 환영 메시지만 표시
  if (container) {
    if (chatbotHistory.length > 0) {
      // 저장된 대화가 있으면 복원
      renderHistory(container);
    } else {
      // 저장된 대화가 없으면 환영 메시지만 표시
      if (container.children.length === 0) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'chatbot-message ai-message';
        welcomeDiv.innerHTML = `
          <div class="message-bubble">
            ${currentPersona.welcomeMessage}
          </div>
        `;
        container.appendChild(welcomeDiv);
      }
    }
  }
  
  // 대화 지우기 버튼 이벤트
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (confirm('대화 내역을 모두 지우시겠어요?')) {
        clearHistory(container);
      }
    });
  }
  
  // 이벤트 리스너 등록
  if (toggleButton) {
    toggleButton.addEventListener('click', () => toggleChatbot(windowElement, inputElement));
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', () => toggleChatbot(windowElement, inputElement));
  }
  
  if (sendButton) {
    sendButton.addEventListener('click', () => sendMessage({
      inputElement,
      sendButton,
      messagesContainer: container,
      loadingIndicator
    }));
  }
  
  if (inputElement) {
    inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage({
          inputElement,
          sendButton,
          messagesContainer: container,
          loadingIndicator
        });
      }
    });
  }
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
  const {
    inputElement,
    sendButton,
    messagesContainer: container,
    loadingIndicator
  } = options;
  
  const message = inputElement.value.trim();
  
  if (!message) return;
  
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
  sendButton.disabled = true;
  
  // 로딩 표시
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }
  
  // AI 응답 받기
  try {
    await getAIResponse(container);
  } catch (error) {
    console.error('Error:', error);
    addMessage(container, 'ai', '죄송해요. 오류가 발생했어요. 다시 시도해주세요. 😢');
  } finally {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    inputElement.disabled = false;
    sendButton.disabled = false;
    inputElement.focus();
  }
}

/**
 * OpenAI API를 호출하여 AI 응답을 받습니다.
 * 시스템 프롬프트 + 누적된 히스토리 + 새 메시지를 순서대로 합쳐서 전송합니다.
 */
async function getAIResponse(container) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }

  // 메시지 구성: system + 과거 대화 기록 + 현재 사용자 메시지
  const messages = [
    { role: 'system', content: currentPersona.systemPrompt },
    ...chatbotHistory  // 과거 대화 기록 (이미 현재 사용자 메시지 포함)
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'API 요청 실패');
  }

  const data = await response.json();
  const aiMessage = data.choices[0].message.content;
  
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
 * 메시지를 챗봇 창에 추가합니다.
 * @param {HTMLElement} container - 메시지 컨테이너
 * @param {string} sender - 'user' 또는 'ai'
 * @param {string} text - 메시지 내용
 * @param {boolean} scroll - 스크롤 여부 (기본값: true)
 */
export function addMessage(container, sender, text, scroll = true) {
  if (!container) return;
  
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
