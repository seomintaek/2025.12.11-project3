
import './style.css'
import { initChatbot, detectPersona, addMessage } from './chatbot.js'

// ============================================
// 드로잉 캔버스 기능
// ============================================

const canvas = document.getElementById('sketchCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 조정 (반응형)
function resizeCanvas() {
  const wrapper = canvas.parentElement;
  // 패딩을 줄여서 더 넓은 영역 사용
  const maxWidth = wrapper.clientWidth - 24;
  const maxHeight = window.innerHeight - 250;
  
  const aspectRatio = 800 / 600;
  // 최소 크기를 더 크게 설정
  let newWidth = Math.min(maxWidth, Math.max(900, maxWidth * 0.95));
  let newHeight = newWidth / aspectRatio;
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  drawGridBackground();
}

// 흰색 배경 그리기
function drawGridBackground() {
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
}

// 드로잉 상태
let isDrawing = false;
let currentTool = 'pen';
let currentColor = '#000000';
let lastX = 0;
let lastY = 0;
let startX = 0;
let startY = 0;
let canvasSnapshot = null;

// 도구 설정
function setTool(tool) {
  currentTool = tool;
  
  document.querySelectorAll('.drawing-tool').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const selectedTool = document.querySelector(`[data-tool="${tool}"]`);
  if (selectedTool) {
    selectedTool.classList.add('active');
  }
  
  if (tool !== 'pen') {
    document.querySelectorAll('.pen-tool').forEach(btn => {
      btn.classList.remove('active');
    });
  }
}

// 펜 색상 설정
function setPenColor(color) {
  currentColor = color;
  currentTool = 'pen';
  
  document.querySelectorAll('.pen-tool').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const selectedPen = document.querySelector(`[data-color="${color}"]`);
  if (selectedPen) {
    selectedPen.classList.add('active');
  }
  
  setTool('pen');
  
  document.querySelector('[data-tool="eraser"]')?.classList.remove('active');
}

// 지우개 설정
function setEraser() {
  currentTool = 'eraser';
  
  document.querySelectorAll('.pen-tool').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelector('[data-tool="eraser"]')?.classList.add('active');
  
  document.querySelectorAll('.drawing-tool').forEach(btn => {
    if (btn.getAttribute('data-tool') !== 'eraser') {
      btn.classList.remove('active');
    }
  });
}

// 좌표 가져오기 (마우스/터치 지원)
function getCoordinates(e) {
  if (e.touches && e.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  } else {
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  }
}

// 스냅샷 저장
function saveSnapshot() {
  canvasSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// 스냅샷 복원
function restoreSnapshot() {
  if (canvasSnapshot) {
    ctx.putImageData(canvasSnapshot, 0, 0);
  }
}

// 각도 스냅 (Shift 키용)
function snapAngle(startX, startY, endX, endY) {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < 10) return { x: endX, y: endY };
  
  const angle = Math.atan2(dy, dx);
  const snapAngles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, -Math.PI / 4, -Math.PI / 2, -3 * Math.PI / 4];
  
  let snappedAngle = angle;
  let minDiff = Infinity;
  
  for (const snapAngle of snapAngles) {
    const diff = Math.abs(angle - snapAngle);
    if (diff < minDiff) {
      minDiff = diff;
      snappedAngle = snapAngle;
    }
  }
  
  return {
    x: startX + Math.cos(snappedAngle) * distance,
    y: startY + Math.sin(snappedAngle) * distance
  };
}

// 직선 그리기
function drawLine(startX, startY, endX, endY, isPreview = false) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  
  if (currentTool === 'pen' || currentTool === 'line') {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
  } else if (currentTool === 'eraser') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.globalCompositeOperation = 'destination-out';
  }
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
}

// 원 그리기
function drawCircle(startX, startY, endX, endY, isPreview = false) {
  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;
  const radiusX = Math.abs(endX - startX) / 2;
  const radiusY = Math.abs(endY - startY) / 2;
  const radius = Math.max(radiusX, radiusY);
  
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
  
  if (currentTool === 'circle') {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
  } else if (currentTool === 'eraser') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.globalCompositeOperation = 'destination-out';
  }
  
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
}

