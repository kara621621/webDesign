/**
 * ==========================================================================
 * 모아워크 (MOAWORK) 프리미엄 인터랙션 및 구글 시트 연동 스크립트 (script.js)
 * - 도자기 마켓 감성의 부드러운 스크롤, 블러 헤더 인터랙션, 아코디언, 유효성 검사
 * - 구글 앱스 스크립트(Google Apps Script) 연동 실시간 데이터 자동 저장
 * 
 * [목차]
 * 1. 구글 앱스 스크립트 웹 앱 URL 설정
 * 2. 헤더 스크롤 감지 및 블러 효과 (Header Scrolled State)
 * 3. 모바일 햄버거 메뉴 토글 기능
 * 4. 상단 메뉴 및 버튼 부드러운 스크롤 이동
 * 5. FAQ 아코디언 펼침/닫힘 기능
 * 6. 문의 폼 유효성 검사 및 구글 시트 전송 (Validation & Fetch)
 * 7. 접수 완료 모달 제어
 * ==========================================================================
 */

/**
 * --------------------------------------------------------------------------
 * [1] 구글 앱스 스크립트 웹 앱 URL 설정
 * --------------------------------------------------------------------------
 * 구글 스프레드시트 -> [확장 프로그램] -> [Apps Script]에서 배포 후
 * 발급받으신 웹 앱 URL(https://script.google.com/macros/s/.../exec)을
 * 아래 따옴표 안에 붙여넣어 주시면 됩니다.
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkDeTv0WuTYUu45oA435tKccSOHv24PscSgkmZHLjMJxCpUKHozXzwB4Y2v4dF6521/exec';

// HTML 문서의 모든 요소가 안전하게 로드된 후 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     [2] 헤더 스크롤 감지 (도자기 마켓 감성의 은은한 블러 & 섀도우)
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* --------------------------------------------------------------------------
     [3] 모바일 네비게이션 햄버거 메뉴 열기/닫기
     -------------------------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    // 햄버거 버튼 클릭 이벤트
    mobileToggleBtn.addEventListener('click', () => {
      // active 클래스를 토글하여 메뉴를 열거나 닫습니다.
      const isOpen = navMenu.classList.toggle('active');
      mobileToggleBtn.classList.toggle('active');

      // 웹 접근성(스크린 리더)을 위한 상태값 갱신
      mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // 모바일 메뉴 항목 중 하나를 클릭하면 메뉴 창을 자동으로 닫아줍니다.
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileToggleBtn.classList.remove('active');
          mobileToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     [4] 부드러운 스크롤 이동 보조
     - '상담 준비하기' 버튼 및 상단 메뉴 클릭 시 대상 영역으로 부드럽게 이동합니다.
     -------------------------------------------------------------------------- */
  const smoothScrollTriggers = document.querySelectorAll('a[href^="#"]');

  smoothScrollTriggers.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // '#' 단독 링크가 아닐 때만 이동 로직 수행
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault(); // 기본 순간 이동 방지
          
          // 대상 요소의 위치로 부드럽게 스크롤
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // 브라우저 주소창 해시(#) 업데이트 (뒤로가기 지원)
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     [5] FAQ 아코디언 토글 기능
     - 질문(Question) 버튼 클릭 시 답변(Answer)의 높이를 조절하여 부드럽게 펼치고 접습니다.
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');

        // 다른 열려 있는 FAQ 항목들을 닫아줍니다 (원페이지 깔끔 유지)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // 현재 클릭한 항목 상태 토글
        if (isCurrentlyActive) {
          // 이미 열려 있으면 닫기
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          // 닫혀 있으면 열기 (실제 내부 높이 scrollHeight를 계산하여 부드럽게 펼침)
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     [6] 문의 폼 유효성 검사 및 구글 스프레드시트 실시간 전송
     - 1단계: 필수 입력값(이름, 연락 방법, 문의 내용) 검증
     - 2단계: 전송 중 로딩 상태 표시 (중복 클릭 방지)
     - 3단계: Google Apps Script Web App으로 JSON 비동기(fetch) 전송
     - 4단계: 정상 전송 완료 시 성공 모달 표시 및 폼 초기화
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('user-name');
  const contactInput = document.getElementById('user-contact');
  const messageInput = document.getElementById('user-message');
  const submitBtn = document.getElementById('form-submit-btn');

  const nameError = document.getElementById('name-error');
  const contactError = document.getElementById('contact-error');
  const messageError = document.getElementById('message-error');

  // 상태 안내 모달 관련 요소
  const statusModal = document.getElementById('status-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPreviewName = document.getElementById('modal-preview-name');
  const modalPreviewContact = document.getElementById('modal-preview-contact');

  // 에러 메시지 표시 함수
  function showError(inputElement, errorElement, message) {
    inputElement.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }

  // 에러 메시지 제거 함수
  function clearError(inputElement, errorElement) {
    inputElement.classList.remove('input-error');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }

  // 사용자가 입력을 시작하면 에러 스타일과 경고 메시지를 즉시 지워줍니다.
  if (nameInput) {
    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
  }
  if (contactInput) {
    contactInput.addEventListener('input', () => clearError(contactInput, contactError));
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => clearError(messageInput, messageError));
  }

  // 폼 제출 이벤트 핸들러 (async/await 비동기 처리)
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      // 브라우저의 기본 페이지 새로고침 동작을 중단합니다.
      e.preventDefault();

      let isValid = true;

      // 1. 이름/상호명 검증
      const nameValue = nameInput.value.trim();
      if (!nameValue) {
        showError(nameInput, nameError, '이름 또는 상호명을 입력해 주세요.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // 2. 연락 방법 검증
      const contactValue = contactInput.value.trim();
      if (!contactValue) {
        showError(contactInput, contactError, '연락받으실 전화번호 또는 이메일을 입력해 주세요.');
        isValid = false;
      } else {
        clearError(contactInput, contactError);
      }

      // 3. 문의 내용 검증
      const messageValue = messageInput.value.trim();
      if (!messageValue) {
        showError(messageInput, messageError, '상담 문의 내용을 입력해 주세요.');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      // 만약 하나라도 빈칸이 있다면 포커스를 첫 번째 에러 필드로 이동하고 종료합니다.
      if (!isValid) {
        if (!nameValue) {
          nameInput.focus();
        } else if (!contactValue) {
          contactInput.focus();
        } else if (!messageValue) {
          messageInput.focus();
        }
        return;
      }

      // 4. 구글 앱스 스크립트로 보낼 데이터 객체 준비
      const payload = {
        userName: nameValue,
        userContact: contactValue,
        userMessage: messageValue
      };

      // 5. 버튼을 "접수 처리 중..." 상태로 변경하여 중복 제출 방지
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>접수 처리 중...</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
        `;
      }

      // 6. 구글 앱스 스크립트 웹 앱 URL이 설정되지 않았을 경우의 친절한 안내 처리
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('여기에_발급받으신_웹앱_URL을_붙여넣으세요')) {
        setTimeout(() => {
          alert('💡 [안내] 구글 앱스 스크립트 웹 앱 URL이 아직 입력되지 않았습니다.\nscript.js 상단의 GOOGLE_SCRIPT_URL 변수에 발급받으신 주소를 넣으면 구글 스프레드시트에 즉시 저장됩니다.');
          
          // 화면 테스트를 위해 모달을 표시해 줍니다.
          if (statusModal) {
            if (modalPreviewName) modalPreviewName.textContent = `• 신청자: ${nameValue}`;
            if (modalPreviewContact) modalPreviewContact.textContent = `• 연락처: ${contactValue}`;
            statusModal.removeAttribute('hidden');
            if (modalCloseBtn) modalCloseBtn.focus();
          }

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }, 500);
        return;
      }

      // 7. 실제 구글 앱스 스크립트로 데이터 전송 (CORS 이슈 방지를 위해 text/plain 방식 사용)
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data && data.result === 'success') {
          // 성공 시: 입력 폼 초기화
          contactForm.reset();

          // 성공 모달 표시
          if (statusModal) {
            if (modalPreviewName) {
              modalPreviewName.textContent = `• 신청자: ${nameValue}`;
            }
            if (modalPreviewContact) {
              modalPreviewContact.textContent = `• 연락처: ${contactValue}`;
            }
            statusModal.removeAttribute('hidden');
            if (modalCloseBtn) {
              modalCloseBtn.focus();
            }
          }
        } else {
          // 서버에서 에러를 반환했을 때
          alert('상담 접수 저장 중 오류가 발생했습니다: ' + (data.message || '다시 시도해 주세요.'));
        }

      } catch (networkError) {
        console.error('구글 앱스 스크립트 통신 에러:', networkError);
        alert('서버 연결 중 일시적인 오류가 발생했습니다. 구글 앱스 스크립트의 배포 권한("모든 사용자") 설정을 확인해 주세요.');
      } finally {
        // 전송 완료 후 버튼 원래 상태로 복원
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }

    });
  }

  /* --------------------------------------------------------------------------
     [7] 안내 모달 닫기 버튼 이벤트 제어
     -------------------------------------------------------------------------- */
  if (modalCloseBtn && statusModal) {
    // 확인 버튼 클릭 시 모달 닫기
    modalCloseBtn.addEventListener('click', () => {
      statusModal.setAttribute('hidden', '');
    });

    // 모달 배경 클릭 시에도 닫히도록 설정
    statusModal.addEventListener('click', (e) => {
      if (e.target === statusModal) {
        statusModal.setAttribute('hidden', '');
      }
    });

    // ESC 키를 눌렀을 때도 닫히도록 설정 (웹 접근성 향상)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !statusModal.hasAttribute('hidden')) {
        statusModal.setAttribute('hidden', '');
      }
    });
  }

});
