/* Same contact service as the Janin portfolio, kept inside the prism scene. */
(function () {
  'use strict';
  var form = document.getElementById('contact-form'), status = document.getElementById('contact-status'), opened = Date.now();
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var button = form.querySelector('button');
    if (button.disabled) return;
    button.disabled = true; status.textContent = 'Sending…';
    try {
      var data = Object.fromEntries(new FormData(form));
      var response = await fetch('https://s-home.catfish-teeth.ts.net/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign(data, { t: opened }))
      });
      if (response.ok) { form.reset(); status.textContent = 'Sent. Thank you! · 전송되었습니다.'; }
      else { status.textContent = response.status === 429 ? 'Please try again later. · 잠시 후 다시 시도해주세요.' : 'Please check the fields and try again. · 입력 내용을 확인해주세요.'; }
    } catch (error) { status.textContent = 'Could not send. Please retry or use the email link. · 재시도하거나 아래 메일 링크를 이용해주세요.'; }
    button.disabled = false;
  });
})();