// 그리기 시작
function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  const coords = getCoordinates(e);
  startX = coords.x;
  startY = coords.y;
  lastX = startX;
  lastY = startY;
  
  if (currentTool === 'line' || currentTool === 'circle') {
    saveSnapshot();
  }
}

// 그리기 중
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  
  const coords = getCoordinates(e);
  let currentX = coords.x;
  let currentY = coords.y;
  
  const isShiftPressed = e.shiftKey || (e.touches && e.touches.length > 1);
  
  if (currentTool === 'pen') {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
    
  } else if (currentTool === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'destination-out';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    
    lastX = currentX;
    lastY = currentY;
    
  } else if (currentTool === 'line') {
    restoreSnapshot();
    
    if (isShiftPressed) {
      const snapped = snapAngle(startX, startY, currentX, currentY);
      currentX = snapped.x;
      currentY = snapped.y;
    }
    
    drawLine(startX, startY, currentX, currentY, true);
    
  } else if (currentTool === 'circle') {
    restoreSnapshot();
    
    if (isShiftPressed) {
      const dx = currentX - startX;
      const dy = currentY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      currentX = startX + (dx > 0 ? distance : -distance);
      currentY = startY + (dy > 0 ? distance : -distance);
    }
    
    drawCircle(startX, startY, currentX, currentY, true);
  }
}

// 그리기 종료
function stopDrawing(e) {
  if (!isDrawing) return;
  e.preventDefault();
  
  const coords = getCoordinates(e);
  let endX = coords.x;
  let endY = coords.y;
  
  const isShiftPressed = e.shiftKey || (e.touches && e.touches.length > 1);
  
  if (currentTool === 'line') {
    restoreSnapshot();
    
    if (isShiftPressed) {
      const snapped = snapAngle(startX, startY, endX, endY);
      endX = snapped.x;
      endY = snapped.y;
    }
    
    drawLine(startX, startY, endX, endY, false);
    canvasSnapshot = null;
    
  } else if (currentTool === 'circle') {
    restoreSnapshot();
    
    if (isShiftPressed) {
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      endX = startX + (dx > 0 ? distance : -distance);
      endY = startY + (dy > 0 ? distance : -distance);
    }
    
    drawCircle(startX, startY, endX, endY, false);
    canvasSnapshot = null;
  }
  
  isDrawing = false;
}

// 모두 지우기
function clearCanvas() {
  if (confirm('스케치를 모두 지우시겠어요?')) {
    drawGridBackground();
  }
}

