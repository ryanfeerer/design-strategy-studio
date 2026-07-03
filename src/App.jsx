import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Lock, Unlock, ChevronRight, ChevronDown, X, Sparkles, Download,
  Upload, FileDown, Plus, Pin, RotateCcw, Check, AlertCircle,
  MessageCircle, BookOpen, Users, Layers, Target, Compass, Palette,
  Presentation as PresentationIcon, FileText, Loader2, ArrowRight, Save,
  Fingerprint, ToggleLeft, Lightbulb, Volume2, UserCircle2
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap');
`;

const T = {
  ink: "#241C38",        // primary text — dark purple
  inkSoft: "#6A6080",
  paper: "#EAE2F3",       // the page itself — light lavender, like the publication
  paperRaised: "#FFFFFF", // forms, cards, inputs — white, placed on the paper
  line: "#DDD2EC",
  rule: "#C81E73",        // magenta — rules, dividers, moments of emphasis. Never a fill.
  signal: "#463876",      // deep lavender-ink — links, coaching voice, text on accent surfaces
  signalSoft: "#EFE8F8",
  marigold: "#DFA637",    // confidence, declaration, commitment — locked decisions
  marigoldSoft: "#F7E9C9",
  lavender: "#DCCCEC",    // reflection accent surface — deeper than the page, for moments that need to stand apart on white
};

/* ============================================================
   STRATEGY HANDBOOK CONTENT
   ============================================================ */
const HANDBOOK = {
  observation: {
    title: "Observation",
    def: "A single, specific thing you noticed or found — sourced, not invented.",
    matters: "Observations are the raw material of strategy. Weak strategy almost always traces back to thin or generic observation.",
    pro: "Professionals log observations obsessively and separately from what they think those observations mean — the two get confused constantly, and keeping them apart is what makes the next step possible.",
    example: "Branding: \"Three of five reviews mention the wait being 'worth it.'\" UX: \"Users tap the back button after the confirmation screen 40% of the time in usability tests.\"",
    misconception: "An opinion stated confidently is not an observation. \"People want authenticity\" is a claim, not an observation, unless it's tied to something you actually saw or heard.",
    related: ["Pattern", "Evidence"],
    stage: "You're likely seeing this while adding Research cards — every card should be one observation, one source.",
    ask: "Where did this come from? Could I point someone to it?",
  },
  pattern: {
    title: "Pattern",
    def: "A named interpretation of why several observations belong together — a claim, not a category.",
    matters: "This is where raw research turns into thinking. Anyone can collect information; naming what it means is the actual strategic skill.",
    pro: "Strategists cluster loosely at first, then tighten — a pattern name should survive being said out loud to someone who hasn't seen the research.",
    example: "Branding: \"Customers treat this bakery as a weekend ritual, not an errand.\" Editorial design: \"Readers skim headlines but slow down for pull quotes — attention is front-loaded and re-triggered, not sustained.\"",
    misconception: "A pattern that just restates its cards (\"Audience Preferences\") isn't a pattern yet — it's a folder name.",
    related: ["Observation", "Insight"],
    stage: "You're grouping research cards on the wall — try finishing: 'these observations suggest that...'",
    ask: "If I only read this sentence, would I understand why these belong together?",
  },
  insight: {
    title: "Insight",
    def: "A pattern reframed as a tension or truth that reveals an opportunity — what it is: a lens; what it isn't: a summary.",
    matters: "Insights are different from observations because they explain, not just describe. An observation says what happened; an insight says why it matters.",
    pro: "In a real strategy sprint, a team can spend days on one insight — it's usually the highest-leverage sentence in the whole project.",
    example: "Branding: a bakery finds that customers aren't buying bread, they're buying a reason to slow down. UX: a checkout flow finds that users don't distrust the price, they distrust not knowing the price sooner.",
    misconception: "\"Our audience is busy\" is an observation. \"Our audience associates busyness with guilt, and rewards brands that give them permission to slow down\" is closer to an insight.",
    related: ["Pattern", "Opportunity"],
    stage: "You're writing your Opportunity — ground it in an insight, not just a pattern.",
    ask: "What does this reveal that wasn't obvious before I said it?",
  },
  opportunity: {
    title: "Opportunity",
    def: "A gap or tension your research surfaced that the work is positioned to address.",
    matters: "Opportunities emerge from research, not brainstorming — a good opportunity should be traceable to something you found, not something you wished were true.",
    pro: "Professionals pressure-test an opportunity by asking who would disagree with it, and whether the evidence survives that disagreement.",
    example: "Branding: a gap between how a bakery sees itself and how loyal customers describe it. Information design: a gap between what a dataset shows and what audiences currently believe about it.",
    misconception: "An opportunity isn't a wish list item (\"we could be more social-media-friendly\") — it's a claim about the world your research supports.",
    related: ["Insight", "Positioning"],
    stage: "This is your first hard decision lock — it needs at least one linked pattern.",
    ask: "Which research most influenced this? What would change my mind?",
  },
  positioning: {
    title: "Positioning",
    def: "A single sentence stating the audience, market, promise, and reason to believe — the competitive bet the work is making.",
    matters: "Everything after this sentence is unpacking, not inventing. If positioning is vague, everything built on it inherits that vagueness.",
    pro: "A quick test professionals use: swap in a competitor's name. If the sentence still reads true, it isn't sharp enough yet.",
    example: "Branding: an identity system built around one competitive claim. UX: a product's positioning against a more feature-heavy competitor, betting on simplicity instead.",
    misconception: "Positioning is not the same as messaging or mission — mission is a philosophy; positioning is a market bet with a shelf life.",
    related: ["Opportunity", "Pillar"],
    stage: "This becomes the spine of your whole project — everything downstream references it.",
    ask: "Could a direct competitor say this exact sentence? If so, it's not sharp enough yet.",
  },
  pillar: {
    title: "Strategic Pillar",
    def: "A small number of derived, usable ideas that unpack the positioning into something a team can act on day to day.",
    matters: "Pillars translate one sentence into working tools without losing the thread back to it — they should never be invented fresh.",
    pro: "Professionals test pillars for real tradeoffs: a pillar's opposite should be something an actual competitor could plausibly choose, not a strawman.",
    example: "Branding: \"unhurried, not slow\" as a lived brand pillar. Environmental graphics: \"wayfinding that trusts the visitor\" as a pillar guiding how much signage is enough.",
    misconception: "A pillar with no visible connection to positioning is just a nice-sounding value — not strategy.",
    related: ["Positioning", "Voice & Tone"],
    stage: "Each pillar needs a one-line link back to your positioning statement to lock.",
    ask: "Which part of my positioning does this actually come from?",
  },
  evidence: {
    title: "Evidence",
    def: "Anything — a sourced observation, a pattern, a prior locked decision — that a claim can be traced back to.",
    matters: "Evidence is what separates a strategic decision from an opinion stated with confidence. This app requires it before letting a decision lock.",
    pro: "Professional strategists keep receipts — not for bureaucracy, but because a claim that can't be traced back to something is the first thing a tough client or reviewer will find.",
    example: "Branding: citing which research shaped a positioning choice. UX: citing which usability finding justified a navigation change.",
    misconception: "A strong opinion, repeated confidently, is not evidence — even your own.",
    related: ["Observation", "Pattern"],
    stage: "You'll be asked to link evidence before locking most decisions in this app.",
    ask: "If someone doubted this, what would I point to?",
  },
};

/* ============================================================
   CLAUDE API HELPER
   ============================================================ */
async function askClaude(systemFrame, userText, maxTokens = 350) {
  // Calls the local Vite dev proxy (see vite.config.js), which forwards this
  // to Anthropic's API and injects the API key server-side. See README.md.
  try {
    const res = await fetch("/api/anthropic/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: `${systemFrame}\n\n---\nStudent's current input:\n"${userText}"\n\nRespond as described above. Keep it to 2-4 sentences, conversational, no headers or markdown formatting.`,
          },
        ],
      }),
    });
    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return text || "I couldn't quite process that — try rephrasing and asking again.";
  } catch (e) {
    return "Coaching is temporarily unavailable — keep working, you can ask again in a moment.";
  }
}

