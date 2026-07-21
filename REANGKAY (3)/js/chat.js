/* ==========================================================================
   CHAT.JS — Consultation chat simulation (no backend)
   ========================================================================== */

(function(){
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  if(!form || !input || !messages) return;

  const mockReplies = [
    "Thanks for sharing that with me. Can you tell me how long you've been feeling this way?",
    "That's a completely normal thing to experience at your age — you're not alone in this.",
    "I'd recommend tracking this for a few days. Would you like some tips in the meantime?",
    "You're doing the right thing by asking. Let's go through this together, step by step.",
    "If this feels urgent or you're in distress, please use the Emergency page to get immediate help."
  ];

  function scrollToBottom(){
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, who = 'me'){
    const row = document.createElement('div');
    row.className = `msg-row ${who} fade-in`;
    const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    row.innerHTML = `
      <div>
        <div class="bubble ${who === 'me' ? 'me' : 'them'}">${text}</div>
        <div class="msg-time ${who === 'me' ? 'text-end' : ''}">${time}</div>
      </div>`;
    messages.appendChild(row);
    scrollToBottom();
  }

  function showTyping(){
    const row = document.createElement('div');
    row.className = 'msg-row them';
    row.id = 'typingRow';
    row.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    messages.appendChild(row);
    scrollToBottom();
  }

  function hideTyping(){
    const t = document.getElementById('typingRow');
    if(t) t.remove();
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const val = input.value.trim();
    if(!val) return;
    addMessage(val, 'me');
    input.value = '';

    showTyping();
    setTimeout(() => {
      hideTyping();
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      addMessage(reply, 'them');
    }, 1400 + Math.random() * 900);
  });

  // Quick attach / emoji / camera buttons — demo toasts only
  document.querySelectorAll('.chat-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(window.showToast) showToast(`${btn.dataset.tool || 'Feature'} — prototype only`, 'fa-circle-info');
    });
  });

  scrollToBottom();
})();