// 저장하기 (PNG 다운로드)
function saveCanvas() {
  const link = document.createElement('a');
  link.download = `아이디어-스케치-${new Date().getTime()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// 캔버스 이벤트 리스너
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 터치 이벤트 리스너
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// 도구 버튼 이벤트 리스너
document.querySelectorAll('.tool-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const tool = button.getAttribute('data-tool');
    const color = button.getAttribute('data-color');
    
    if (tool === 'pen' && color) {
      setPenColor(color);
    } else if (tool === 'line' || tool === 'circle') {
      setTool(tool);
    } else if (tool === 'eraser') {
      setEraser();
    } else if (tool === 'clear') {
      clearCanvas();
    } else if (tool === 'save') {
      saveCanvas();
    }
  });
});

// 초기화
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 챗봇 초기화
document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chatContainer');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  
  const ideaChatClear = document.getElementById('ideaChatClear');
  const keywordSuggestions = document.querySelector('.keyword-suggestions');
  
  if (chatContainer && userInput && sendButton) {
    initChatbot({
      messagesContainer: chatContainer,
      inputElement: userInput,
      sendButton: sendButton,
      toggleButton: null,
      closeButton: null,
      windowElement: null,
      loadingIndicator: loadingIndicator,
      titleElement: null,
      clearButton: ideaChatClear,
      systemRole: `너는 아이디어 뱅크 챗봇이야. 학생들이 앞서 배운 12종 센서를 활용하여 구체적인 제품 아이디어를 제안하는 조력자 역할을 해.

중요한 가이드라인:
1. 반드시 기본 12종 센서 중 무엇을 써야 할지 명확하게 알려줘. 센서 이름과 역할을 구체적으로 설명해.
2. 학생이 아이디어를 말하면, 그 아이디어를 실현하기 위해 필요한 센서들을 12종 중에서 골라서 추천해줘.
3. 예시: "🤖 쓰레기 먹는 로봇"이라면 → 초음파센서(장애물 감지), 서보모터(팔 움직임), DC모터(바퀴 이동), LED(상태 표시) 등을 추천.
4. 아이디어가 막연하면 구체적인 질문을 통해 아이디어를 구체화시켜줘. 예: "어떤 문제를 해결하고 싶어?", "어디서 사용할 거야?"
5. 창의적이고 실현 가능한 아이디어를 격려하고, 센서 조합을 제안해줘.
6. 하단 예시 블록(칩)을 활용해 "쓰레기통", "알람" 같은 키워드를 받아 구체적 구현법 제시.
7. 친절하고 열정적인 톤으로 대화해.`,
      initialMessage: "반가워! 나는 **아이디어 뱅크**야. 센서들로 어떤 멋진 물건을 만들고 싶니?",
      storageKey: 'chat_history_IDEAS'
    });
  }

  // 대화 지우기 버튼 추가 이벤트는 chatbot.js에서 처리됨
  // 추가 로직이 필요하면 clearHistory의 콜백을 사용하거나 여기서 처리

  // 예시 키워드 블록 클릭 이벤트
  const keywordBlocks = document.querySelectorAll('.keyword-block');
  keywordBlocks.forEach(block => {
    block.addEventListener('click', () => {
      const keyword = block.dataset.keyword;
      if (userInput) {
        userInput.value = keyword + '에 대해 알려줘';
        userInput.focus();
        // 자동으로 전송
        if (sendButton) {
          sendButton.click();
        }
      }
    });
  });

  // 다음 페이지 버튼 이벤트
  const nextPageButton = document.getElementById('nextPageButton');
  const nextPageContainer = document.getElementById('nextPageContainer');
  const newChatButton = document.getElementById('newChatButton');
  
  if (nextPageButton) {
    nextPageButton.addEventListener('click', () => {
      window.location.href = './practice.html';
    });
  }
  
  if (newChatButton) {
    newChatButton.addEventListener('click', () => {
      // 새로운 채팅 시작
      if (chatContainer) {
        chatContainer.innerHTML = '';
      }
      if (nextPageContainer) {
        nextPageContainer.style.display = 'none';
      }
      // 챗봇 환영 메시지 다시 표시
      if (chatContainer) {
        const persona = detectPersona();
        if (persona && persona.welcomeMessage) {
          addMessage(chatContainer, 'ai', persona.welcomeMessage, false);
        }
      }
      
      // 예시 키워드 블록 다시 표시
      if (keywordSuggestions) {
        keywordSuggestions.style.display = 'block';
      }
    });
  }
  
  // 아이디어 완성 시 다음 페이지 버튼 표시 (간단한 휴리스틱)
  // 실제로는 챗봇 응답에서 "완성" 키워드를 감지하거나, 특정 메시지 수 이상일 때 표시
  let messageCount = 0;
  const originalAddMessage = window.addMessage;
  if (chatContainer) {
    const observer = new MutationObserver(() => {
      messageCount++;
      // 4개 이상의 메시지 교환 후 다음 페이지 버튼 표시
      if (messageCount >= 4 && nextPageContainer) {
        nextPageContainer.style.display = 'block';
      }
    });
    observer.observe(chatContainer, { childList: true });
  }
});

