// Parsley — friendly scripted chatbot for Nikis Lawn & Garden Services.
// Scripted today. To switch to a Claude API backend later, replace the
// body of Parsley.ask() with a fetch() to your serverless endpoint —
// the rest of the UI stays the same.

const KB = [
  {
    match: /(area|cover|norwich|where|located|location)/i,
    reply: "We're based in Norwich, UK and cover the city plus nearby villages. If you're not sure whether you're in our patch, give us a ring on 07843 818290 — we're happy to check.",
  },
  {
    match: /(price|cost|quote|how much|estimate|charge)/i,
    reply: "Every garden is different, so we give you a clear quote based on your space. As a guide: lawn mowing from £25, hedge trimming from £40, full clearance from £120. Want a free on-site quote? Tap 'Book a visit' or open the contact form.",
  },
  {
    match: /(lawn|mow|grass|mowing)/i,
    reply: "Lawn care is our bread and butter — mowing, edging, feeding and seasonal treatments. One-off tidy-ups or weekly rounds, your call.",
  },
  {
    match: /(hedge|trim|prun)/i,
    reply: "We trim hedges and carefully prune small trees — sharp, clean lines and we take all the green waste away with us.",
  },
  {
    match: /(clear|overgrown|bramble|weed|jungle)/i,
    reply: "Overgrown gardens are our favourite challenge. We clear brambles, nettles and years of growth in a single visit and leave a tidy, usable space.",
  },
  {
    match: /(plant|flower|border|bed)/i,
    reply: "We plant fresh borders and seasonal flowers — tell us the look you'd like and we'll suggest what'll thrive in your soil.",
  },
  {
    match: /(book|visit|appoint|when|date|schedule)/i,
    reply: "Lovely — let's get a visit booked. Pick a date in the calendar below the contact form, fill in your details and we'll confirm by phone or email.",
    action: 'book',
  },
  {
    match: /(phone|call|number|contact)/i,
    reply: "Easiest is to ring Niki on 07843 818290, or email nikishomegardens@gmail.com. We also reply on Facebook.",
  },
  {
    match: /(facebook|fb|social|reviews?)/i,
    reply: "Yes! Our Facebook page has photos of recent jobs and lovely client reviews — 100% recommended so far. Tap the Facebook icon on the left rail.",
  },
  {
    match: /(insured|insurance|safe|qualif)/i,
    reply: "We're fully insured and tidy on every job. Tools stay where they belong and we leave the garden cleaner than we found it.",
  },
  {
    match: /(waste|rubbish|green)/i,
    reply: "All green waste is taken away and disposed of responsibly — you don't have to lift a finger after we leave.",
  },
  {
    match: /(hour|time|open|when.*work)/i,
    reply: "We're out in gardens Mon–Sat, roughly 8am to 6pm. Off Sundays unless it's urgent.",
  },
  {
    match: /(hi|hello|hey|hiya|good (morning|afternoon|evening))/i,
    reply: "Hi there! I'm Parsley 🌿 — I help with questions about Nikis Lawn & Garden Services. Ask me about prices, services, areas we cover, or say 'book' to arrange a visit.",
  },
  {
    match: /(thank|thanks|cheers|ta)/i,
    reply: "You're very welcome — give us a shout any time!",
  },
];

const FALLBACK = "I'm not sure about that one, but Niki will know. Best is to ring 07843 818290 or send a message via the contact form — or ask me about prices, services, areas we cover, or booking a visit.";

export const Parsley = {
  ask(text) {
    // TODO: swap in real backend, e.g.
    //   return fetch('/api/parsley', { method:'POST', body: JSON.stringify({ text }) })
    //     .then(r => r.json()).then(j => j.reply);
    return new Promise((resolve) => {
      const t = (text || '').trim();
      if (!t) return resolve({ reply: FALLBACK });
      for (const entry of KB) {
        if (entry.match.test(t)) {
          return resolve({ reply: entry.reply, action: entry.action || null });
        }
      }
      resolve({ reply: FALLBACK });
    });
  },
};

const SUGGESTIONS = ['Prices?', 'Areas you cover?', 'Book a visit', 'Hedge trimming'];

export function mountParsley(root) {
  root.innerHTML = `
    <button class="parsley-fab" type="button" aria-label="Open Parsley chat" aria-expanded="false">
      <span class="parsley-leaf" aria-hidden="true">🌿</span>
      <span class="parsley-fab-text">Chat with Parsley</span>
    </button>
    <div class="parsley-panel" role="dialog" aria-label="Chat with Parsley" hidden>
      <header class="parsley-head">
        <div>
          <strong>Parsley</strong>
          <span>Nikis' garden helper</span>
        </div>
        <button class="parsley-close" type="button" aria-label="Close chat">×</button>
      </header>
      <div class="parsley-log" role="log" aria-live="polite"></div>
      <div class="parsley-suggest"></div>
      <form class="parsley-form" autocomplete="off">
        <input type="text" name="msg" placeholder="Ask about prices, services, booking…" aria-label="Your message" required />
        <button type="submit" aria-label="Send">➤</button>
      </form>
    </div>
  `;

  const fab = root.querySelector('.parsley-fab');
  const panel = root.querySelector('.parsley-panel');
  const closeBtn = root.querySelector('.parsley-close');
  const log = root.querySelector('.parsley-log');
  const form = root.querySelector('.parsley-form');
  const input = form.querySelector('input');
  const suggestWrap = root.querySelector('.parsley-suggest');

  function add(msg, who) {
    const div = document.createElement('div');
    div.className = `parsley-msg parsley-${who}`;
    div.textContent = msg;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    saveSession();
  }

  function saveSession() {
    try {
      sessionStorage.setItem('parsley-log', log.innerHTML);
    } catch (e) {}
  }
  function restoreSession() {
    try {
      const saved = sessionStorage.getItem('parsley-log');
      if (saved) { log.innerHTML = saved; return true; }
    } catch (e) {}
    return false;
  }

  function renderSuggestions() {
    suggestWrap.innerHTML = '';
    SUGGESTIONS.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'parsley-chip';
      b.textContent = s;
      b.addEventListener('click', () => handle(s));
      suggestWrap.appendChild(b);
    });
  }

  async function handle(text) {
    add(text, 'me');
    const { reply, action } = await Parsley.ask(text);
    setTimeout(() => {
      add(reply, 'bot');
      if (action === 'book') {
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        const dateEl = document.getElementById('bookingDate');
        if (dateEl) dateEl.focus();
      }
    }, 250);
  }

  function open() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    document.body.classList.add('parsley-open');
    setTimeout(() => input.focus(), 50);
    if (!log.children.length) {
      add("Hi! I'm Parsley 🌿 — I can answer quick questions about Nikis Lawn & Garden Services. Try a chip below or type a question.", 'bot');
    }
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('parsley-open');
    fab.focus();
  }

  fab.addEventListener('click', () => panel.hidden ? open() : close());
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) close();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    handle(v);
  });

  restoreSession();
  renderSuggestions();
}
