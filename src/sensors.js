import './style.css'
import { initChatbot } from './chatbot.js'

// ============================================
// 센서 데이터 (정확히 12종만 사용)
// ============================================

const SENSORS_DATA = [
  {
    id: 'led',
    name: 'LED',
    img: '/sencors/led.png',
    desc: '전기에너지를 빛에너지로 변환하는 반도체. 긴 다리가 (+), 짧은 다리가 (-)극.'
  },
  {
    id: 'button',
    name: '버튼',
    img: '/sencors/button_switch.png',
    desc: '누르고 있을 때만 전기가 흐르고 손을 떼면 끊어지는 스위치. 키보드나 게임기 컨트롤러에 사용.'
  },
  {
    id: 'cds',
    name: '조도센서',
    img: '/sencors/cds.png',
    desc: '빛의 밝기에 따라 저항값이 변하는 센서. 어두워지면 가로등을 켜는 원리에 사용.'
  },
  {
    id: 'ultrasonic',
    name: '초음파센서',
    img: '/sencors/ultrasonic.png',
    desc: '초음파를 발사한 뒤 벽에 부딪혀 돌아오는 시간을 계산해서 거리를 측정. 자동차 후방 감지기에 사용.'
  },
  {
    id: 'servo',
    name: '서보모터',
    img: '/sencors/servo.png',
    desc: '입력한 신호에 따라 0도~180도 사이의 정확한 각도로 움직이는 모터. 로봇 관절에 사용.'
  },
  {
    id: 'dc_motor',
    name: 'DC모터',
    img: '/sencors/dc_motor.png',
    desc: '전기를 연결하면 계속 회전하는 모터. 선풍기나 미니카의 바퀴를 구동할 때 사용.'
  },
  {
    id: 'piezo',
    name: '피에조부저',
    img: '/sencors/piezo.png',
    desc: '전기 신호를 얇은 판의 떨림으로 바꿔서 소리를 내는 부품. 전자식 알람 소리를 만들 때 사용.'
  },
  {
    id: 'potentiometer',
    name: '가변저항',
    img: '/sencors/potentiometer.png',
    desc: '손잡이를 돌려서 저항값을 조절할 수 있는 부품. 스피커 볼륨이나 조명 밝기 조절에 사용.'
  },
  {
    id: 'tilt',
    name: '틸트센서',
    img: '/sencors/tilt.png',
    desc: '원통 안에 구슬이 들어있어서, 물체가 기울어지면 구슬이 굴러가 전기를 연결하거나 끊어줌.'
  },
  {
    id: 'ir_sensor',
    name: '적외선센서',
    img: '/sencors/ir_sensor.png',
    desc: '눈에 보이지 않는 적외선을 쏘고, 물체에 반사되어 돌아오는 양을 감지. 자동문이나 리모컨에 사용.'
  },
  {
    id: 'slide_switch',
    name: '슬라이드 스위치',
    img: '/sencors/slide_switch.png',
    desc: '슬라이더를 밀어서 전기를 켜거나 끄는 스위치. 전등 스위치나 전자제품의 전원 버튼에 사용.'
  },
  {
    id: 'resistor',
    name: '저항',
    img: '/sencors/resistor.png',
    desc: '전류의 흐름을 제한하는 부품. LED나 모터에 과도한 전류가 흐르지 않도록 보호해줘요.'
  }
];

// 데이터 검증: 정확히 12종인지 확인
if (SENSORS_DATA.length !== 12) {
  console.error('센서 데이터는 정확히 12종이어야 합니다. 현재:', SENSORS_DATA.length);
}

// ============================================
// DOM 요소
// ============================================

