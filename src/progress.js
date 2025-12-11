/**
 * 학습 진도 관리 모듈
 * localStorage를 활용하여 사용자의 학습 단계(Stage)를 관리하고 페이지 이동 권한을 제어합니다.
 */

const STORAGE_KEY = 'my_maker_project_stage';

/**
 * ProgressManager 클래스
 * 학습 진도를 관리하고 페이지 접근 권한을 제어합니다.
 */
export class ProgressManager {
  /**
   * 해당 단계까지 도달했음을 저장합니다.
   * 이미 더 높은 단계에 도달했다면 낮은 단계로 되돌리지 않습니다.
   * @param {number} stageNum - 도달한 단계 번호 (1, 2, 3)
   */
  static unlockStage(stageNum) {
    const currentStage = this.getCurrentStage();
    // 현재 단계가 목표 단계보다 높거나 같으면 업데이트하지 않음
    if (currentStage >= stageNum) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, stageNum.toString());
  }

  /**
   * 현재 저장된 학습 단계를 반환합니다.
   * @returns {number} 현재 단계 (기본값: 1)
   */
  static getCurrentStage() {
    const stage = localStorage.getItem(STORAGE_KEY);
    return stage ? parseInt(stage, 10) : 1;
  }

  /**
   * 해당 페이지에 접근할 자격이 있는지 확인합니다.
   * @param {number} stageNum - 접근하려는 페이지의 단계 번호
   * @returns {boolean} 접근 가능 여부
   */
  static canAccess(stageNum) {
    const currentStage = this.getCurrentStage();
    return currentStage >= stageNum;
  }

  /**
   * 현재 페이지에 접근 권한이 없으면 경고창을 띄우고 적절한 페이지로 강제 이동시킵니다.
   * 경로를 자동 감지하여 권한을 확인합니다 (Netlify 호환성: .includes() 사용)
   */
  static checkAuth() {
    const pathname = window.location.pathname;
    const currentStage = this.getCurrentStage();
    
    // sensors 페이지(2페이지) 체크
    if (pathname.includes('sensors') || pathname.includes('sencors')) {
      if (currentStage < 2) {
        alert('아직 아이디어를 구상하지 않았어요!');
        window.location.href = '/index.html';
        return;
      }
    }
    
    // practice 페이지(3페이지) 체크
    if (pathname.includes('practice')) {
      if (currentStage < 3) {
        alert('센서 공부를 먼저 하고 오세요!');
        window.location.href = '/sencors.html';
        return;
      }
    }
    
    // 그 외(이미 깬 단계거나 낮은 단계 페이지): 통과
  }
}

