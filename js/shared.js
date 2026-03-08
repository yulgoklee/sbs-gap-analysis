// ═══════════════════════════════════════════════════════
//  SHARED — API KEY 관리 (gap-analysis · aptitude-test 공통)
//  ※ gap-analysis.html, aptitude-test.html 양쪽에서 로드됩니다.
// ═══════════════════════════════════════════════════════

let apiKey = '';
const LS_KEY = 'sbs_gemini_api_key';

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('API 키를 입력해주세요.'); return; }
  apiKey = key;
  localStorage.setItem(LS_KEY, key);
  document.getElementById('apiModal').style.display = 'none';
}

function changeApiKey() {
  document.getElementById('apiKeyInput').value = localStorage.getItem(LS_KEY) || '';
  document.getElementById('apiModal').style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) { apiKey = saved; document.getElementById('apiModal').style.display = 'none'; }
});