const studySection = document.getElementById('study-section');
const dragGameSection = document.getElementById('drag-game-section');
const studyBoard = document.getElementById('study-board');
const dropZoneContainer = document.getElementById('dropZoneContainer');
const dragItemsContainer = document.getElementById('dragItemsContainer');
const dragFeedback = document.getElementById('dragFeedback');
const dragFeedbackText = document.getElementById('dragFeedbackText');
const dragGameResult = document.getElementById('dragGameResult');
const startGameBtn = document.getElementById('start-game-btn');
const backToStudyBtn = document.getElementById('back-to-study-btn');
const restartDragGameBtn = document.getElementById('restart-drag-game-btn');
const retryDragGameButton = document.getElementById('retryDragGameButton');
const backToStudyFromDrag = document.getElementById('backToStudyFromDrag');

// ============================================
// 게임 상태 관리
// ============================================

let gameSensors = []; // 게임에 사용될 5개 센서
let matchedCount = 0; // 맞춘 개수
let draggedElement = null; // 현재 드래그 중인 요소

// ============================================
// 배열 섞기 (Fisher-Yates 알고리즘)
// ============================================

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// 학습 모드 렌더링
// ============================================

function renderStudyCards() {
  studyBoard.innerHTML = '';
  
  SENSORS_DATA.forEach(sensor => {
    const cardElement = document.createElement('div');
    cardElement.className = 'study-card';
    cardElement.dataset.sensorId = sensor.id;
    cardElement.innerHTML = `
      <div class="study-card-image">
        <img src="${sensor.img}" alt="${sensor.name}" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2212%22 fill=%22%23999%22%3E${encodeURIComponent(sensor.name)}%3C/text%3E%3C/svg%3E';" />
      </div>
      <div class="study-card-content">
        <h3 class="study-card-name">${sensor.name}</h3>
        <p class="study-card-desc">${sensor.desc}</p>
      </div>
    `;
    
    // 학습 모드에서만 클릭 이벤트 추가
    cardElement.addEventListener('click', () => {
      if (!dragGameSection.classList.contains('hidden')) {
        // 게임 모드에서는 모달을 열지 않음
        return;
      }
      openSensorModal(sensor);
    });
    
    studyBoard.appendChild(cardElement);
  });
}

// ============================================
// 모드 전환 함수
// ============================================

function switchToDragGameMode() {
  studySection.style.opacity = '0';
  studySection.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    studySection.classList.add('hidden');
    dragGameSection.classList.remove('hidden');
    setTimeout(() => {
      dragGameSection.style.opacity = '1';
      dragGameSection.style.transform = 'translateY(0)';
    }, 50);
    initDragGame();
  }, 300);
}

function switchToStudyMode() {
  dragGameSection.style.opacity = '0';
  dragGameSection.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    dragGameSection.classList.add('hidden');
    dragGameResult.classList.add('hidden');
    dragFeedback.classList.add('hidden');
    studySection.classList.remove('hidden');
    setTimeout(() => {
      studySection.style.opacity = '1';
      studySection.style.transform = 'translateY(0)';
    }, 50);
  }, 300);
}

// ============================================
// 드래그 앤 드롭 게임 초기화
// ============================================

function initDragGame() {
  matchedCount = 0;
  draggedElement = null;
  dragGameResult.classList.add('hidden');
  dragFeedback.classList.add('hidden');
  
  // 12종 중 무작위로 5개 선택
  const shuffled = shuffleArray(SENSORS_DATA);
  gameSensors = shuffled.slice(0, 5);
  
  // 드롭 영역 렌더링 (상단)
  renderDropZones();
  
  // 드래그 아이템 렌더링 (하단)
  renderDragItems();
}

// ============================================
// 드롭 영역 렌더링 (상단)
// ============================================

function renderDropZones() {
  dropZoneContainer.innerHTML = '';
  
  gameSensors.forEach((sensor, index) => {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.dataset.sensorId = sensor.id;
    dropZone.dataset.index = index;
    dropZone.innerHTML = `
      <div class="drop-zone-content">
        <p class="drop-zone-desc">${sensor.desc}</p>
        <div class="drop-zone-placeholder">⬇️ 센서 그림을 여기에 드롭하세요</div>
      </div>
    `;
    
    // 드롭 이벤트
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    
    dropZoneContainer.appendChild(dropZone);
  });
}

// ============================================
// 드래그 아이템 렌더링 (하단)
// ============================================

