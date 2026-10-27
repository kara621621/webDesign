// Classroom companion only. No API keys or network calls are made here.
(()=>{
'use strict';
const $=id=>document.getElementById(id);
let exercise='free';
const names={free:'자유 주제 디자인',prd:'우리 회사 PRD 디자인',image:'이미지·브랜드 색상 적용'};
const config={mcpServers:{stitch:{serverUrl:'https://stitch.googleapis.com/mcp',headers:{'X-Goog-Api-Key':'YOUR_STITCH_API_KEY'}}}};
const prompts={
 palette:'현재 선택한 홈페이지 화면의 주요 브랜드 색상 4개를 HEX 코드(#RRGGBB)로 정리해 주세요. 주색 / 보조색 / 배경색 / 강조색 순서로 각각 색상 코드와 용도를 알려 주세요. 추출한 값인지 제안한 값인지 구분해 주세요.',
 check:'Stitch MCP 연결을 확인해 주세요. 내 Stitch 프로젝트 목록의 이름과 ID를 보여 주세요. 지금은 프로젝트를 새로 만들거나 기존 디자인을 수정하지 마세요. 연결할 수 없으면 연결 오류와 확인할 설정을 설명해 주세요.',
 install:'https://github.com/google-labs-code/stitch-skills.git\n이 저장소의 최신 README와 폴더 구조를 확인하고 Stitch 스킬을 현재 프로젝트의 .agents/skills/에 설치해 주세요. plugins/*/skills/ 아래의 각 스킬 폴더와 내부 리소스를 함께 가져오고, 기존 스킬은 덮어쓰지 마세요. 원본 LICENSE와 출처도 보관해 주세요. 전역 설치는 하지 마세요. 설치한 SKILL.md 목록과 인식 여부를 확인하고 다음 대화에서 사용할 수 있도록 안내해 주세요. API 키나 MCP 인증 설정은 스킬 설치와 별개로 처리해 주세요.',
 can:'현재 프로젝트의 .agents/skills/에 있는 Stitch 관련 SKILL.md를 확인해 주세요. 각 스킬로 할 수 있는 일을 쉬운 한국어로 설명하고, 홈페이지 제작 수업에서 바로 쓸 수 있는 요청 예시를 하나씩 제시해 주세요. MCP 연결이 필요한 작업과 연결 없이 할 수 있는 문서·프롬프트 작업을 구분해 주세요.',
 korea:`AI Stitch 스킬을 이용해서 한국을 소개하는 웹사이트를 만들어 주세요.

[작업 준비]
현재 프로젝트의 .agents/skills/에 있는 실제 스킬을 먼저 확인해 주세요. enhance-prompt로 요청을 다듬고, stitch::generate-design으로 디자인을 생성하며, design-md로 디자인 기준을 정리해 주세요. 없는 스킬이나 MCP 도구를 사용했다고 말하지 마세요. 연결이 없으면 필요한 설정을 먼저 알려 주세요.

[새 실습 프로젝트]
기존 회사 홈페이지를 덮어쓰지 않도록 korea-intro/ 폴더에서 작업해 주세요. Stitch에는 'Discover Korea — 수업 실습'이라는 별도 프로젝트를 사용해 주세요.

[웹사이트 내용]
한국을 처음 방문하는 외국인에게 한국의 도시·음식·문화·자연을 소개하는 한국어 원페이지 홈페이지입니다.
메인 제목: 한국, 전통과 오늘이 만나는 곳
영역: 히로 → 서울·부산·경주·제주 소개 → 한국 음식 → 문화와 자연 → 여행 준비 FAQ.
도시 소개 메뉴와 '한국 둘러보기' 버튼은 해당 영역으로 이동하고 FAQ는 열고 닫히게 해 주세요.

[디자인]
현대적인 에디토리얼 스타일, 넓은 여백, 큰 한글 제목, 카드와 이미지의 균형. 주색 #183D36 / 보조색 #B75B42 / 배경색 #F7F2E8 / 강조색 #DCC78A를 사용해 주세요. 제공한 이미지가 없으면 임시 이미지임을 명시한 도형으로 구성하고, 실제 기관 로고는 사용하지 마세요. 모바일에서도 읽기 편하게 만들어 주세요.

[구현과 확인]
Stitch에서 사용할 화면의 프로젝트 ID·화면 ID를 확인하고 선택한 화면만 구현에 사용해 주세요. 새 React 프로젝트를 쓰는 경우 stitch::react-components의 절차를 따라 주세요. 기존 구조에 합치는 대신 독립 폴더를 유지해 주세요. 디자인만 만든 상태와 웹사이트 구현 완료를 구분해 주세요. 운영시간·요금·비자 등 확인되지 않은 최신 정보는 만들지 마세요. 완성 후 실행 방법과 미리보기를 보여 주고 메뉴 이동·FAQ·모바일 가로 넘침을 확인해 주세요.`
};
const status=text=>{$('stStatus').textContent=text;};
function colors(){return [1,2,3,4].map(i=>$('stColor'+i).value.trim());}
function validColors(){return colors().every(v=>/^#[0-9a-fA-F]{6}$/.test(v));}
function render(){
 document.querySelectorAll('[data-st-context]').forEach(el=>el.hidden=el.dataset.stContext!==exercise);
 document.querySelectorAll('[data-st-exercise]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.stExercise===exercise)));
 $('stPromptTitle').textContent=names[exercise];
 let text='';
 if(exercise==='free')text=`${$('stTheme').value.trim()||'[자유 주제]'} 홈페이지의 첫 화면과 주요 영역을 디자인해 주세요.\n대상 고객과 핵심 메시지를 먼저 정리하고, 메인 제목·설명·행동 버튼·서비스 또는 콘텐츠 카드·FAQ를 배치해 주세요. PC와 모바일에서 읽기 편한 화면, 명확한 글자 위계와 여백을 사용해 주세요. 우선 하나의 디자인을 만든 뒤 제가 원하는 부분을 수정할 수 있도록 해 주세요.`;
 if(exercise==='prd')text='아래 홈페이지 PRD를 기준으로 Web 화면을 디자인해 주세요.\nPRD의 목적·고객·영역 순서·회사 문구·버튼 목적을 유지하고, 메인부터 문의 영역까지 일관된 디자인으로 구성해 주세요. 제공하지 않은 실적·인증·가격은 추가하지 마세요. 문의 영역은 디자인만 만들고 실제 저장 기능은 구현 완료로 표시하지 마세요. PC와 모바일 배치를 함께 고려해 주세요.\n\n[홈페이지 PRD]\n'+($('d2Prd').value.trim()||'[1교시에 PRD를 가져오거나 붙여 넣으세요]');
 if(exercise==='image')text=`첨부한 참고 이미지를 활용해 현재 웹사이트의 히로 섹션을 수정해 주세요.\n\n[브랜드 컬러 4개]\n주색: ${colors()[0]}\n보조색: ${colors()[1]}\n배경색: ${colors()[2]}\n강조색: ${colors()[3]}\n\n이미지의 주요 색상을 위 네 가지 브랜드 컬러와 어울리도록 변경하고, 이미지 안에 포함된 텍스트는 제거해 주세요. 첨부 이미지의 형태·구도·주요 모티프를 히로 섹션의 시각 요소에 적용해 주세요. 사진 속 사물과 인물이 있다면 자연스러움을 유지해 주세요. 웹사이트의 제목·설명·버튼은 HTML 텍스트로 별도 배치해 주세요. 제목이 잘 읽히도록 시각 요소 옆에 여백을 확보하고 모바일에서는 글자와 이미지가 겹치지 않게 해 주세요.\n원본 이미지 편집을 직접 수행할 수 없는 경우 그 한계를 알려 주고, 레이아웃 적용과 원본 이미지 편집을 구분해 주세요.`;
 $('stDesignPrompt').value=text;
}
async function copy(text,button){let ok=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);ok=true;}}catch{}if(!ok){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();ok=document.execCommand('copy');t.remove();}status(ok?'복사했습니다. 안내된 도구에 붙여 넣으세요.':'자동 복사가 지원되지 않습니다. 요청문을 선택해 직접 복사하세요.');const before=button.dataset.copyLabel||button.textContent;button.dataset.copyLabel=before;clearTimeout(Number(button.dataset.copyTimer||0));button.textContent=ok?'복사됨 ✓':'직접 복사해 주세요';button.dataset.copyTimer=String(setTimeout(()=>button.textContent=before,1800));}
function setTab(id){document.querySelectorAll('[data-st-pane]').forEach(el=>el.hidden=el.dataset.stPane!==id);document.querySelectorAll('[data-st-tab]').forEach(el=>{const active=el.dataset.stTab===id;el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1;});status('');render();}
document.querySelectorAll('[data-st-tab]').forEach((b,index,buttons)=>{b.addEventListener('click',()=>setTab(b.dataset.stTab));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;setTab(buttons[i].dataset.stTab);buttons[i].focus();});});
document.querySelectorAll('[data-st-exercise]').forEach(b=>b.addEventListener('click',()=>{exercise=b.dataset.stExercise;render();status('');}));
$('stTheme').addEventListener('input',render);$('d2Prd').addEventListener('input',render);
for(let i=1;i<=4;i++)$('stColor'+i).addEventListener('input',()=>{const v=$('stColor'+i).value.trim(),valid=/^#[0-9a-fA-F]{6}$/.test(v);$('stColor'+i).setAttribute('aria-invalid',String(!valid));$('stSwatch'+i).style.background=valid?v:'transparent';render();});
document.querySelectorAll('[data-st-copy]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.stCopy;if(key==='design'){render();if(exercise==='prd'&&!$('d2Prd').value.trim()){status('1교시에서 최종 PRD를 먼저 가져오세요.');return;}if(exercise==='free'&&!$('stTheme').value.trim()){status('자유 주제를 적어 주세요.');$('stTheme').focus();return;}if(exercise==='image'&&!validColors()){status('색상 4개를 #RRGGBB 형식으로 입력하세요.');return;}}const text=key==='design'?$('stDesignPrompt').value:key==='config'?JSON.stringify(config,null,2):prompts[key];copy(text,b);}));
$('stConfig').value=JSON.stringify(config,null,2);$('stKoreaPrompt').value=prompts.korea;
// Re-entering the lesson refreshes the PRD from the existing Day 2 worksheet.
document.querySelectorAll('[data-d2-step="3"],[data-d2-go="3"]').forEach(b=>b.addEventListener('click',render));
setTab('design');
})();