function getCoachPersona(level) {
  const lvl = level || "sophomore";
  const base = `You are an experienced design strategy professor doing a desk critique with a student inside a strategy app called Design Strategy Studio. You NEVER write the student's content for them. You sound like a real person thinking out loud beside the student, not a chatbot — no bullet lists, no "Great question!" filler, no diagnostic-sounding verdicts ("this is too generic," "this lacks evidence"). Curious and encouraging, never authoritative or prescriptive. When a student answers vaguely, or seems stuck and unable to articulate what they want, teach through contrast: ask what the WRONG answer would look like before asking for the right one — "what would feel completely wrong here?" rather than "what do you want?" Naming a boundary is often easier than naming a point inside it, and the contrast itself does real diagnostic work. Use this as a real technique, not just when explicitly asked.`;

  if (lvl === "sophomore") {
    return `${base} This student is a sophomore, early in learning to think this way — assume they don't yet have the instinct for what makes a strong answer, and that's completely normal. Break your response into small, concrete, easy-to-answer questions rather than one large abstract one — the kind a professor asks before the hard question, not instead of it (e.g. "what did the client literally ask for?" before "what's the real problem?"). Never lead with a hard, abstract question they won't know how to enter. Keep questions warm and specific, one at a time, and give them an easy foothold. Where it helps, offer a quick concrete example or analogy from an everyday brand or situation to make the concept click — don't leave them guessing what you mean in the abstract. If they land on something strong, name it plainly so they know what "good" felt like.`;
  }
  if (lvl === "junior") {
    return `${base} This student is a junior — they've done this before and can handle more direct challenge. Ask one or two sharp, specific follow-up questions that would lead them to notice a gap themselves, rather than pointing it out for them. Use examples sparingly, only when genuinely useful, not as a default crutch — lean on the challenge itself to do the teaching. You can move faster and skip the smallest scaffolding questions; assume they can hold a moderately abstract question. Only explain directly as a last resort, briefly, after your questions.`;
  }
  // senior
  return `${base} This student is a senior, close to graduating — treat this more like a peer critique than instruction. Don't offer examples or scaffolding; go straight at the logic and specificity of what they wrote — does the claim actually follow, is it specific enough to be falsifiable, would it survive a skeptical client pushing back on it. Push hard on the weakest point with a pointed question, the way you'd challenge a colleague, not a student. If the work is strong, say so in a sentence and raise the bar with a harder question rather than stopping there.`;
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Term({ id, children, onOpen }) {
  return (
    <button
      onClick={() => onOpen(id)}
      className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
      style={{ color: T.signal, textDecorationColor: T.signal, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function Chip({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "transparent", fg: T.inkSoft, border: T.line },
    lavender: { bg: T.lavender, fg: T.signal, border: T.lavender },
  };
  const c = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 tracking-wide"
      style={{ fontSize: "11px", background: c.bg, color: c.fg, border: `1px solid ${c.border}`, fontFamily: "Instrument Sans", fontWeight: 500 }}
    >
      {children}
    </span>
  );
}

function CoachBox({ systemFrame, studentText, disabled, label = "Talk it through" }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const ask = async () => {
    if (!studentText || !studentText.trim()) return;
    setLoading(true);
    setResponse("");
    const r = await askClaude(systemFrame, studentText);
    setResponse(r);
    setLoading(false);
  };

  return (
    <div className="mt-3">
      <button
        onClick={ask}
        disabled={disabled || loading || !studentText?.trim()}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium disabled:opacity-40 transition"
        style={{ fontSize: "13px", background: T.signalSoft, color: T.signal, fontFamily: "Instrument Sans" }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
        {loading ? "Thinking it over…" : label}
      </button>
      {response && (
        <div
          className="mt-3 pl-5 pr-4 py-3 rounded-lg fade-in"
          style={{ background: T.lavender }}
        >
          <div className="uppercase tracking-wider font-semibold mb-1.5" style={{ fontSize: "11px", color: T.signal, fontFamily: "Instrument Sans" }}>
            Your professor, leaning in
          </div>
          <p className="leading-relaxed italic" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>
            {response}
          </p>
        </div>
      )}
    </div>
  );
}

function ReflectionModal({ prompts, onSubmit, onClose }) {
  const [answers, setAnswers] = useState(prompts.map(() => ""));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(36,28,56,0.55)" }}>
      <div className="w-full max-w-lg rounded-xl p-7" style={{ background: T.lavender, borderTop: `3px solid ${T.rule}` }}>
        <div className="flex items-center gap-2 mb-1">
          <Pin size={16} style={{ color: T.signal }} />
          <span className="font-semibold tracking-wide uppercase" style={{ fontSize: "12px", color: T.signal, fontFamily: "Instrument Sans" }}>
            Before you lock this in
          </span>
        </div>
        <h3 className="italic mb-4" style={{ fontSize: "28px", lineHeight: "1.1", fontFamily: "Instrument Serif", color: T.ink }}>
          What's behind this decision?
        </h3>
        <div className="space-y-4">
          {prompts.map((p, i) => (
            <div key={i}>
              <label className="block mb-1.5" style={{ fontSize: "13px", color: T.inkSoft, fontFamily: "Instrument Sans" }}>{p}</label>
              <textarea
                value={answers[i]}
                onChange={(e) => setAnswers((a) => a.map((x, idx) => (idx === i ? e.target.value : x)))}
                rows={2}
                className="w-full rounded-md px-3 py-2 outline-none resize-none"
                style={{ fontSize: "14px", background: T.paperRaised, border: `1px solid ${T.line}`, fontFamily: "Instrument Sans", color: T.ink }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft, fontFamily: "Instrument Sans" }}>
            Cancel
          </button>
          <button
            onClick={() => onSubmit(answers)}
            disabled={answers.some((a) => !a.trim())}
            className="px-4 py-2 font-medium rounded-md disabled:opacity-40 flex items-center gap-1.5"
            style={{ fontSize: "13px", background: T.ink, color: T.paperRaised, fontFamily: "Instrument Sans" }}
          >
            <Lock size={13} /> Lock decision
          </button>
        </div>
      </div>
    </div>
  );
}

function RippleModal({ nodeId, downstream, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(36,28,56,0.55)" }}>
      <div className="w-full max-w-md rounded-xl p-7" style={{ background: T.paperRaised, borderTop: `3px solid ${T.rule}` }}>
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={15} style={{ color: T.rule }} />
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.12em", color: T.rule, fontFamily: "Instrument Sans" }}>
            This has a ripple effect
          </span>
        </div>
        <h3 className="mb-4" style={{ fontSize: "26px", lineHeight: "1.15", fontFamily: "Instrument Serif", letterSpacing: "-0.01em", color: T.ink }}>
          This will flag {downstream.length} downstream {downstream.length === 1 ? "decision" : "decisions"} for review
        </h3>
        {downstream.length > 0 ? (
          <ul className="space-y-1.5 mb-4">
            {downstream.map((id) => (
              <li key={id} className="flex items-center gap-2" style={{ fontSize: "14px", color: T.ink, fontFamily: "Instrument Sans" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.rule }} />
                {STEP_LABEL[id]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4" style={{ fontSize: "14px", color: T.inkSoft }}>Nothing downstream is locked yet — nothing to flag.</p>
        )}
        <p className="leading-relaxed mb-6" style={{ fontSize: "13.5px", color: T.inkSoft }}>
          Nothing changes automatically. Your research and patterns are unaffected — the cost of reopening is visibility, not penalty.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft, fontFamily: "Instrument Sans" }}>Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 font-semibold rounded-md flex items-center gap-1.5" style={{ fontSize: "13px", background: T.ink, color: T.paperRaised, fontFamily: "Instrument Sans" }}>
            <RotateCcw size={13} /> Reopen anyway
          </button>
        </div>
      </div>
    </div>
  );
}

function FlagBanner({ onResolve }) {
  return (
    <div className="mb-6 rounded-lg px-4 py-3 flex items-center gap-2.5" style={{ background: T.lavender, borderLeft: `3px solid ${T.rule}` }}>
      <AlertCircle size={16} style={{ color: T.signal, flexShrink: 0 }} />
      <span className="flex-1 italic" style={{ fontSize: "13.5px", color: T.ink, fontFamily: "Instrument Serif" }}>
        Something upstream changed. Worth a second look.
      </span>
      <button onClick={onResolve} className="font-semibold px-3 py-1.5 rounded-md shrink-0" style={{ fontSize: "12.5px", background: T.ink, color: T.paperRaised, fontFamily: "Instrument Sans" }}>
        Still holds
      </button>
    </div>
  );
}

function DraftReview({ onGood, onChange, onWrong }) {
  return (
    <div className="mb-6">
      <p className="italic mb-4" style={{ fontSize: "16px", color: T.signal, fontFamily: "Instrument Serif" }}>
        Based on what you've told me so far, here's how I'm interpreting it.
      </p>
      <p className="font-medium mb-3" style={{ fontSize: "17px", color: T.ink, fontFamily: "Instrument Serif" }}>Does this feel accurate?</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={onGood} className="px-4 py-2 rounded-md font-semibold" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>Looks good</button>
        <button onClick={onChange} className="px-4 py-2 rounded-md font-medium" style={{ fontSize: "13.5px", background: T.lavender, color: T.signal }}>I'd change a few things</button>
        <button onClick={onWrong} className="px-4 py-2 rounded-md font-medium" style={{ fontSize: "13.5px", background: T.paperRaised, color: T.inkSoft, border: `1px solid ${T.line}` }}>That's not quite right</button>
      </div>
    </div>
  );
}

function HandbookPanel({ termId, onClose, onOpen }) {
  if (!termId) return null;
  const h = HANDBOOK[termId];
  if (!h) return null;
  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md shadow-2xl overflow-y-auto" style={{ background: T.paperRaised, borderLeft: `1px solid ${T.line}` }}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} style={{ color: T.signal }} />
            <span className="uppercase tracking-wider font-semibold" style={{ fontSize: "11px", color: T.signal, fontFamily: "Instrument Sans" }}>Handbook</span>
          </div>
          <button onClick={onClose}><X size={18} style={{ color: T.inkSoft }} /></button>
        </div>
        <h2 className="mb-4" style={{ fontSize: "38px", lineHeight: "1.05", fontFamily: "Instrument Serif", letterSpacing: "-0.01em", color: T.ink }}>{h.title}</h2>

        {[
          ["What it is", h.def],
          ["Why it matters", h.matters],
          ["How professionals use it", h.pro],
          ["An example", h.example],
          ["A common mistake", h.misconception],
          ["Right now, in your project", h.stage],
        ].map(([label, text]) => (
          <div key={label} className="mb-4">
            <div className="uppercase tracking-wider font-semibold mb-1" style={{ fontSize: "11px", color: T.inkSoft, fontFamily: "Instrument Sans" }}>{label}</div>
            <p className="leading-relaxed" style={{ fontSize: "14.5px", color: T.ink, fontFamily: "Instrument Sans" }}>{text}</p>
          </div>
        ))}

        <div className="mt-5 rounded-lg p-4" style={{ background: T.lavender, borderLeft: `3px solid ${T.rule}` }}>
          <div className="uppercase tracking-wider font-semibold mb-1.5" style={{ fontSize: "11px", color: T.signal, fontFamily: "Instrument Sans" }}>Ask yourself</div>
          <p className="italic leading-snug" style={{ fontSize: "17px", color: T.ink, fontFamily: "Instrument Serif" }}>{h.ask}</p>
        </div>

        {h.related?.length > 0 && (
          <div className="mt-5">
            <div className="uppercase tracking-wider font-semibold mb-2" style={{ fontSize: "11px", color: T.inkSoft, fontFamily: "Instrument Sans" }}>Related</div>
            <div className="flex flex-wrap gap-2">
              {h.related.map((r) => {
                const key = Object.keys(HANDBOOK).find((k) => HANDBOOK[k].title === r);
                return key ? (
                  <button key={r} onClick={() => onOpen(key)} className="px-2.5 py-1 rounded-full" style={{ fontSize: "12.5px", background: T.paper, color: T.signal, fontFamily: "Instrument Sans" }}>
                    {r}
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STEP DEFINITIONS
   ============================================================ */
const STEPS = [
  { id: "entry", label: "Studio Entry", icon: Compass },
  { id: "problem", label: "Problem Framing", icon: Target },
  { id: "research", label: "Research", icon: Layers },
  { id: "patterns", label: "Patterns", icon: Sparkles },
  { id: "opportunity", label: "Opportunity", icon: Compass },
  { id: "positioning", label: "Positioning", icon: Pin },
  { id: "differentiators", label: "Differentiators", icon: Fingerprint },
  { id: "attributes", label: "Attributes", icon: ToggleLeft },
  { id: "pillars", label: "Pillars", icon: Users },
  { id: "philosophy", label: "Philosophy", icon: Lightbulb },
  { id: "voice", label: "Voice & Tone", icon: Volume2 },
  { id: "persona", label: "Persona", icon: UserCircle2 },
  { id: "visual", label: "Visual Direction", icon: Palette },
  { id: "synthesis", label: "Synthesis", icon: FileText },
  { id: "review", label: "Presentation Review", icon: PresentationIcon },
];

const STEP_LABEL = Object.fromEntries(STEPS.map((s) => [s.id, s.label]));

// Direct dependency edges: reopening a key propagates a "needs review" flag
// to everything listed here, and transitively beyond it.
const DEPENDENCY_MAP = {
  opportunity: ["positioning"],
  positioning: ["differentiators", "attributes", "pillars", "philosophy", "voice", "persona", "visual", "synthesis"],
  differentiators: ["visual", "synthesis"],
  attributes: ["visual", "synthesis"],
  pillars: ["visual", "synthesis"],
  philosophy: ["visual", "synthesis"],
  voice: ["visual", "synthesis"],
  persona: ["visual", "synthesis"],
  visual: ["synthesis"],
};

function getDownstream(id) {
  const seen = new Set();
  const stack = [...(DEPENDENCY_MAP[id] || [])];
  while (stack.length) {
    const next = stack.pop();
    if (seen.has(next)) continue;
    seen.add(next);
    stack.push(...(DEPENDENCY_MAP[next] || []));
  }
  return [...seen];
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [step, setStep] = useState("entry");
  const [handbookTerm, setHandbookTerm] = useState(null);
  const fileInputRef = useRef(null);

  const [project, setProject] = useState({
    name: "",
    client: "",
    level: "sophomore",
    clientAsk: "",
    whyAsking: "",
    whoAffected: "",
    whatIfNothing: "",
    priority: "",
    knowns: "",
    assumptions: "",
    research: [], // {id, text, source, tag, isFact}
    patterns: [], // {id, note, context}
    opportunity: { text: "", patternIds: [], locked: false, reflection: null },
    positioning: { who: "", needs: "", alternatives: "", difference: "", after: "", audience: "", market: "", promise: "", rtb: "", locked: false, reflection: null },
    differentiators: [], // {id, text, locked}
    attributes: [], // {id, this, not, locked}
    pillars: [], // {id, name, link, locked}
    philosophy: { what: "", how: "", why: "", locked: false },
    voice: { style: "", avoid: "", locked: false },
    persona: { description: "", notThis: "", locked: false },
    visual: [], // {id, category, choice, justification, locked, exploring}
    synthesis: { text: "", reflection: null },
    synthesisMap: { researchReveal: "", keyInsight: "", opportunityWhy: "", strategicDecision: "", visualResponse: "", takeaway: "" },
    flags: { positioning: false, differentiators: false, attributes: false, pillars: false, philosophy: false, voice: false, persona: false, visual: false, synthesis: false },
    reopenLog: [], // {node, at, downstream}
  });

  const [rippleTarget, setRippleTarget] = useState(null); // { nodeId }
  const [historyOpen, setHistoryOpen] = useState(false);

  const requestReopen = (nodeId) => setRippleTarget(nodeId);

  const confirmReopen = () => {
    const nodeId = rippleTarget;
    const downstream = getDownstream(nodeId);
    setProject((prev) => {
      const next = { ...prev };
      if (nodeId === "opportunity") next.opportunity = { ...prev.opportunity, locked: false };
      if (nodeId === "positioning") next.positioning = { ...prev.positioning, locked: false };
      const newFlags = { ...prev.flags };
      downstream.forEach((d) => { if (d in newFlags) newFlags[d] = true; });
      next.flags = newFlags;
      next.reopenLog = [...prev.reopenLog, { node: nodeId, at: new Date().toISOString(), downstream }];
      return next;
    });
    setRippleTarget(null);
  };

  const resolveFlag = (id) => setProject((prev) => ({ ...prev, flags: { ...prev.flags, [id]: false } }));

  const openHandbook = (id) => setHandbookTerm(id);
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const isUnlocked = (id) => {
    // sequence is encouraged through the natural flow of Continue buttons, not enforced by hard nav blocks
    if (id === "entry") return true;
    if (!project.name) return false;
    return true;
  };

  const lockState = (id) => {
    if (id === "opportunity") return project.opportunity.locked;
    if (id === "positioning") return project.positioning.locked;
    if (id === "differentiators") return project.differentiators.length > 0;
    if (id === "attributes") return project.attributes.length > 0;
    if (id === "pillars") return project.pillars.length > 0 && project.pillars.every((p) => p.locked);
    if (id === "philosophy") return project.philosophy.locked;
    if (id === "voice") return project.voice.locked;
    if (id === "persona") return project.persona.locked;
    if (id === "visual") return project.visual.length > 0 && project.visual.every((v) => v.locked || v.exploring);
    return null;
  };

  const saveProject = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project.name || "strategy-project").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setProject(data);
        setStep("problem");
      } catch {
        alert("That file doesn't look like a valid project file.");
      }
    };
    reader.readAsText(file);
  };

  const exportMarkdown = () => {
    const p = project;
    const lines = [
      `# ${p.name || "Untitled Project"}`,
      p.client ? `_Client: ${p.client}_\n` : "",
      `## Communication Problem`, p.priority || "_Not yet defined_", "",
      `## Research Process`, `${p.research.length} research observations collected across ${new Set(p.research.map(r=>r.tag)).size} categories.`, "",
      `## Patterns`, ...p.patterns.map((pt) => `- **${pt.note || "Untitled pattern"}**`), "",
      `## Opportunity`, p.opportunity.text || "_Not yet locked_", "",
      `## Positioning`,
      p.positioning.locked
        ? `For **${p.positioning.audience}**, unlike ${p.positioning.market}, this brand ${p.positioning.promise}, because ${p.positioning.rtb}.`
        : "_Not yet locked_", "",
      `## Differentiators`, ...p.differentiators.map((d) => `- ${d.text}`), "",
      `## Attributes (This, Not That)`, ...p.attributes.map((a) => `- **${a.this}**, not ${a.not}`), "",
      `## Strategic Pillars`, ...p.pillars.map((pl) => `- **${pl.name}** — ${pl.link}`), "",
      `## Philosophy`,
      p.philosophy.what ? `**What:** ${p.philosophy.what}` : "",
      p.philosophy.how ? `**How:** ${p.philosophy.how}` : "",
      p.philosophy.why ? `**Why:** ${p.philosophy.why}` : "",
      "",
      `## Voice & Tone`, p.voice.style || "", p.voice.avoid ? `Never: ${p.voice.avoid}` : "", "",
      `## Persona`, p.persona.description || "", p.persona.notThis ? `Not: ${p.persona.notThis}` : "", "",
      `## Visual Direction`, ...p.visual.map((v) => `- **${v.category}**: ${v.choice} — _${v.justification}_`), "",
      `## Reflection & Synthesis`, p.synthesis.text || "_Not yet written_",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(p.name || "strategy-brief").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: "Instrument Sans", fontWeight: 500, background: T.paper, color: T.ink, minHeight: "100vh" }}>
      <style>{FONT_IMPORT}{`
        @media print {
          .no-print { display: none !important; }
          .print-area { position: static !important; }
        }
        @keyframes fadeIn { from { opacity:0; transform: translateY(4px);} to { opacity:1; transform:none; } }
        .fade-in { animation: fadeIn .25s ease; }
        * { box-sizing: border-box; }
        input, textarea, select, button { font-family: inherit; font-weight: inherit; }
        ::selection { background: ${T.marigold}; color: ${T.ink}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 8px; }
      `}</style>

      {step === "entry" ? (
        <EntryScreen project={project} setProject={setProject} onStart={() => setStep("problem")} onLoad={() => fileInputRef.current?.click()} />
      ) : (
        <div className="flex">
          {/* Left rail */}
          <aside className="no-print w-64 shrink-0 h-screen sticky top-0 flex flex-col" style={{ background: T.paperRaised, borderRight: `1px solid ${T.line}` }}>
            <div className="px-6 pt-7 pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.14em", color: T.inkSoft, fontFamily: "Instrument Sans" }}>ACU Design Strategy Studio</div>
              <div className="truncate" style={{ fontSize: "23px", lineHeight: "1.05", fontFamily: "Instrument Serif", color: T.ink }}>{project.name || "Untitled project"}</div>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2">
              {STEPS.filter((s) => s.id !== "entry").map((s) => {
                const active = s.id === step;
                const unlocked = isUnlocked(s.id);
                const ls = lockState(s.id);
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    disabled={!unlocked}
                    onClick={() => setStep(s.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-left mb-0.5 transition disabled:opacity-35"
                    style={{ fontSize: "13.5px",
                      background: active ? T.signalSoft : "transparent",
                      color: active ? T.signal : T.ink,
                      fontFamily: "Instrument Sans",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    <Icon size={15} />
                    <span className="flex-1">{s.label}</span>
                    {project.flags?.[s.id] && <AlertCircle size={13} style={{ color: T.rule }} />}
                    {ls === true && !project.flags?.[s.id] && <Check size={13} style={{ color: T.marigold }} />}
                    {ls === false && <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.signal }} />}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 space-y-1" style={{ borderTop: `1px solid ${T.line}` }}>
              <button onClick={saveProject} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft }}>
                <Save size={14} /> Save project
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft }}>
                <Upload size={14} /> Load project
              </button>
              <button onClick={exportMarkdown} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft }}>
                <FileDown size={14} /> Export Markdown
              </button>
              <button onClick={exportPDF} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft }}>
                <Download size={14} /> Export PDF
              </button>
              {project.reopenLog.length > 0 && (
                <button onClick={() => setHistoryOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.rule }}>
                  <RotateCcw size={14} /> Revision history ({project.reopenLog.length})
                </button>
              )}
              <input ref={fileInputRef} type="file" accept=".json" onChange={loadProject} className="hidden" />
            </div>
          </aside>

          {/* Positioning pin ribbon */}
          <div className="flex-1 min-w-0">
            {project.positioning.locked && step !== "positioning" && (
              <div className="no-print px-10 py-3.5 flex items-center gap-2.5" style={{ background: T.marigold, borderBottom: `2px solid ${T.rule}` }}>
                <Pin size={13} style={{ color: T.ink }} />
                <span className="italic truncate" style={{ fontSize: "16px", fontFamily: "Instrument Serif", color: T.ink }}>
                  For {project.positioning.audience}, unlike {project.positioning.market}, this brand {project.positioning.promise}.
                </span>
              </div>
            )}
            <main className="print-area max-w-3xl mx-auto px-10 py-16">
              {step === "problem" && <ProblemFraming project={project} setProject={setProject} onNext={() => setStep("research")} onOpen={openHandbook} />}
              {step === "research" && <ResearchCapture project={project} setProject={setProject} onNext={() => setStep("patterns")} onOpen={openHandbook} />}
              {step === "patterns" && <PatternRecognition project={project} setProject={setProject} onNext={() => setStep("opportunity")} onOpen={openHandbook} />}
              {step === "opportunity" && <OpportunityStep project={project} setProject={setProject} onNext={() => setStep("positioning")} onOpen={openHandbook} onRequestReopen={requestReopen} />}
              {step === "positioning" && <PositioningStep project={project} setProject={setProject} onNext={() => setStep("differentiators")} onOpen={openHandbook} onRequestReopen={requestReopen} onResolveFlag={resolveFlag} />}
              {step === "differentiators" && <DifferentiatorsStep project={project} setProject={setProject} onNext={() => setStep("attributes")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "attributes" && <AttributesStep project={project} setProject={setProject} onNext={() => setStep("pillars")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "pillars" && <PillarsStep project={project} setProject={setProject} onNext={() => setStep("philosophy")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "philosophy" && <PhilosophyStep project={project} setProject={setProject} onNext={() => setStep("voice")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "voice" && <VoiceStep project={project} setProject={setProject} onNext={() => setStep("persona")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "persona" && <PersonaStep project={project} setProject={setProject} onNext={() => setStep("visual")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "visual" && <VisualStep project={project} setProject={setProject} onNext={() => setStep("synthesis")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "synthesis" && <SynthesisStep project={project} setProject={setProject} onNext={() => setStep("review")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "review" && <PresentationReview project={project} />}
            </main>
          </div>
        </div>
      )}

      <HandbookPanel termId={handbookTerm} onClose={() => setHandbookTerm(null)} onOpen={openHandbook} />
      {rippleTarget && (
        <RippleModal
          nodeId={rippleTarget}
          downstream={getDownstream(rippleTarget)}
          onConfirm={confirmReopen}
          onClose={() => setRippleTarget(null)}
        />
      )}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(34,30,25,0.55)" }}>
          <div className="w-full max-w-md rounded-xl p-7 overflow-y-auto" style={{ background: T.paperRaised, maxHeight: "80vh" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold tracking-wide uppercase" style={{ fontSize: "12px", color: T.signal }}>Revision history</span>
              <button onClick={() => setHistoryOpen(false)}><X size={18} style={{ color: T.inkSoft }} /></button>
            </div>
            <p className="mb-5" style={{ fontSize: "13.5px", color: T.inkSoft }}>
              Evidence of rigor, not a flaw.
            </p>
            <div className="space-y-3">
              {project.reopenLog.slice().reverse().map((entry, i) => (
                <div key={i} className="rounded-lg px-4 py-3" style={{ background: T.lavender, borderLeft: `3px solid ${T.rule}` }}>
                  <div className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>Reopened: {STEP_LABEL[entry.node]}</div>
                  <div className="mt-1 uppercase tracking-wide" style={{ fontSize: "12px", color: T.inkSoft, fontFamily: "Instrument Sans", fontWeight: 500 }}>
                    {new Date(entry.at).toLocaleString()}
                  </div>
                  {entry.downstream.length > 0 && (
                    <div className="mt-1.5" style={{ fontSize: "12.5px", color: T.signal, fontFamily: "Instrument Sans", fontWeight: 500 }}>
                      Flagged: {entry.downstream.map((d) => STEP_LABEL[d]).join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SCREENS
   ============================================================ */
function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="mb-11 pb-7" style={{ borderBottom: `1.5px solid ${T.rule}` }}>
      <div
        className="uppercase font-semibold mb-4"
        style={{ fontSize: "11px", letterSpacing: "0.16em", color: T.inkSoft, fontFamily: "Instrument Sans" }}
      >
        {eyebrow}
      </div>
      <h1 className="mb-4" style={{ fontSize: "54px", lineHeight: "1.0", fontFamily: "Instrument Serif", letterSpacing: "-0.02em", color: T.ink }}>{title}</h1>
      {sub && <p className="italic" style={{ fontSize: "17px", lineHeight: "1.4", color: T.inkSoft, maxWidth: "30rem", fontFamily: "Instrument Serif" }}>{sub}</p>}
    </div>
  );
}

function NextButton({ onClick, disabled, children = "Continue" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30"
      style={{ fontSize: "14px", background: T.ink, color: T.paperRaised, fontFamily: "Instrument Sans" }}
    >
      {children} <ArrowRight size={15} />
    </button>
  );
}

function EntryScreen({ project, setProject, onStart, onLoad }) {
  return (
    <div className="min-h-screen px-6" style={{ background: T.paper }}>
      <div className="w-full max-w-2xl mx-auto pt-20 pb-24">
        <div className="text-center mb-28">
          <div className="uppercase font-semibold mb-8" style={{ fontSize: "10.5px", letterSpacing: "0.16em", color: T.inkSoft }}>ACU Design Strategy Studio</div>

          <h1
            className="mb-7"
            style={{ lineHeight: "0.92", fontFamily: "Instrument Serif", letterSpacing: "-0.03em", color: T.ink, fontSize: "clamp(64px, 11vw, 132px)" }}
          >
            Before you design, understand.
          </h1>

          <div className="mx-auto mb-7" style={{ background: T.rule, width: "22px", height: "3px" }} />

          <p className="italic" style={{ fontSize: "20px", color: T.ink, fontFamily: "Instrument Serif" }}>
            Every design decision deserves a reason.
          </p>
        </div>

        <div className="max-w-xs mx-auto space-y-5">
          <div>
            <label className="block uppercase font-semibold mb-2" style={{ fontSize: "11px", letterSpacing: "0.1em", color: T.inkSoft }}>Project name</label>
            <input
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              placeholder="e.g. Sunshine Bakery"
              className="w-full rounded-md px-3.5 py-2.5 outline-none"
              style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
            />
          </div>
          <div>
            <label className="block uppercase font-semibold mb-2" style={{ fontSize: "11px", letterSpacing: "0.1em", color: T.inkSoft }}>Brief</label>
            <textarea
              value={project.client}
              onChange={(e) => setProject({ ...project, client: e.target.value })}
              placeholder="Describe the project…"
              rows={4}
              className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none"
              style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
            />
          </div>
          <button
            onClick={onStart}
            disabled={!project.name.trim()}
            className="w-full py-4 rounded-md font-bold disabled:opacity-30 mt-3"
            style={{ fontSize: "15.5px", letterSpacing: "-0.005em", background: T.ink, color: "#fff" }}
          >
            Start thinking
          </button>
          <button onClick={onLoad} className="w-full py-1 mt-1" style={{ fontSize: "12.5px", color: T.inkSoft }}>
            or load a project file
          </button>
        </div>
      </div>
    </div>
  );
}

const MICRO_STEPS = [
  { key: "clientAsk", q: "What is the client asking for?", ph: "In their own words — what did they literally ask you to make or fix?" },
  { key: "whyAsking", q: "Why do you think they're asking for that?", ph: "What's actually driving the request?" },
  { key: "whoAffected", q: "Who does this affect?", ph: "Who feels it if this goes right — or wrong?" },
  { key: "whatIfNothing", q: "What happens if nothing changes?", ph: "What stays broken, or gets worse, without this project?" },
];

function ProblemFraming({ project, setProject, onNext, onOpen }) {
  const startStage = project.priority.trim() ? "knowns" : (project.whatIfNothing || "").trim() ? "synthesis" : 0;
  const [stage, setStage] = useState(startStage);
  const [transcript, setTranscript] = useState([]);
  const [draft, setDraft] = useState("");
  const [reacting, setReacting] = useState(false);
  const [coachNote, setCoachNote] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  const submitMicro = async (step) => {
    if (!draft.trim()) return;
    setProject({ ...project, [step.key]: draft });
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThis is a small warm-up question in a desk-critique-style sequence leading toward the real strategic question, not the hard question itself. The student just answered "${step.q}" with their response below. React in ONE short sentence — a quick, human acknowledgment or a light nudge — then stop. Do not ask more than one follow-up. Keep it brief, this is a quick beat, not a full critique.`,
      draft,
      100
    );
    setTranscript((t) => [...t, { q: step.q, a: draft, r }]);
    setDraft("");
    setReacting(false);
    const idx = MICRO_STEPS.indexOf(step);
    setStage(idx + 1 < MICRO_STEPS.length ? idx + 1 : "synthesis");
  };

  const submitSynthesis = async () => {
    if (!project.priority.trim()) return;
    setStage("knowns");
    setCoachLoading(true);
    setCoachNote("");
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student worked through a short warm-up conversation before stating their business priority. What the client asked for: "${project.clientAsk}". Why they think that's the ask: "${project.whyAsking}". Who's affected: "${project.whoAffected}". What happens if nothing changes: "${project.whatIfNothing}". Client brief: "${project.client || "unspecified"}". Now they've stated the real problem below. A weak statement is generic — true of any business. React the way a strategist would: if it's generic, ask a question that would make them test that themselves; if it's sharp, say so briefly and ask one question that pushes it further.`,
      project.priority
    );
    setCoachNote(r);
    setCoachLoading(false);
  };

  return (
    <div>
      <SectionHeader
        eyebrow="01"
        title="What problem are we trying to solve?"
        sub="This becomes the foundation for every decision you'll make next."
      />

      {transcript.length > 0 && (
        <div className="space-y-5 mb-8">
          {transcript.map((t, i) => (
            <div key={i} className="pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>{t.q}</div>
              <p className="mb-2" style={{ fontSize: "15px", color: T.ink }}>{t.a}</p>
              <p className="italic" style={{ fontSize: "14.5px", color: T.signal, fontFamily: "Instrument Serif" }}>{t.r}</p>
            </div>
          ))}
        </div>
      )}

      {typeof stage === "number" && (
        <>
          <div className="mb-2 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>{MICRO_STEPS[stage].q}</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder={MICRO_STEPS[stage].ph}
            className="w-full rounded-md px-4 py-3 outline-none resize-none"
            style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
            autoFocus
          />
          <button
            onClick={() => submitMicro(MICRO_STEPS[stage])}
            disabled={!draft.trim() || reacting}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30"
            style={{ fontSize: "14px", background: T.ink, color: "#fff" }}
          >
            {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={15} />}
          </button>
        </>
      )}

      {stage === "synthesis" && (
        <>
          <div className="mb-2 font-medium" style={{ fontSize: "22px", color: T.ink, fontFamily: "Instrument Serif" }}>So — what problem are we really trying to solve?</div>
          <textarea
            value={project.priority}
            onChange={(e) => setProject({ ...project, priority: e.target.value })}
            rows={3}
            placeholder="In one or two sentences, describe the problem this project exists to solve."
            className="w-full rounded-md px-4 py-3 outline-none resize-none"
            style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
            autoFocus
          />
          <button
            onClick={submitSynthesis}
            disabled={!project.priority.trim()}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30"
            style={{ fontSize: "14px", background: T.ink, color: "#fff" }}
          >
            Continue <ArrowRight size={15} />
          </button>
        </>
      )}

      {stage === "knowns" && (
        <>
          <div className="flex items-start justify-between gap-4 pb-6" style={{ borderBottom: `1px solid ${T.line}` }}>
            <p className="italic" style={{ fontSize: "17px", color: T.ink, fontFamily: "Instrument Serif" }}>{project.priority}</p>
            <button onClick={() => setStage("synthesis")} className="shrink-0 mt-1" style={{ fontSize: "12.5px", color: T.inkSoft }}>Edit</button>
          </div>

          {(coachLoading || coachNote) && (
            <div className="mt-5 pl-5 pr-4 py-3 rounded-lg fade-in" style={{ background: T.lavender }}>
              <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "11px", letterSpacing: "0.1em", color: T.signal }}>Your professor, leaning in</div>
              <p className="italic leading-relaxed" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>
                {coachLoading ? "Thinking it over…" : coachNote}
              </p>
            </div>
          )}

          <NextButton onClick={onNext} disabled={!project.priority.trim()} />
        </>
      )}
    </div>
  );
}

const RESEARCH_PROMPTS = [
  { tag: "audience", q: "What do you know about the people this needs to reach?", ph: "Anything you already know, suspect, or have noticed about them.", why: "Every strategic decision later traces back to who this is actually for." },
  { tag: "competitor", q: "Who else is trying to solve something similar \u2014 and what have you noticed about them?", ph: "A competitor, an alternative, or just something comparable.", why: "You can't tell what makes this different until you know what it's being compared to." },
  { tag: "context", q: "Is there anything about the timing, setting, or situation that matters here?", ph: "Context that might shape the problem or the solution.", why: "The right answer often depends on circumstances outside the brief itself." },
];

function ResearchCapture({ project, setProject, onNext, onOpen }) {
  const [stage, setStage] = useState(project.research.length > 0 ? "more" : 0);
  const [draft, setDraft] = useState("");
  const [reacting, setReacting] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [addingMore, setAddingMore] = useState(false);

  const addEntry = async (text, tag, promptQ) => {
    const entry = { id: crypto.randomUUID(), text, source: "", tag, isFact: true };
    setProject((p) => ({ ...p, research: [...p.research, entry] }));
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student is having a guided conversation to gather research before starting strategy work — they don't see this as "research cards" or methodology, just a conversation. They just answered "${promptQ}" with the response below. React in ONE short sentence: a quick human acknowledgment, and briefly note why this kind of thing matters for strategy. Then stop.`,
      text,
      100
    );
    setReacting(false);
    return r;
  };

  const submitPrompt = async (i) => {
    if (!draft.trim()) return;
    const p = RESEARCH_PROMPTS[i];
    const r = await addEntry(draft, p.tag, p.q);
    setTranscript((t) => [...t, { q: p.q, a: draft, r }]);
    setDraft("");
    setStage(i + 1 < RESEARCH_PROMPTS.length ? i + 1 : "more");
  };

  const submitMore = async () => {
    if (!draft.trim()) return;
    await addEntry(draft, "other", "What else have you noticed?");
    setDraft("");
    setAddingMore(false);
  };

  return (
    <div>
      <SectionHeader
        eyebrow="02"
        title="Get to know the problem"
        sub="A few quick questions — nothing to prepare, just tell me what you already know or notice."
      />

      {transcript.length > 0 && stage !== "more" && (
        <div className="space-y-5 mb-8">
          {transcript.map((t, i) => (
            <div key={i} className="pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>{t.q}</div>
              <p className="mb-2" style={{ fontSize: "15px", color: T.ink }}>{t.a}</p>
              <p className="italic" style={{ fontSize: "14.5px", color: T.signal, fontFamily: "Instrument Serif" }}>{t.r}</p>
            </div>
          ))}
        </div>
      )}

      {typeof stage === "number" && (
        <>
          <div className="mb-1.5 font-medium" style={{ fontSize: "19px", color: T.ink, fontFamily: "Instrument Serif" }}>{RESEARCH_PROMPTS[stage].q}</div>
          <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>{RESEARCH_PROMPTS[stage].why}</p>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder={RESEARCH_PROMPTS[stage].ph}
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={() => submitPrompt(stage)} disabled={!draft.trim() || reacting}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={15} />}
          </button>
        </>
      )}

      {stage === "more" && (
        <>
          <div className="mb-2 font-medium" style={{ fontSize: "19px", color: T.ink, fontFamily: "Instrument Serif" }}>Here's what you've told me so far.</div>
          <div className="space-y-2 mb-6">
            {project.research.map((r) => (
              <div key={r.id} className="rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
                <p style={{ fontSize: "14.5px", color: T.ink }}>{r.text}</p>
              </div>
            ))}
          </div>

          {addingMore ? (
            <div className="mb-6">
              <div className="mb-1.5 font-medium" style={{ fontSize: "17px", color: T.ink, fontFamily: "Instrument Serif" }}>What else have you noticed?</div>
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="About the audience, the competition, or the situation."
                className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
              <div className="flex items-center gap-3 mt-3">
                <button onClick={submitMore} disabled={!draft.trim() || reacting} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
                  {reacting ? "…" : "Add this"}
                </button>
                <button onClick={() => setAddingMore(false)} style={{ fontSize: "12.5px", color: T.inkSoft }}>Never mind</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingMore(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium mb-8" style={{ fontSize: "13.5px", background: T.paperRaised, color: T.signal, border: `1px solid ${T.line}` }}>
              <Plus size={14} /> Add something else
            </button>
          )}

          <div>
            <NextButton onClick={onNext}>I'm ready to look for patterns</NextButton>
          </div>
        </>
      )}
    </div>
  );
}

function PatternRecognition({ project, setProject, onNext, onOpen }) {
  const [stage, setStage] = useState("connect"); // 'connect' | 'meaning' | 'more'
  const [connectDraft, setConnectDraft] = useState("");
  const [connectReaction, setConnectReaction] = useState("");
  const [meaningDraft, setMeaningDraft] = useState("");
  const [reacting, setReacting] = useState(false);

  const submitConnect = async () => {
    if (!connectDraft.trim()) return;
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student is being guided, conversationally, toward noticing a pattern in their research — they don't see this as formal "pattern recognition," just a conversation. They just noticed a connection between a couple of things. React in ONE short sentence, a quick human acknowledgment or light nudge, then stop.`,
      connectDraft,
      100
    );
    setConnectReaction(r);
    setReacting(false);
    setStage("meaning");
  };

  const submitMeaning = () => {
    if (!meaningDraft.trim()) return;
    setProject({ ...project, patterns: [...project.patterns, { id: crypto.randomUUID(), note: meaningDraft, context: connectDraft }] });
    setConnectDraft(""); setConnectReaction(""); setMeaningDraft("");
    setStage("more");
  };

  return (
    <div>
      <SectionHeader
        eyebrow="03"
        title="What does it add up to?"
        sub="A pattern isn't a summary — it's what a few things you noticed actually mean when you look at them together."
      />

      {project.research.length > 0 && (
        <div className="rounded-lg px-4 py-3 mb-7" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          <div className="uppercase font-semibold mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>What you told me earlier</div>
          <ul className="space-y-1">
            {project.research.map((r) => (
              <li key={r.id} style={{ fontSize: "13.5px", color: T.ink }}>{r.text}</li>
            ))}
          </ul>
        </div>
      )}

      {project.patterns.length > 0 && (
        <div className="space-y-2 mb-7">
          {project.patterns.map((p) => (
            <div key={p.id} className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: T.marigoldSoft, border: `1px solid ${T.line}` }}>
              <Sparkles size={15} style={{ color: T.ink, marginTop: 2 }} />
              <div className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{p.note}</div>
            </div>
          ))}
        </div>
      )}

      {stage === "connect" && (
        <>
          <div className="mb-1.5 font-medium" style={{ fontSize: "19px", color: T.ink, fontFamily: "Instrument Serif" }}>
            Does anything you told me seem connected — like it's part of the same bigger thing?
          </div>
          <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>There's no wrong answer here — just say what you notice.</p>
          <textarea value={connectDraft} onChange={(e) => setConnectDraft(e.target.value)} rows={2} placeholder="Describe the connection in your own words."
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={submitConnect} disabled={!connectDraft.trim() || reacting}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={15} />}
          </button>
          <div className="mt-5">
            <button onClick={() => setStage("more")} style={{ fontSize: "12.5px", color: T.inkSoft }}>I'm not seeing a connection yet — that's okay, let's move on</button>
          </div>
        </>
      )}

      {stage === "meaning" && (
        <>
          {connectReaction && (
            <div className="mb-5 pl-5 pr-4 py-3 rounded-lg fade-in" style={{ background: T.lavender }}>
              <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "11px", letterSpacing: "0.1em", color: T.signal }}>Your professor, leaning in</div>
              <p className="italic leading-relaxed" style={{ fontSize: "15.5px", color: T.ink, fontFamily: "Instrument Serif" }}>{connectReaction}</p>
            </div>
          )}
          <div className="mb-1.5 font-medium" style={{ fontSize: "19px", color: T.ink, fontFamily: "Instrument Serif" }}>
            What might that connection actually mean?
          </div>
          <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>Not a summary of what you said — the real takeaway underneath it.</p>
          <textarea value={meaningDraft} onChange={(e) => setMeaningDraft(e.target.value)} rows={2} placeholder="What does this tell you that wasn't obvious before?"
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={submitMeaning} disabled={!meaningDraft.trim()}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            Save this <ArrowRight size={15} />
          </button>
        </>
      )}

      {stage === "more" && (
        <>
          <button onClick={() => setStage("connect")} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium mb-8" style={{ fontSize: "13.5px", background: T.paperRaised, color: T.signal, border: `1px solid ${T.line}` }}>
            <Plus size={14} /> Notice another connection
          </button>
          <div>
            <NextButton onClick={onNext}>Continue</NextButton>
          </div>
        </>
      )}
    </div>
  );
}

function OpportunityStep({ project, setProject, onNext, onOpen, onRequestReopen }) {
  const [showReflection, setShowReflection] = useState(false);
  const o = project.opportunity;

  const togglePattern = (id) => {
    const has = o.patternIds.includes(id);
    setProject({ ...project, opportunity: { ...o, patternIds: has ? o.patternIds.filter((x) => x !== id) : [...o.patternIds, id] } });
  };

  const doLock = (answers) => {
    setProject({
      ...project,
      opportunity: { ...o, locked: true, reflection: answers },
    });
    setShowReflection(false);
    onNext();
  };

  return (
    <div>
      <SectionHeader eyebrow="04 — First lock" title="Name the opportunity" sub={<>What gap or tension surfaced in your research? Ground it in the <Term id="insight" onOpen={onOpen}>insight</Term> behind your patterns, then link the evidence.</>} />

      <div className="mb-4">
        <div className="font-medium mb-2" style={{ fontSize: "13px", color: T.inkSoft }}>Link supporting patterns</div>
        <div className="flex flex-wrap gap-2">
          {project.patterns.map((p) => (
            <button
              key={p.id}
              disabled={o.locked}
              onClick={() => togglePattern(p.id)}
              className="px-3 py-1.5 rounded-full transition disabled:opacity-60"
              style={{ fontSize: "12.5px", background: o.patternIds.includes(p.id) ? T.signal : T.paperRaised, color: o.patternIds.includes(p.id) ? "#fff" : T.ink, border: `1px solid ${T.line}` }}
            >
              {p.note.slice(0, 40)}{p.note.length > 40 ? "…" : ""}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={o.text}
        disabled={o.locked}
        onChange={(e) => setProject({ ...project, opportunity: { ...o, text: e.target.value } })}
        rows={3}
        placeholder="There's an opportunity to..."
        className="w-full rounded-md px-4 py-3 outline-none resize-none disabled:opacity-70"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
      />
      {!o.locked && (
        <CoachBox
          systemFrame={`${getCoachPersona(project.level)}\nThe student wrote an opportunity statement, citing ${o.patternIds.length} pattern(s). Consider whether the claim logically follows from grounded evidence, or jumps somewhere new. If the connection isn't explicit, ask a question that makes them trace it themselves.`}
          studentText={o.text}
        />
      )}

      {o.locked ? (
        <div className="mt-6 rounded-lg px-4 py-3 flex items-center gap-2" style={{ background: T.marigoldSoft }}>
          <Lock size={15} style={{ color: T.ink }} />
          <span className="italic" style={{ fontSize: "13.5px", color: T.ink, fontFamily: "Instrument Serif" }}>Locked. Reopen any time.</span>
        </div>
      ) : (
        <button
          onClick={() => setShowReflection(true)}
          disabled={!o.text.trim()}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-semibold disabled:opacity-30"
          style={{ fontSize: "14px", background: T.ink, color: T.paperRaised }}
        >
          <Lock size={14} /> Lock &amp; Continue
        </button>
      )}

      {o.locked && (
        <button onClick={() => onRequestReopen("opportunity")} className="ml-3 mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium" style={{ fontSize: "13.5px", color: T.rule }}>
          <RotateCcw size={13} /> Reopen
        </button>
      )}

      {showReflection && (
        <ReflectionModal
          prompts={["What evidence gave you confidence in this decision?", "What's one alternative opportunity you considered and rejected — and why?"]}
          onSubmit={doLock}
          onClose={() => setShowReflection(false)}
        />
      )}

      <NextButton onClick={onNext}>{o.locked ? "Continue" : "Continue — I'll come back to this"}</NextButton>
    </div>
  );
}

const POSITIONING_MICRO_STEPS = [
  { key: "who", field: "audience", q: "Who is this most clearly for?", ph: "Not \u201Ceveryone\u201D \u2014 the specific person or group this has to work for." },
  { key: "needs", field: null, q: "What do they need, want, or value?", ph: "What actually matters to this person in this situation?" },
  { key: "alternatives", field: "market", q: "What alternatives are they currently choosing from?", ph: "What do they do instead, today, without this?" },
  { key: "difference", field: "rtb", q: "What makes this project meaningfully different?", ph: "Different in a way that actually matters to them \u2014 not just different for its own sake." },
  { key: "after", field: "promise", q: "What should the audience believe, feel, or understand after encountering the design?", ph: "The one thing you want to land." },
];

function PositioningStep({ project, setProject, onNext, onOpen, onRequestReopen, onResolveFlag }) {
  const p = project.positioning;
  const startStage = p.audience && p.market && p.promise && p.rtb ? "template" : (p.after || "").trim() ? "template" : 0;
  const [stage, setStage] = useState(startStage);
  const [transcript, setTranscript] = useState([]);
  const [draft, setDraft] = useState("");
  const [reacting, setReacting] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const set = (field) => (e) => setProject({ ...project, positioning: { ...p, [field]: e.target.value } });
  const filled = p.audience && p.market && p.promise && p.rtb;

  const submitMicro = async (step) => {
    if (!draft.trim()) return;
    const updated = { ...project.positioning, [step.key]: draft, ...(step.field ? { [step.field]: draft } : {}) };
    setProject({ ...project, positioning: updated });
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThis is a small warm-up question in a sequence building toward a full positioning statement, not the hard synthesis itself. The student just answered "${step.q}" with their response below. React in ONE short sentence \u2014 a quick, human acknowledgment or light nudge \u2014 then stop. This is a quick beat, not a full critique.`,
      draft,
      100
    );
    setTranscript((t) => [...t, { q: step.q, a: draft, r }]);
    setDraft("");
    setReacting(false);
    const idx = POSITIONING_MICRO_STEPS.indexOf(step);
    setStage(idx + 1 < POSITIONING_MICRO_STEPS.length ? idx + 1 : "template");
  };

  const doLock = (answers) => {
    setProject({ ...project, positioning: { ...p, locked: true, reflection: answers } });
    setShowReflection(false);
    onNext();
  };

  return (
    <div>
      {project.flags?.positioning && <FlagBanner onResolve={() => onResolveFlag("positioning")} />}
      <SectionHeader eyebrow="05 — The spine" title="Write your positioning" sub={<>A few questions first, then we'll assemble it into one sentence: audience, market, promise, and <Term id="positioning" onOpen={onOpen}>reason to believe</Term>.</>} />

      {transcript.length > 0 && (
        <div className="space-y-5 mb-8">
          {transcript.map((t, i) => (
            <div key={i} className="pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>{t.q}</div>
              <p className="mb-2" style={{ fontSize: "15px", color: T.ink }}>{t.a}</p>
              <p className="italic" style={{ fontSize: "14.5px", color: T.signal, fontFamily: "Instrument Serif" }}>{t.r}</p>
            </div>
          ))}
        </div>
      )}

      {typeof stage === "number" && (
        <>
          <div className="mb-2 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>{POSITIONING_MICRO_STEPS[stage].q}</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder={POSITIONING_MICRO_STEPS[stage].ph}
            className="w-full rounded-md px-4 py-3 outline-none resize-none"
            style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
            autoFocus
          />
          <button
            onClick={() => submitMicro(POSITIONING_MICRO_STEPS[stage])}
            disabled={!draft.trim() || reacting}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30"
            style={{ fontSize: "14px", background: T.ink, color: "#fff" }}
          >
            {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={15} />}
          </button>
        </>
      )}

      {stage === "template" && (
        <>
          <div className="mb-4 font-medium" style={{ fontSize: "20px", color: T.ink, fontFamily: "Instrument Serif" }}>Now let's assemble it into one sentence.</div>
          <div className="rounded-xl p-6 space-y-4" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
            {[
              ["audience", "For (audience)"],
              ["market", "unlike (competitive alternative)"],
              ["promise", "this brand (promise)"],
              ["rtb", "because (reason to believe)"],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block font-medium mb-1" style={{ fontSize: "12.5px", color: T.inkSoft }}>{label}</label>
                <input
                  value={p[field]}
                  disabled={p.locked}
                  onChange={set(field)}
                  className="w-full rounded-md px-3.5 py-2 outline-none disabled:opacity-70"
                  style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
                />
              </div>
            ))}
          </div>

          {!p.locked && (
            <CoachBox
              systemFrame={`${getCoachPersona(project.level)}\nRun the "swap test" on this positioning statement in your head: audience="${p.audience}", alternative="${p.market}", promise="${p.promise}", reason to believe="${p.rtb}". Would a direct competitor be able to say the exact same sentence? If so, ask questions that lead the student to find the gap themselves, especially around the reason to believe — don't just tell them it's not specific enough.`}
              studentText={`For ${p.audience}, unlike ${p.market}, this brand ${p.promise}, because ${p.rtb}.`}
              disabled={!filled}
            />
          )}

          {p.locked ? (
            <div className="mt-6 rounded-lg px-5 py-4" style={{ background: T.marigold, borderLeft: `4px solid ${T.rule}` }}>
              <Pin size={14} style={{ color: T.ink, display: "inline", marginRight: 8 }} />
              <span className="italic" style={{ fontSize: "19px", fontFamily: "Instrument Serif", color: T.ink }}>
                For {p.audience}, unlike {p.market}, this brand {p.promise}, because {p.rtb}.
              </span>
            </div>
          ) : (
            <button onClick={() => setShowReflection(true)} disabled={!filled} className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: T.paperRaised }}>
              <Lock size={14} /> Lock &amp; Continue
            </button>
          )}
          {p.locked && (
            <button onClick={() => onRequestReopen("positioning")} className="ml-3 mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium" style={{ fontSize: "13.5px", color: T.rule }}>
              <RotateCcw size={13} /> Reopen
            </button>
          )}

          {showReflection && (
            <ReflectionModal
              prompts={["What assumptions is this positioning resting on?", "How might a skeptical colleague, or the client, disagree with it?"]}
              onSubmit={doLock}
              onClose={() => setShowReflection(false)}
            />
          )}
          <NextButton onClick={onNext}>{p.locked ? "Continue" : "Continue — I'll come back to this"}</NextButton>
        </>
      )}
    </div>
  );
}

function DifferentiatorsStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const p = project.positioning;
  const [drafted, setDrafted] = useState(project.differentiators.map((d) => d.text));
  const [loading, setLoading] = useState(false);
  const [evalStage, setEvalStage] = useState(project.differentiators.length > 0 ? "editing" : null); // null | 'pending' | 'editing'

  const generate = async () => {
    setLoading(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nDraft 2-3 short, specific, concrete differentiator statements based ONLY on what this student has already said \u2014 don't invent new claims. Their positioning: "For ${p.audience}, unlike ${p.market}, this brand ${p.promise}, because ${p.rtb}." Their opportunity: "${project.opportunity.text}." Their stated difference from alternatives: "${p.difference}." Return ONLY the differentiators, one per line, no numbering, no bullets, no preamble, no explanation \u2014 just the plain statements, each under 15 words.`,
      "Draft the differentiators.",
      200
    );
    const lines = r.split("\n").map((l) => l.replace(/^[-•\d.)\s]+/, "").trim()).filter(Boolean);
    setDrafted(lines.length ? lines : [""]);
    setLoading(false);
    setEvalStage("pending");
  };

  const updateLine = (i, val) => setDrafted((d) => d.map((x, idx) => (idx === i ? val : x)));
  const removeLine = (i) => setDrafted((d) => d.filter((_, idx) => idx !== i));
  const addLine = () => setDrafted((d) => [...d, ""]);

  const confirm = () => {
    const cleaned = drafted.map((t) => t.trim()).filter(Boolean);
    setProject({ ...project, differentiators: cleaned.map((text) => ({ id: crypto.randomUUID(), text })) });
    onNext();
  };

  return (
    <div>
      {project.flags?.differentiators && <FlagBanner onResolve={() => onResolveFlag("differentiators")} />}
      <SectionHeader eyebrow="06" title="What makes this different?" sub="You already told me what sets this apart — let's turn that into a few clear, specific statements." />

      {!evalStage ? (
        <button onClick={generate} disabled={loading} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-60" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loading ? "Drafting…" : "Draft this from what I already said"}
        </button>
      ) : evalStage === "pending" ? (
        <>
          <DraftReview onGood={confirm} onChange={() => setEvalStage("editing")} onWrong={generate} />
          <div className="space-y-2">
            {drafted.map((line, i) => (
              <div key={i} className="rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
                <p style={{ fontSize: "15px", color: T.ink }}>{line}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {drafted.map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={line} onChange={(e) => updateLine(i, e.target.value)} className="flex-1 rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
                <button onClick={() => removeLine(i)} style={{ color: T.inkSoft }}><X size={16} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={addLine} className="inline-flex items-center gap-1 font-medium" style={{ fontSize: "13px", color: T.signal }}><Plus size={14} /> Add one</button>
          </div>
          <NextButton onClick={confirm}>Continue</NextButton>
        </>
      )}
    </div>
  );
}

function AttributesStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const [anchor, setAnchor] = useState("");
  const [drafted, setDrafted] = useState(project.attributes.map((a) => ({ this: a.this, not: a.not })));
  const [loading, setLoading] = useState(false);
  const [evalStage, setEvalStage] = useState(project.attributes.length > 0 ? "editing" : null); // null | 'pending' | 'editing'
  const p = project.positioning;

  const generate = async () => {
    if (!anchor.trim()) return;
    setLoading(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student said this brand genuinely is: "${anchor}". Draft 2-3 "this, not that" attribute pairs based ONLY on that and their existing positioning ("For ${p.audience}, unlike ${p.market}, this brand ${p.promise}, because ${p.rtb}.") and pillars (${project.pillars.map((pl) => pl.name).join(", ") || "none yet"}). The "not" side must be a real, plausible alternative a competitor could actually be — never a strawman nobody would choose. Return ONLY lines in the exact format "this | not", one pair per line, no numbering, no preamble.`,
      "Draft the attribute pairs.",
      220
    );
    const pairs = r.split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((parts) => parts.length === 2 && parts[0] && parts[1]).map(([a, b]) => ({ this: a, not: b }));
    setDrafted(pairs.length ? pairs : [{ this: anchor, not: "" }]);
    setLoading(false);
    setEvalStage("pending");
  };

  const update = (i, field, val) => setDrafted((d) => d.map((x, idx) => (idx === i ? { ...x, [field]: val } : x)));
  const remove = (i) => setDrafted((d) => d.filter((_, idx) => idx !== i));
  const addPair = () => setDrafted((d) => [...d, { this: "", not: "" }]);

  const confirm = () => {
    const cleaned = drafted.filter((a) => a.this.trim() && a.not.trim());
    setProject({ ...project, attributes: cleaned.map((a) => ({ id: crypto.randomUUID(), this: a.this, not: a.not })) });
    onNext();
  };

  return (
    <div>
      {project.flags?.attributes && <FlagBanner onResolve={() => onResolveFlag("attributes")} />}
      <SectionHeader eyebrow="07" title="This, not that" sub="A few honest contrasts — what this brand truly is, and the tempting opposite it deliberately isn't." />

      {!evalStage ? (
        <>
          <div className="mb-1.5 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>What's one true, specific quality of this brand — something a competitor couldn't also honestly claim?</div>
          <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>Not generic ("high quality," "friendly") — something genuinely true of this one.</p>
          <input value={anchor} onChange={(e) => setAnchor(e.target.value)} placeholder="e.g., unhurried"
            className="w-full rounded-md px-4 py-3 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={generate} disabled={!anchor.trim() || loading} className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {loading ? "Drafting…" : "Draft the pairs"}
          </button>
        </>
      ) : evalStage === "pending" ? (
        <>
          <DraftReview onGood={confirm} onChange={() => setEvalStage("editing")} onWrong={() => setEvalStage(null)} />
          <div className="space-y-2">
            {drafted.map((a, i) => (
              <div key={i} className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
                <span className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{a.this}</span>
                <span style={{ fontSize: "12px", color: T.inkSoft }}>not</span>
                <span className="italic" style={{ fontSize: "15px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>{a.not}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {drafted.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={a.this} onChange={(e) => update(i, "this", e.target.value)} className="flex-1 rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
                <span style={{ fontSize: "12px", color: T.inkSoft }}>not</span>
                <input value={a.not} onChange={(e) => update(i, "not", e.target.value)} className="flex-1 rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
                <button onClick={() => remove(i)} style={{ color: T.inkSoft }}><X size={16} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={addPair} className="inline-flex items-center gap-1 font-medium" style={{ fontSize: "13px", color: T.signal }}><Plus size={14} /> Add a pair</button>
          </div>
          <NextButton onClick={confirm}>Continue</NextButton>
        </>
      )}
    </div>
  );
}

function PillarsStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const p = project.positioning;
  const [anchor, setAnchor] = useState("");
  const [drafted, setDrafted] = useState(project.pillars.map((pl) => ({ name: pl.name, link: pl.link })));
  const [loading, setLoading] = useState(false);
  const [evalStage, setEvalStage] = useState(project.pillars.length > 0 ? "editing" : null); // null | 'pending' | 'editing'

  const generate = async () => {
    if (!anchor.trim()) return;
    setLoading(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student's positioning: "For ${p.audience}, unlike ${p.market}, this brand ${p.promise}, because ${p.rtb}." They just described a few things that have to be true, day to day, for that promise to hold up: "${anchor}". Segment this into 3 distinct strategic pillars \u2014 short, ownable names \u2014 based ONLY on what they said, don't invent new ideas. Return ONLY lines in the exact format "Name | one-sentence link back to why this matters", one pillar per line, no numbering, no preamble.`,
      "Draft the pillars.",
      250
    );
    const pillars = r.split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((parts) => parts.length === 2 && parts[0] && parts[1]).map(([name, link]) => ({ name, link }));
    setDrafted(pillars.length ? pillars : [{ name: "", link: anchor }]);
    setLoading(false);
    setEvalStage("pending");
  };

  const update = (i, field, val) => setDrafted((d) => d.map((x, idx) => (idx === i ? { ...x, [field]: val } : x)));
  const remove = (i) => setDrafted((d) => d.filter((_, idx) => idx !== i));
  const addPillar = () => setDrafted((d) => [...d, { name: "", link: "" }]);

  const confirm = () => {
    const cleaned = drafted.filter((pl) => pl.name.trim());
    setProject({ ...project, pillars: cleaned.map((pl) => ({ id: crypto.randomUUID(), name: pl.name, link: pl.link, locked: true })) });
    onNext();
  };

  return (
    <div>
      {project.flags?.pillars && <FlagBanner onResolve={() => onResolveFlag("pillars")} />}
      <SectionHeader eyebrow="08" title="Pillars" sub="A few small strategic ideas, derived from your positioning — not brainstormed fresh." />

      {!evalStage ? (
        <>
          <div className="rounded-lg px-4 py-3 mb-5" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
            <p className="italic" style={{ fontSize: "14.5px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>For {p.audience}, unlike {p.market}, this brand {p.promise}, because {p.rtb}.</p>
          </div>
          <div className="mb-1.5 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>
            Looking at that — what are a couple of things that have to be true, day to day, for that promise to actually hold up?
          </div>
          <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>You can list a few in one go — I'll help sort them into pillars.</p>
          <textarea value={anchor} onChange={(e) => setAnchor(e.target.value)} rows={3} placeholder="Things your team would need to do or believe, consistently, for this to be real."
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={generate} disabled={!anchor.trim() || loading} className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {loading ? "Sorting into pillars…" : "Turn this into pillars"}
          </button>
        </>
      ) : evalStage === "pending" ? (
        <>
          <DraftReview onGood={confirm} onChange={() => setEvalStage("editing")} onWrong={() => setEvalStage(null)} />
          <div className="space-y-3">
            {drafted.map((pl, i) => (
              <div key={i} className="rounded-lg px-4 py-3" style={{ background: T.marigoldSoft, border: `1px solid ${T.line}` }}>
                <div className="italic mb-0.5" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>{pl.name}</div>
                <div style={{ fontSize: "13px", color: T.inkSoft }}>{pl.link}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {drafted.map((pl, i) => (
              <div key={i} className="rounded-lg px-4 py-3" style={{ background: T.marigoldSoft, border: `1px solid ${T.line}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <input value={pl.name} onChange={(e) => update(i, "name", e.target.value)} className="flex-1 rounded-md px-2.5 py-1.5 outline-none italic" style={{ fontSize: "16px", background: T.paperRaised, border: `1px solid ${T.line}`, fontFamily: "Instrument Serif" }} />
                  <button onClick={() => remove(i)} style={{ color: T.inkSoft }}><X size={16} /></button>
                </div>
                <input value={pl.link} onChange={(e) => update(i, "link", e.target.value)} className="w-full rounded-md px-2.5 py-1.5 outline-none" style={{ fontSize: "13px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={addPillar} className="inline-flex items-center gap-1 font-medium" style={{ fontSize: "13px", color: T.signal }}><Plus size={14} /> Add one</button>
          </div>
          <NextButton onClick={confirm}>Continue</NextButton>
        </>
      )}
    </div>
  );
}

const VISUAL_CATEGORIES = [
  { id: "Typography", hint: "A typeface style, weight, or pairing \u2014 plain words are fine if you don't know type terms yet." },
  { id: "Color", hint: "A palette direction \u2014 warm vs. cool, bright vs. muted, one dominant hue vs. many." },
  { id: "Imagery", hint: "Photography, illustration, iconography \u2014 and in what style?" },
  { id: "Layout", hint: "Dense and information-rich, or open and spacious? A structured grid, or something looser?" },
  { id: "Materials & Touchpoints", hint: "Paper stock, packaging, signage, digital surfaces \u2014 whatever's relevant here." },
  { id: "Motion & Interaction", hint: "Subtle and quiet, or expressive and playful? Skip this one if it doesn't apply to your project." },
];

function PhilosophyStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const ph = project.philosophy;
  const p = project.positioning;
  const [draft, setDraft] = useState({ what: ph.what, how: ph.how, why: ph.why });
  const [loading, setLoading] = useState(false);
  const [evalStage, setEvalStage] = useState(ph.what || ph.how || ph.why ? "editing" : null); // null | 'pending' | 'editing'

  const generate = async () => {
    setLoading(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nDraft a short What/How/Why for this student's project, based ONLY on what they've already told you — don't invent new claims. Opportunity: "${project.opportunity.text}". Positioning: "For ${p.audience}, unlike ${p.market}, this brand ${p.promise}, because ${p.rtb}." Pillars: ${project.pillars.map((pl) => `${pl.name} (${pl.link})`).join("; ") || "none yet"}. Return EXACTLY three lines in this format, nothing else: "What: ..." then "How: ..." then "Why: ...", each one plain sentence.`,
      "Draft the philosophy.",
      220
    );
    const get = (label) => { const m = r.match(new RegExp(label + ":\\s*(.+)")); return m ? m[1].trim() : ""; };
    setDraft({ what: get("What") || ph.what, how: get("How") || ph.how, why: get("Why") || ph.why });
    setLoading(false);
    setEvalStage("pending");
  };

  const confirm = () => {
    setProject({ ...project, philosophy: { ...draft, locked: true } });
    onNext();
  };

  return (
    <div>
      {project.flags?.philosophy && <FlagBanner onResolve={() => onResolveFlag("philosophy")} />}
      <SectionHeader eyebrow="09" title="What, how, and why" sub="You've already said enough for this — let's put it together." />

      {!evalStage ? (
        <button onClick={generate} disabled={loading} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-60" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loading ? "Drafting…" : "Draft this from what I already said"}
        </button>
      ) : evalStage === "pending" ? (
        <>
          <DraftReview onGood={confirm} onChange={() => setEvalStage("editing")} onWrong={generate} />
          <div className="space-y-4">
            {[["what", "What"], ["how", "How"], ["why", "Why"]].map(([key, label]) => (
              <div key={key} className="rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
                <div className="uppercase font-semibold mb-1" style={{ fontSize: "10.5px", color: T.inkSoft }}>{label}</div>
                <p className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{draft[key]}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {[["what", "What"], ["how", "How"], ["why", "Why"]].map(([key, label]) => (
              <div key={key}>
                <label className="block uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>{label}</label>
                <textarea value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} rows={2}
                  className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
              </div>
            ))}
          </div>
          <div><NextButton onClick={confirm}>Continue</NextButton></div>
        </>
      )}
    </div>
  );
}

function VoiceStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const v = project.voice;
  const [draft, setDraft] = useState(v.style);
  const [avoidDraft, setAvoidDraft] = useState(v.avoid);
  const [loading, setLoading] = useState(false);
  const [evalStage, setEvalStage] = useState(v.style ? "editing" : null); // null | 'pending' | 'editing'

  const generate = async () => {
    if (!draft.trim()) return;
    setLoading(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student described this brand's voice as: "${draft}". Based on that and their attributes (${project.attributes.map((a) => `${a.this}, not ${a.not}`).join("; ") || "none yet"}), draft one short sentence about words, phrases, or tones this brand would NEVER use. Return ONLY that one sentence, no preamble.`,
      "Draft the avoid list.",
      100
    );
    setAvoidDraft(r.trim());
    setLoading(false);
    setEvalStage("pending");
  };

  const confirm = () => {
    setProject({ ...project, voice: { style: draft, avoid: avoidDraft, locked: true } });
    onNext();
  };

  return (
    <div>
      {project.flags?.voice && <FlagBanner onResolve={() => onResolveFlag("voice")} />}
      <SectionHeader eyebrow="10" title="How does it sound?" sub="If this brand spoke out loud, what would it actually sound like?" />

      <div className="mb-1.5 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>Casual or formal? Playful or serious? Describe how it talks.</div>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Describe it like you'd describe a person's way of talking."
        className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} disabled={evalStage === "pending"} autoFocus />

      {!evalStage ? (
        <button onClick={generate} disabled={!draft.trim() || loading} className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {loading ? "Drafting…" : "Continue"}
        </button>
      ) : evalStage === "pending" ? (
        <div className="mt-5">
          <DraftReview onGood={confirm} onChange={() => setEvalStage("editing")} onWrong={generate} />
          <div className="rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
            <div className="uppercase font-semibold mb-1" style={{ fontSize: "10.5px", color: T.inkSoft }}>Would never sound like</div>
            <p className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{avoidDraft}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 mb-2">
            <label className="block uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>Would never sound like</label>
            <textarea value={avoidDraft} onChange={(e) => setAvoidDraft(e.target.value)} rows={2}
              className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "14.5px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
          </div>
          <div className="mt-6"><NextButton onClick={confirm}>Continue</NextButton></div>
        </>
      )}
    </div>
  );
}

function PersonaStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const per = project.persona;
  const [stage, setStage] = useState(per.notThis.trim() ? "done" : !per.description.trim() ? 0 : 1);
  const [draft, setDraft] = useState("");

  const submitDesc = () => { if (!draft.trim()) return; setProject({ ...project, persona: { ...per, description: draft } }); setDraft(""); setStage(1); };
  const submitNot = () => { if (!draft.trim()) return; setProject({ ...project, persona: { ...per, notThis: draft } }); setDraft(""); setStage("done"); };

  return (
    <div>
      {project.flags?.persona && <FlagBanner onResolve={() => onResolveFlag("persona")} />}
      <SectionHeader eyebrow="11" title="If it were a person" sub="A quick way to make an abstract brand feel like something real and consistent." />

      {stage === 0 && (
        <>
          <div className="mb-1.5 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>If this brand walked into a room as a person, who would they be?</div>
          <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>Describe them like a character \u2014 how they act, what they care about.</p>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Give them a personality, not just adjectives."
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={submitDesc} disabled={!draft.trim()} className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            Continue <ArrowRight size={15} />
          </button>
        </>
      )}

      {stage === 1 && (
        <>
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
            <p style={{ fontSize: "14.5px", color: T.ink }}>{per.description}</p>
          </div>
          <div className="mb-1.5 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>What's one trait they definitely would <i>not</i> have?</div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="A real, plausible trait they deliberately don't have."
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={submitNot} disabled={!draft.trim()} className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            Continue <ArrowRight size={15} />
          </button>
        </>
      )}

      {stage === "done" && (
        <div className="rounded-lg px-4 py-3 mb-8" style={{ background: T.marigoldSoft, border: `1px solid ${T.line}` }}>
          <p className="italic mb-2" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{per.description}</p>
          <p style={{ fontSize: "13.5px", color: T.inkSoft }}>Not: {per.notThis}</p>
        </div>
      )}

      <NextButton onClick={onNext} />
    </div>
  );
}

function VisualStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const doneCategories = new Set(project.visual.map((v) => v.category));
  const catIndex = VISUAL_CATEGORIES.findIndex((c) => !doneCategories.has(c.id));
  const allDone = catIndex === -1;
  const cat = allDone ? null : VISUAL_CATEGORIES[catIndex];

  const [qStage, setQStage] = useState(0); // 0: feel, 1: approach, 2: connection, 3: summary
  const [feel, setFeel] = useState("");
  const [approach, setApproach] = useState("");
  const [connection, setConnection] = useState("");
  const [feelReaction, setFeelReaction] = useState("");
  const [approachReaction, setApproachReaction] = useState("");
  const [reacting, setReacting] = useState(false);

  const resetLocal = () => {
    setQStage(0); setFeel(""); setApproach(""); setConnection("");
    setFeelReaction(""); setApproachReaction("");
  };

  const skip = () => {
    setProject({ ...project, visual: [...project.visual, { id: crypto.randomUUID(), category: cat.id, choice: "", justification: "", locked: false, exploring: false, skipped: true }] });
    resetLocal();
  };

  const submitFeel = async () => {
    if (!feel.trim()) return;
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThe student is working through visual direction for the "${cat.id}" category. They just answered what they want ${cat.id.toLowerCase()} to make the audience feel, understand, or believe. React in ONE short sentence, a quick human acknowledgment or light nudge, then stop.`,
      feel,
      100
    );
    setFeelReaction(r);
    setReacting(false);
    setQStage(1);
  };

  const submitApproach = async () => {
    if (!approach.trim()) return;
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nStudent's locked pillars: ${project.pillars.map((p) => p.name).join(", ") || "none yet"}. For "${cat.id}", they want it to achieve: "${feel}". Their proposed approach: "${approach}". React in ONE short sentence — a quick human acknowledgment or light nudge toward whether this approach actually achieves what they said they wanted — then stop.`,
      approach,
      100
    );
    setApproachReaction(r);
    setReacting(false);
    setQStage(2);
  };

  const submitConnection = () => {
    if (!connection.trim()) return;
    setQStage(3);
  };

  const finalize = (mode) => {
    setProject({
      ...project,
      visual: [...project.visual, { id: crypto.randomUUID(), category: cat.id, choice: approach, justification: connection, locked: mode === "lock", exploring: mode === "explore" }],
    });
    resetLocal();
  };

  return (
    <div>
      {project.flags?.visual && <FlagBanner onResolve={() => onResolveFlag("visual")} />}
      <SectionHeader eyebrow="12" title="Connect strategy to visual direction" sub="One category at a time. Visual choices aren't personal preferences here — they're communication decisions." />

      {project.visual.length > 0 && (
        <div className="space-y-2 mb-7">
          {project.visual.map((v) => (
            <div key={v.id} className="rounded-lg px-4 py-3" style={{ background: v.locked ? T.marigoldSoft : T.paperRaised, border: `1px solid ${T.line}` }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold" style={{ fontSize: "12px", color: T.inkSoft }}>{v.category}</span>
                {v.locked && <Lock size={12} style={{ color: T.ink }} />}
                {v.exploring && <span className="italic" style={{ fontSize: "11.5px", color: T.signal }}>exploring</span>}
                {v.skipped && <span className="italic" style={{ fontSize: "11.5px", color: T.inkSoft }}>skipped</span>}
              </div>
              {!v.skipped && <div className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{v.choice}</div>}
            </div>
          ))}
        </div>
      )}

      {!allDone && (
        <div className="rounded-xl p-6" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
          <div className="uppercase font-semibold mb-4" style={{ fontSize: "10.5px", letterSpacing: "0.1em", color: T.inkSoft }}>{cat.id}</div>

          {qStage === 0 && (
            <>
              <div className="mb-2 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>
                What should this help the audience feel, understand, or believe?
              </div>
              <textarea value={feel} onChange={(e) => setFeel(e.target.value)} rows={2} placeholder="e.g., trustworthy, playful, urgent, calm..."
                className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paper, border: `1px solid ${T.line}` }} autoFocus />
              <div className="flex items-center gap-3 mt-3">
                <button onClick={submitFeel} disabled={!feel.trim() || reacting} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
                  {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={14} />}
                </button>
                <button onClick={skip} style={{ fontSize: "12.5px", color: T.inkSoft }}>Skip — not relevant for this project</button>
              </div>
            </>
          )}

          {qStage === 1 && (
            <>
              {feelReaction && (
                <div className="mb-5 pl-5 pr-4 py-3 rounded-lg fade-in" style={{ background: T.lavender }}>
                  <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "11px", letterSpacing: "0.1em", color: T.signal }}>Your professor, leaning in</div>
                  <p className="italic leading-relaxed" style={{ fontSize: "15.5px", color: T.ink, fontFamily: "Instrument Serif" }}>{feelReaction}</p>
                </div>
              )}
              <div className="mb-2 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>
                What kind of visual approach could support that?
              </div>
              <textarea value={approach} onChange={(e) => setApproach(e.target.value)} rows={2} placeholder={cat.hint}
                className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paper, border: `1px solid ${T.line}` }} autoFocus />
              <button onClick={submitApproach} disabled={!approach.trim() || reacting} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
                {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={14} />}
              </button>
            </>
          )}

          {qStage === 2 && (
            <>
              {approachReaction && (
                <div className="mb-5 pl-5 pr-4 py-3 rounded-lg fade-in" style={{ background: T.lavender }}>
                  <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "11px", letterSpacing: "0.1em", color: T.signal }}>Your professor, leaning in</div>
                  <p className="italic leading-relaxed" style={{ fontSize: "15.5px", color: T.ink, fontFamily: "Instrument Serif" }}>{approachReaction}</p>
                </div>
              )}
              <div className="mb-2 font-medium" style={{ fontSize: "18px", color: T.ink, fontFamily: "Instrument Serif" }}>
                How does that connect back to your positioning or pillars?
              </div>
              <textarea value={connection} onChange={(e) => setConnection(e.target.value)} rows={2} placeholder="Name the specific pillar or part of your positioning this supports."
                className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paper, border: `1px solid ${T.line}` }} autoFocus />
              <button onClick={submitConnection} disabled={!connection.trim()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
                Continue <ArrowRight size={14} />
              </button>
            </>
          )}

          {qStage === 3 && (
            <>
              <div className="mb-5 rounded-lg p-4" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
                <p className="italic mb-2" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>{approach}</p>
                <p style={{ fontSize: "13.5px", color: T.inkSoft }}>{connection}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => finalize("lock")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
                  <Lock size={13} /> Lock this direction
                </button>
                <button onClick={() => finalize("explore")} className="px-4 py-2 rounded-md font-medium" style={{ fontSize: "13.5px", background: T.lavender, color: T.signal }}>
                  Mark as exploring
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <NextButton onClick={onNext} />
    </div>
  );
}


const SYNTHESIS_STEPS = [
  { key: "researchReveal", q: "What did your research reveal?", ph: "The most important thing you noticed or found." },
  { key: "keyInsight", q: "What pattern or insight mattered most?", ph: "Not just a summary \u2014 what did it actually mean?" },
  { key: "opportunityWhy", q: "What opportunity did that create?", ph: "The gap or tension your research pointed to." },
  { key: "strategicDecision", q: "What strategic decision did you make because of it?", ph: "The bet you made \u2014 your positioning, in your own words." },
  { key: "visualResponse", q: "How did that strategy shape your visual direction?", ph: "Which visual choices trace back to that decision, and how?" },
  { key: "takeaway", q: "What should someone understand after seeing your final design?", ph: "The one thing you want to land." },
];

function SynthesisStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const m = project.synthesisMap || { researchReveal: "", keyInsight: "", opportunityWhy: "", strategicDecision: "", visualResponse: "", takeaway: "" };
  const allMapped = SYNTHESIS_STEPS.every((s) => (m[s.key] || "").trim());
  const startStage = project.synthesis.text.trim() ? "refine" : allMapped ? "map" : 0;
  const [stage, setStage] = useState(startStage);
  const [draft, setDraft] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [reacting, setReacting] = useState(false);
  const s = project.synthesis;

  const submitStep = async (step) => {
    if (!draft.trim()) return;
    setProject({ ...project, synthesisMap: { ...m, [step.key]: draft } });
    setReacting(true);
    const r = await askClaude(
      `${getCoachPersona(project.level)}\nThis is one step in a sequence building a narrative map: research \u2192 insight \u2192 opportunity \u2192 decision \u2192 visual direction \u2192 takeaway. The student just answered "${step.q}" with their response below. React in ONE short sentence \u2014 a quick human acknowledgment or light nudge \u2014 then stop.`,
      draft,
      100
    );
    setTranscript((t) => [...t, { q: step.q, a: draft, r }]);
    setDraft("");
    setReacting(false);
    const idx = SYNTHESIS_STEPS.indexOf(step);
    setStage(idx + 1 < SYNTHESIS_STEPS.length ? idx + 1 : "map");
  };

  return (
    <div>
      {project.flags?.synthesis && <FlagBanner onResolve={() => onResolveFlag("synthesis")} />}
      <SectionHeader eyebrow="13" title="Bring it together" sub="A good presentation isn't a sequence of slides. It's a story of thinking — what you learned, what it meant, what you decided, how the design responds." />

      {transcript.length > 0 && stage !== "map" && stage !== "refine" && (
        <div className="space-y-5 mb-8">
          {transcript.map((t, i) => (
            <div key={i} className="pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>{t.q}</div>
              <p className="mb-2" style={{ fontSize: "15px", color: T.ink }}>{t.a}</p>
              <p className="italic" style={{ fontSize: "14.5px", color: T.signal, fontFamily: "Instrument Serif" }}>{t.r}</p>
            </div>
          ))}
        </div>
      )}

      {typeof stage === "number" && (
        <>
          {stage === 2 && (
            <div className="mb-4 rounded-lg px-4 py-3" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1" style={{ fontSize: "10.5px", color: T.inkSoft }}>Reminder \u2014 your locked opportunity</div>
              <p className="italic" style={{ fontSize: "14px", color: T.ink, fontFamily: "Instrument Serif" }}>{project.opportunity.text}</p>
            </div>
          )}
          {stage === 3 && (
            <div className="mb-4 rounded-lg px-4 py-3" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1" style={{ fontSize: "10.5px", color: T.inkSoft }}>Reminder \u2014 your locked positioning</div>
              <p className="italic" style={{ fontSize: "14px", color: T.ink, fontFamily: "Instrument Serif" }}>For {project.positioning.audience}, unlike {project.positioning.market}, this brand {project.positioning.promise}, because {project.positioning.rtb}.</p>
            </div>
          )}
          {stage === 4 && project.visual.length > 0 && (
            <div className="mb-4 rounded-lg px-4 py-3" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-1" style={{ fontSize: "10.5px", color: T.inkSoft }}>Reminder \u2014 your visual direction</div>
              <p style={{ fontSize: "13.5px", color: T.ink }}>{project.visual.filter((v) => !v.skipped).map((v) => `${v.category}: ${v.choice}`).join(" \u2014 ")}</p>
            </div>
          )}
          <div className="mb-2 font-medium" style={{ fontSize: "19px", color: T.ink, fontFamily: "Instrument Serif" }}>{SYNTHESIS_STEPS[stage].q}</div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder={SYNTHESIS_STEPS[stage].ph}
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={() => submitStep(SYNTHESIS_STEPS[stage])} disabled={!draft.trim() || reacting}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            {reacting ? "…" : "Continue"} {!reacting && <ArrowRight size={15} />}
          </button>
        </>
      )}

      {stage === "map" && (
        <>
          <div className="mb-2 font-medium" style={{ fontSize: "20px", color: T.ink, fontFamily: "Instrument Serif" }}>Here's your narrative map.</div>
          <p className="mb-6" style={{ fontSize: "14.5px", color: T.inkSoft }}>This is rough material, not a finished summary. Read it through, then write your own version below.</p>
          <div className="space-y-4 mb-8">
            {SYNTHESIS_STEPS.map((step) => (
              <div key={step.key} className="rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
                <div className="uppercase font-semibold mb-1" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>{step.q}</div>
                <p style={{ fontSize: "14.5px", color: T.ink }}>{m[step.key]}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setStage("refine")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            Write my own version <ArrowRight size={15} />
          </button>
        </>
      )}

      {stage === "refine" && (
        <>
          <div className="mb-4 font-medium" style={{ fontSize: "20px", color: T.ink, fontFamily: "Instrument Serif" }}>Now write it in your own words.</div>
          <textarea
            value={s.text}
            onChange={(e) => setProject({ ...project, synthesis: { ...s, text: e.target.value } })}
            rows={8}
            placeholder="Research to insight to decision to design — the connected story, in your own words."
            className="w-full rounded-md px-4 py-3 outline-none resize-none leading-relaxed"
            style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
          />
          <CoachBox
            systemFrame={`${getCoachPersona(project.level)}\nThe student wrote a synthesis narrative connecting their research, insight, positioning, and visual direction. For reference, their raw material: research \u2192 "${m.researchReveal}"; insight \u2192 "${m.keyInsight}"; opportunity \u2192 "${m.opportunityWhy}"; decision \u2192 "${m.strategicDecision}"; visual response \u2192 "${m.visualResponse}". Read their written narrative for logical gaps or unsupported jumps — does each step visibly follow from the last? Ask about the weakest joint specifically. Do not write or rewrite the narrative for them.`}
            studentText={s.text}
            label="Check my narrative's logic"
          />
          <NextButton onClick={onNext} disabled={!s.text.trim()} children="Continue to Presentation Review" />
        </>
      )}
    </div>
  );
}

/* ============================================================
   PRESENTATION REVIEW
   ============================================================ */
const ROLES = [
  { id: "strategist", name: "Senior Design Strategist", focus: "evidence and reasoning chains" },
  { id: "creative", name: "Creative Director", focus: "distinctiveness and courage" },
  { id: "client", name: "Client", focus: "business value in plain language" },
  { id: "marketing", name: "Marketing Director", focus: "reach and channel flexibility" },
  { id: "professor", name: "Professor", focus: "growth and self-awareness" },
  { id: "ux", name: "UX Director", focus: "function over form" },
  { id: "brand", name: "Brand Manager", focus: "consistency and governance" },
];

function PresentationReview({ project }) {
  const [role, setRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const projectSummary = `
Project: ${project.name}. Positioning: "For ${project.positioning.audience}, unlike ${project.positioning.market}, this brand ${project.positioning.promise}, because ${project.positioning.rtb}."
Opportunity: ${project.opportunity.text}
Differentiators: ${project.differentiators.map((d) => d.text).join("; ")}
Attributes: ${project.attributes.map((a) => `${a.this}, not ${a.not}`).join("; ")}
Pillars: ${project.pillars.map((p) => `${p.name} (${p.link})`).join("; ")}
Philosophy — What: ${project.philosophy.what} How: ${project.philosophy.how} Why: ${project.philosophy.why}
Voice: ${project.voice.style} Never: ${project.voice.avoid}
Persona: ${project.persona.description} Not: ${project.persona.notThis}
Visual direction: ${project.visual.map((v) => `${v.category}: ${v.choice} (${v.justification})`).join("; ")}
`;

  const send = async () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { from: "student", text: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    const r = active
      ? await askClaude(
          `You are role-playing as a ${active.name} in a live design critique of a student's strategy project. Your characteristic focus is ${active.focus}. Project context:\n${projectSummary}\nRespond in character to what the student just presented — ask a pointed, specific follow-up question, or challenge a weak claim, or briefly affirm strong reasoning before pushing further. Never grade or summarize; this is a real-time conversational critique. Stay fully in character, first person, no stage directions.`,
          input,
          260
        )
      : "";
    setMessages((m) => [...m, { from: "reviewer", text: r }]);
    setLoading(false);
  };

  const active = ROLES.find((r) => r.id === role);

  if (!role) {
    return (
      <div>
        <SectionHeader eyebrow="14" title="Presentation Review" sub="Choose who's reviewing. Present your work section by section — they'll respond as you go." />
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => { setRole(r.id); setMessages([{ from: "reviewer", text: `I'm ready when you are. Walk me through your project — start wherever makes sense to you.` }]); }}
              className="text-left rounded-xl p-4" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
              <div className="mb-1" style={{ fontSize: "17px", fontFamily: "Instrument Serif", color: T.ink }}>{r.name}</div>
              <div style={{ fontSize: "12.5px", color: T.inkSoft }}>Probes {r.focus}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader eyebrow={`Reviewing as ${active.name}`} title="Present your work" sub="Say it the way you would in the room. This is rehearsal — nothing here is graded." />
      <div className="rounded-xl p-5 mb-4 overflow-y-auto space-y-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}`, maxHeight: "420px" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "student" ? "justify-end" : "justify-start"}`}>
            <div className="rounded-lg px-3.5 py-2.5 leading-relaxed"
              style={{ fontSize: "14px", background: m.from === "student" ? T.signal : T.paper, color: m.from === "student" ? "#fff" : T.ink, maxWidth: "80%" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <Loader2 size={16} className="animate-spin" style={{ color: T.inkSoft }} />}
      </div>
      <div className="flex gap-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} placeholder="Present the next part..."
          className="flex-1 rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "14.5px", background: T.paperRaised, border: `1px solid ${T.line}` }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button onClick={send} disabled={loading} className="px-4 rounded-md font-medium" style={{ fontSize: "13.5px", background: T.ink, color: T.paperRaised }}>Present</button>
      </div>
      <button onClick={() => setRole(null)} className="mt-4" style={{ fontSize: "13px", color: T.inkSoft }}>← choose a different reviewer</button>
    </div>
  );
}