function renderDragItems() {
  dragItemsContainer.innerHTML = '';
  
  // 게임에 사용된 센서 + 오답용 센서 섞기
  const wrongAnswers = SENSORS_DATA.filter(s => !gameSensors.find(gs => gs.id === s.id));
  const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
  const allItems = shuffleArray([...gameSensors, ...shuffledWrong]);
  
  allItems.forEach(sensor => {
    const dragItem = document.createElement('div');
    dragItem.className = 'drag-item';
    dragItem.draggable = true;
    dragItem.dataset.sensorId = sensor.id;
    dragItem.innerHTML = `
      <img src="${sensor.img}" alt="${sensor.name}" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2210%22 fill=%22%23999%22%3E${encodeURIComponent(sensor.name)}%3C/text%3E%3C/svg%3E';" />
      <span class="drag-item-name">${sensor.name}</span>
    `;
    
    // 드래그 이벤트
    dragItem.addEventListener('dragstart', handleDragStart);
    dragItem.addEventListener('dragend', handleDragEnd);
    
    dragItemsContainer.appendChild(dragItem);
  });
}

// ============================================
// 드래그 이벤트 핸들러
// ============================================

function handleDragStart(e) {
  draggedElement = e.target.closest('.drag-item');
  if (!draggedElement) return;
  
  draggedElement.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedElement.dataset.sensorId);
  
  // 드래그 중인 아이템을 반투명하게
  e.dataTransfer.setDragImage(draggedElement, 0, 0);
  
  // 모든 드롭 영역에 이벤트 리스너 추가 (자석 효과)
  document.querySelectorAll('.drop-zone').forEach(zone => {
    if (!zone.classList.contains('matched')) {
      zone.classList.add('snap-zone');
    }
  });
}

function handleDragEnd(e) {
  const dragItem = e.target.closest('.drag-item');
  if (dragItem) {
    dragItem.classList.remove('dragging');
  }
  
  // 모든 드롭 영역에서 효과 제거
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over', 'snap-zone', 'snap-active');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const dropZone = e.currentTarget;
  
  // 이미 매칭된 상자는 무시
  if (dropZone.classList.contains('matched')) {
    e.dataTransfer.dropEffect = 'none';
    return;
  }
  
  // 자석 효과: 올바른 센서 ID인 경우 강조
  const draggedSensorId = e.dataTransfer.getData('text/plain');
  const correctSensorId = dropZone.dataset.sensorId;
  
  if (draggedSensorId === correctSensorId) {
    dropZone.classList.add('snap-active');
  }
}

function handleDragEnter(e) {
  e.preventDefault();
  
  const dropZone = e.currentTarget;
  
  // 이미 매칭된 상자는 무시
  if (dropZone.classList.contains('matched')) {
    return;
  }
  
  dropZone.classList.add('drag-over');
  
  // 자석 효과: 올바른 센서인 경우 더 강한 시각적 피드백
  const draggedSensorId = e.dataTransfer.getData('text/plain');
  const correctSensorId = dropZone.dataset.sensorId;
  
  if (draggedSensorId === correctSensorId) {
    dropZone.classList.add('snap-active');
  }
}

function handleDragLeave(e) {
  const dropZone = e.currentTarget;
  
  // 자식 요소로 이동한 경우는 무시
  if (dropZone.contains(e.relatedTarget)) {
    return;
  }
  
  dropZone.classList.remove('drag-over', 'snap-active');
}

function handleDrop(e) {
  e.preventDefault();
  
  const dropZone = e.currentTarget;
  
  // 이미 매칭된 상자는 무시
  if (dropZone.classList.contains('matched')) {
    return;
  }
  
  dropZone.classList.remove('drag-over', 'snap-active', 'snap-zone');
  
  const droppedSensorId = e.dataTransfer.getData('text/plain');
  const correctSensorId = dropZone.dataset.sensorId;
  
  if (droppedSensorId === correctSensorId) {
    // 정답! 자석 효과로 부드럽게 이동
    handleCorrectMatch(dropZone, draggedElement);
  } else {
    // 오답!
    handleIncorrectMatch(draggedElement);
  }
}

// ============================================
// 정답 처리
// ============================================

function handleCorrectMatch(dropZone, dragItem) {
  matchedCount++;
  
  // 자석 효과 애니메이션: 드래그 아이템이 상자로 이동하는 효과
  const dragItemRect = dragItem.getBoundingClientRect();
  const dropZoneRect = dropZone.getBoundingClientRect();
  
  // 클론 생성하여 애니메이션 효과
  const clone = dragItem.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.left = dragItemRect.left + 'px';
  clone.style.top = dragItemRect.top + 'px';
  clone.style.width = dragItemRect.width + 'px';
  clone.style.height = dragItemRect.height + 'px';
  clone.style.zIndex = '10000';
  clone.style.pointerEvents = 'none';
  clone.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  document.body.appendChild(clone);
  
  // 원본 아이템 즉시 숨김
  dragItem.style.opacity = '0';
  
  // 클론을 상자 위치로 이동
  setTimeout(() => {
    clone.style.left = dropZoneRect.left + (dropZoneRect.width / 2) - (dragItemRect.width / 2) + 'px';
    clone.style.top = dropZoneRect.top + (dropZoneRect.height / 2) - (dragItemRect.height / 2) + 'px';
    clone.style.transform = 'scale(0.8)';
    clone.style.opacity = '0.8';
  }, 10);
  
  // 애니메이션 완료 후 정리
  setTimeout(() => {
    clone.remove();
    dragItem.remove();
    
    // 드롭 영역에 이미지 표시
    dropZone.classList.add('matched');
    dropZone.innerHTML = `
      <div class="drop-zone-content matched">
        <img src="${gameSensors.find(s => s.id === dropZone.dataset.sensorId).img}" alt="${gameSensors.find(s => s.id === dropZone.dataset.sensorId).name}" onerror="this.style.display='none';" />
        <p class="drop-zone-desc">${gameSensors.find(s => s.id === dropZone.dataset.sensorId).desc}</p>
      </div>
    `;
    
    // 피드백 표시
    showDragFeedback('딩동댕! 정답이에요! 🎉', true);
    
    // 게임 완료 체크
    if (matchedCount === gameSensors.length) {
      setTimeout(() => {
        showDragGameResult();
      }, 1000);
    }
  }, 400);
}

// ============================================
// 오답 처리
// ============================================

function handleIncorrectMatch(dragItem) {
  // 튕겨 돌아가는 애니메이션
  dragItem.classList.add('bounce-back');
  showDragFeedback('틀렸어요. 다시 시도해보세요!', false);
  
  setTimeout(() => {
    dragItem.classList.remove('bounce-back');
  }, 600);
}

// ============================================
// 피드백 표시
// ============================================

function showDragFeedback(text, isCorrect) {
  dragFeedbackText.textContent = text;
  dragFeedback.classList.remove('hidden');
  dragFeedback.className = `drag-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    setTimeout(() => {
    dragFeedback.classList.add('hidden');
  }, 2000);
}

// ============================================
// 결과 화면 표시
// ============================================

function showDragGameResult() {
  dragGameResult.classList.remove('hidden');
}

// ============================================
// 이벤트 리스너
// ============================================

startGameBtn.addEventListener('click', () => {
  switchToDragGameMode();
});

backToStudyBtn.addEventListener('click', () => {
  switchToStudyMode();
});

restartDragGameBtn.addEventListener('click', () => {
  initDragGame();
});

retryDragGameButton.addEventListener('click', () => {
  dragGameResult.classList.add('hidden');
  initDragGame();
});

backToStudyFromDrag.addEventListener('click', () => {
  switchToStudyMode();
});

// ============================================
// 챗봇 초기화
// ============================================

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendButton = document.getElementById('chatbotSendButton');
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
    systemRole: `너는 센서 전문가 챗봇이야. 학생들이 기본 12종 센서를 배운 후, 더 깊이 있는 학습을 도와주는 역할을 해.

중요한 가이드라인:
1. 기본 12종 센서(LED, 버튼, 조도센서, 초음파센서, 서보모터, DC모터, 피에조부저, 가변저항, 틸트센서, 적외선센서, 슬라이드 스위치, 저항)에 대한 심화 설명을 제공해.
2. 기본 12종 외에도 세상에는 정말 신기한 센서가 많다는 것을 알려줘. 예: 가스 센서, 자이로 센서, 압력 센서, 근접 센서, 적외선 거리 센서, 온도 센서, 습도 센서, 초음파 거리 센서 등.
3. 학생이 "가스 센서가 뭐야?"처럼 특수 센서를 물어보면, 그 센서의 원리, 사용 예시, 아두이노 연결 방법을 친절하게 설명해줘.
4. 설명은 중학생이 이해하기 쉽게, 친절하고 격려하는 톤으로 대화해.
5. 드래그 게임에 대한 힌트도 제공해줘. 학생이 막혔을 때 도움을 줄 수 있어.
6. "기본 12종 외에도 세상에는 정말 신기한 센서가 많아! 궁금한 센서 이름을 말해봐."라는 안내를 자연스럽게 해줘.`,
    initialMessage: "안녕? 나는 **센서 전문가**란다. 12가지 센서나 다른 신기한 센서들에 대해 무엇이든 물어보렴!",
    storageKey: 'chat_history_SENSORS'
  });
}

// ============================================
// 센서 상세 정보 모달 기능
// ============================================

const sensorModal = document.getElementById('sensorModal');
const sensorModalClose = document.getElementById('sensorModalClose');
const sensorModalImage = document.getElementById('sensorModalImage');
const sensorModalName = document.getElementById('sensorModalName');
const sensorModalDesc = document.getElementById('sensorModalDesc');
const sensorModalOverlay = sensorModal?.querySelector('.sensor-modal-overlay');

function openSensorModal(sensor) {
  if (!sensorModal || !sensor) return;
  
  // 모달에 센서 정보 채우기
  sensorModalImage.src = sensor.img;
  sensorModalImage.alt = sensor.name;
  sensorModalName.textContent = sensor.name;
  sensorModalDesc.textContent = sensor.desc;
  
  // 모달 표시
  sensorModal.classList.remove('hidden');
  
  // body 스크롤 방지
  document.body.style.overflow = 'hidden';
}

function closeSensorModal() {
  if (!sensorModal) return;
  
  // 모달 숨기기
  sensorModal.classList.add('hidden');
  
  // body 스크롤 복구
  document.body.style.overflow = '';
}

// 모달 닫기 이벤트 리스너
if (sensorModalClose) {
  sensorModalClose.addEventListener('click', closeSensorModal);
}

// 오버레이 클릭 시 닫기
if (sensorModalOverlay) {
  sensorModalOverlay.addEventListener('click', (e) => {
    // 오버레이만 클릭했을 때 (모달 박스는 제외)
    if (e.target === sensorModalOverlay) {
      closeSensorModal();
    }
  });
}

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sensorModal && !sensorModal.classList.contains('hidden')) {
    closeSensorModal();
  }
});

// ============================================
// 페이지 로드 시 초기화
// ============================================

// 네비게이션 초기화
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const currentPath = window.location.pathname;
  
  // 현재 페이지 감지
  let currentPage = 0;
  if (currentPath.includes('sensors.html')) {
    currentPage = 1;
  } else if (currentPath.includes('ideas.html')) {
    currentPage = 2;
  } else if (currentPath.includes('practice.html')) {
    currentPage = 3;
  }
  
  navItems.forEach(item => {
    const stageNum = parseInt(item.dataset.stage, 10);
    
    // 모든 active 클래스 제거 후 현재 페이지에만 추가
    item.classList.remove('active');
    
    if (stageNum === currentPage) {
      item.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 네비게이션 초기화
  initNavigation();
  
  renderStudyCards();
  studySection.style.opacity = '1';
  studySection.style.transform = 'translateY(0)';
  dragGameSection.style.opacity = '0';
});
