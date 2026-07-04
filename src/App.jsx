import React, { useState, useRef } from "react";
import {
  Lock, X, Sparkles, Download, Upload, FileDown, Plus, Pin, RotateCcw, Check,
  AlertCircle, MessageCircle, BookOpen, Users, Layers, Target, Compass, Palette,
  Presentation as PresentationIcon, FileText, ArrowRight, Save,
  Fingerprint, ToggleLeft, Lightbulb, Volume2, UserCircle2, ClipboardCheck,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS  (unchanged, visual language preserved)
   ============================================================ */
const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500&family=IBM+Plex+Mono:ital@0;1&display=swap');
`;

const T = {
  ink: "#241C38",
  inkSoft: "#6A6080",
  paper: "#EAE2F3",
  paperRaised: "#FFFFFF",
  line: "#DDD2EC",
  rule: "#C81E73",
  signal: "#463876",
  signalSoft: "#EFE8F8",
  marigold: "#DFA637",
  marigoldSoft: "#F7E9C9",
  lavender: "#DCCCEC",
};

/* ============================================================
   STRATEGY HANDBOOK  (static reference, unchanged in substance)
   ============================================================ */
const HANDBOOK = {
  observation: {
    title: "Observation",
    def: "A single, specific thing you noticed or found, sourced rather than invented.",
    matters: "Observations are the raw material of strategy. Weak strategy almost always traces back to thin or generic observation.",
    pro: "Professionals log observations separately from what they think those observations mean.",
    example: "Branding: \"Three of five reviews mention the wait being 'worth it.'\" UX: \"Users tap back after the confirmation screen 40% of the time.\"",
    misconception: "An opinion stated confidently is not an observation.",
    related: ["Pattern", "Evidence"],
    stage: "You're likely seeing this while gathering research.",
    ask: "Where did this come from? Could I point someone to it?",
  },
  pattern: {
    title: "Pattern",
    def: "A named interpretation of why several observations belong together. A claim, not a category.",
    matters: "This is where raw research turns into thinking.",
    pro: "Strategists cluster loosely at first, then tighten a pattern name until it survives being said aloud.",
    example: "Branding: \"Customers treat this bakery as a weekend ritual, not an errand.\"",
    misconception: "A pattern that just restates its evidence isn't a pattern yet.",
    related: ["Observation", "Insight"],
    stage: "You're finding what your research adds up to.",
    ask: "If I only read this sentence, would I understand why these belong together?",
  },
  insight: {
    title: "Key Insight",
    def: "The one discovery that changes how you think about the project, not another observation.",
    matters: "An insight explains. An observation only describes.",
    pro: "A real insight is usually the highest leverage sentence in the whole strategy.",
    example: "A bakery finds customers aren't buying bread. They're buying a reason to slow down.",
    misconception: "\"Our audience is busy\" is an observation. What it reveals about them is the insight.",
    related: ["Pattern", "Opportunity"],
    stage: "This becomes the reason your opportunity exists.",
    ask: "What does this reveal that wasn't obvious before I said it?",
  },
  opportunity: {
    title: "Opportunity",
    def: "A gap or tension your research surfaced that the strategy is positioned to address.",
    matters: "A good opportunity is traceable to something you found, not something you wished were true.",
    pro: "Professionals pressure test an opportunity by asking who would disagree with it.",
    example: "A gap between how a brand sees itself and how loyal customers describe it.",
    misconception: "An opportunity isn't a wish list item. It's a claim your research supports.",
    related: ["Insight", "Positioning"],
    stage: "This is where research becomes strategy.",
    ask: "Which research most influenced this? What would change my mind?",
  },
  positioning: {
    title: "Positioning",
    def: "A single sentence stating the audience, market, promise, and reason to believe.",
    matters: "Everything after this sentence unpacks it. If it's vague, everything built on it inherits that vagueness.",
    pro: "Swap in a competitor's name. If the sentence still reads true, it isn't sharp enough.",
    example: "An identity system built around one competitive claim.",
    misconception: "Positioning is not messaging. Mission is a philosophy, positioning is a market bet.",
    related: ["Opportunity", "Pillar"],
    stage: "This becomes the spine of the whole strategy.",
    ask: "Could a direct competitor say this exact sentence?",
  },
  pillar: {
    title: "Strategic Pillar",
    def: "A small number of derived, usable ideas that unpack the positioning into something a team can act on.",
    matters: "Pillars translate one sentence into working tools without losing the thread back to it.",
    pro: "Test pillars for real tradeoffs. A pillar's opposite should be something a competitor could plausibly choose.",
    example: "\"Unhurried, not slow\" as a lived brand pillar.",
    misconception: "A pillar with no visible connection to positioning is just a nice sounding value.",
    related: ["Positioning", "Voice & Tone"],
    stage: "Each pillar should trace back to your positioning.",
    ask: "Which part of my positioning does this actually come from?",
  },
  evidence: {
    title: "Evidence",
    def: "Anything a claim can be traced back to: a sourced observation, a pattern, a prior decision.",
    matters: "Evidence is what separates a strategic decision from an opinion stated with confidence.",
    pro: "Professional strategists keep receipts, not for bureaucracy, but for the moment a client pushes back.",
    example: "Citing which research shaped a positioning choice.",
    misconception: "A strong opinion, repeated confidently, is not evidence.",
    related: ["Observation", "Pattern"],
    stage: "Decisions should be traceable to something you found.",
    ask: "If someone doubted this, what would I point to?",
  },
};

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
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 tracking-wide"
      style={{ fontSize: "11px", background: c.bg, color: c.fg, border: `1px solid ${c.border}`, fontFamily: "Instrument Sans", fontWeight: 500 }}>
      {children}
    </span>
  );
}

/* Educational Blurb: three sentences of teaching, before any question. */
function Blurb({ children }) {
  return (
    <p className="mb-6" style={{ fontSize: "16.5px", lineHeight: "1.65", color: T.ink, maxWidth: "34rem", fontFamily: "Instrument Sans" }}>
      {children}
    </p>
  );
}

/* Studio Note: one sentence, monospace, italic, underlined in the accent color.
   A margin annotation, not a callout. No box, no icon. */
function StudioNote({ children }) {
  return (
    <p
      className="italic underline underline-offset-4 mb-2"
      style={{
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "12.5px",
        color: T.inkSoft,
        opacity: 0.85,
        textDecorationColor: T.rule,
        textDecorationThickness: "1px",
        maxWidth: "28rem",
      }}
    >
      {children}
    </p>
  );
}

function SectionHeader({ eyebrow, title, blurb, note }) {
  return (
    <div className="mb-12 pb-9" style={{ borderBottom: `1.5px solid ${T.rule}` }}>
      <div className="uppercase font-semibold mb-5" style={{ fontSize: "11px", letterSpacing: "0.16em", color: T.inkSoft, fontFamily: "Instrument Sans" }}>{eyebrow}</div>
      <h1 className="mb-6" style={{ fontSize: "44px", lineHeight: "1.02", fontFamily: "Instrument Serif", letterSpacing: "-0.02em", color: T.ink }}>{title}</h1>
      {blurb && <Blurb>{blurb}</Blurb>}
      {note && <StudioNote>{note}</StudioNote>}
    </div>
  );
}


function NextButton({ onClick, disabled, children = "Continue" }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="mt-8 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30"
      style={{ fontSize: "14px", background: T.ink, color: T.paperRaised, fontFamily: "Instrument Sans" }}>
      {children} <ArrowRight size={15} />
    </button>
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
          <span className="font-semibold tracking-[0.12em] uppercase" style={{ fontSize: "11px", color: T.rule, fontFamily: "Instrument Sans" }}>
            This has a ripple effect
          </span>
        </div>
        <h3 className="mb-4" style={{ fontSize: "26px", lineHeight: "1.15", fontFamily: "Instrument Serif", letterSpacing: "-0.01em", color: T.ink }}>
          This will flag {downstream.length} downstream {downstream.length === 1 ? "section" : "sections"} for review
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
          <p className="mb-4" style={{ fontSize: "14px", color: T.inkSoft }}>Nothing downstream is locked yet, so nothing will be flagged.</p>
        )}
        <p className="leading-relaxed mb-6" style={{ fontSize: "13.5px", color: T.inkSoft }}>
          Nothing changes automatically. Reopening is always allowed. The cost is visibility, not penalty.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft, fontFamily: "Instrument Sans" }}>Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 font-semibold rounded-md flex items-center gap-1.5" style={{ fontSize: "13px", background: T.rule, color: T.paperRaised, fontFamily: "Instrument Sans" }}>
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
        <h2 className="mb-4 leading-[1.05]" style={{ fontSize: "38px", fontFamily: "Instrument Serif", letterSpacing: "-0.01em", color: T.ink }}>{h.title}</h2>
        {[["What it is", h.def], ["Why it matters", h.matters], ["How professionals use it", h.pro], ["An example", h.example], ["A common mistake", h.misconception], ["Right now, in your project", h.stage]].map(([label, text]) => (
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
   STEP DEFINITIONS, grouped into phases for navigation only.
   Phases are organizational labels, not additional screens.
   ============================================================ */
const STEPS = [
  { id: "entry", label: "Studio Entry", icon: Compass, phase: null },
  { id: "clientBrief", label: "Client Brief", icon: Target, phase: "Understand" },
  { id: "challenge", label: "Communication Problem", icon: MessageCircle, phase: "Understand" },
  { id: "research", label: "Research", icon: Layers, phase: "Discover" },
  { id: "patterns", label: "Patterns", icon: Sparkles, phase: "Discover" },
  { id: "keyInsight", label: "Key Insight", icon: Lightbulb, phase: "Discover" },
  { id: "audience", label: "Audience", icon: Users, phase: "Discover" },
  { id: "opportunity", label: "Opportunity", icon: Compass, phase: "Define" },
  { id: "positioning", label: "Positioning", icon: Pin, phase: "Define" },
  { id: "differentiators", label: "Differentiators", icon: Fingerprint, phase: "Define" },
  { id: "attributes", label: "Brand Attributes", icon: ToggleLeft, phase: "Define" },
  { id: "pillars", label: "Brand Pillars", icon: BookOpen, phase: "Define" },
  { id: "philosophy", label: "Brand Philosophy", icon: MessageCircle, phase: "Define" },
  { id: "voice", label: "Voice & Tone", icon: Volume2, phase: "Express" },
  { id: "persona", label: "Brand Persona", icon: UserCircle2, phase: "Express" },
  { id: "creative", label: "Creative Direction", icon: Palette, phase: "Express" },
  { id: "summary", label: "Tell the Story", icon: FileText, phase: "Deliver" },
  { id: "critique", label: "Critique Prep", icon: PresentationIcon, phase: "Deliver" },
  { id: "finalReview", label: "Final Review", icon: ClipboardCheck, phase: "Deliver" },
  { id: "brandStrategy", label: "Brand Strategy", icon: Check, phase: "Deliver" },
];

const STEP_LABEL = Object.fromEntries(STEPS.map((s) => [s.id, s.label]));

/* The workbook teaches. The export documents. A few terms differ between
   the two on purpose, per the workbook/export convention. */
const EXPORT_LABEL = {
  research: "Discovery",
  patterns: "Key Patterns",
  summary: "Strategy Summary",
  positioning: "Positioning Statement",
  differentiators: "Brand Differentiators",
};
const exportLabel = (id) => EXPORT_LABEL[id] || STEP_LABEL[id];

const DEPENDENCY_MAP = {
  opportunity: ["positioning"],
  positioning: ["differentiators", "attributes", "pillars", "philosophy", "voice", "persona", "creative", "summary"],
  differentiators: ["creative", "summary"],
  attributes: ["creative", "summary"],
  pillars: ["creative", "summary"],
  philosophy: ["creative", "summary"],
  voice: ["creative", "summary"],
  persona: ["creative", "summary"],
  creative: ["summary"],
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

const CREATIVE_CATEGORIES = [
  { id: "Typography", hint: "A typeface style, weight, or pairing. Plain words are fine." },
  { id: "Color", hint: "A palette direction: warm or cool, bright or muted, one dominant hue or many." },
  { id: "Imagery", hint: "Photography, illustration, iconography, and in what style." },
  { id: "Layout", hint: "Dense and information rich, or open and spacious?" },
  { id: "Materials & Touchpoints", hint: "Paper stock, packaging, signage, digital surfaces, whatever's relevant." },
  { id: "Motion & Interaction", hint: "Subtle and quiet, or expressive and playful? Skip if not relevant." },
];

const CRITIQUE_ROLES = [
  { id: "strategist", name: "Senior Design Strategist", focus: "evidence and reasoning", questions: [
    "Which research most influenced your positioning?",
    "What's the weakest link in your evidence?",
    "What would change your mind about this direction?",
  ] },
  { id: "creative", name: "Creative Director", focus: "distinctiveness and courage", questions: [
    "What makes this direction memorable?",
    "What did you reject, and was that the right call?",
    "Where did you play it safe?",
  ] },
  { id: "client", name: "Client", focus: "business value, in plain language", questions: [
    "How does this solve my problem?",
    "Why should I invest in this over something safer?",
    "How will I know it worked?",
  ] },
  { id: "marketing", name: "Marketing Director", focus: "reach and channel flexibility", questions: [
    "Does this work across every channel we actually use?",
    "How does it land for someone scrolling past it in three seconds?",
    "What happens to this system at small scale?",
  ] },
  { id: "professor", name: "Professor", focus: "growth and self awareness", questions: [
    "What assumptions did you challenge along the way?",
    "Where did your thinking change?",
    "What would you do differently starting over?",
  ] },
  { id: "ux", name: "UX Director", focus: "function over form", questions: [
    "Where does this actually have to work, not just look good?",
    "What happens when someone who isn't a designer has to use this?",
    "What breaks first under real conditions?",
  ] },
  { id: "brand", name: "Brand Manager", focus: "consistency and governance", questions: [
    "What happens when someone applies this system incorrectly?",
    "Where are the rules loose enough to get misused?",
    "What's the one rule that must never be broken?",
  ] },
];

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
    challenge: "",
    research: [],
    patterns: [],
    keyInsight: "",
    audience: "",
    opportunity: { text: "", patternIds: [], locked: false, reflection: null },
    positioning: { who: "", needs: "", alternatives: "", difference: "", after: "", audience: "", market: "", promise: "", rtb: "", locked: false, reflection: null },
    differentiators: [],
    attributes: [],
    pillars: [],
    philosophy: { what: "", how: "", why: "", locked: false },
    voice: { style: "", avoid: "", locked: false },
    persona: { description: "", howDescribed: "", notThis: "", locked: false },
    creative: [],
    execSummary: "",
    critique: {},
    flags: { positioning: false, differentiators: false, attributes: false, pillars: false, philosophy: false, voice: false, persona: false, creative: false, summary: false },
    reopenLog: [],
  });

  const [rippleTarget, setRippleTarget] = useState(null);
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

  const isUnlocked = (id) => {
    if (id === "entry") return true;
    if (!project.name) return false;
    return true;
  };

  const lockState = (id) => {
    if (id === "opportunity") return project.opportunity.locked;
    if (id === "positioning") return project.positioning.locked;
    if (id === "differentiators") return project.differentiators.length > 0;
    if (id === "attributes") return project.attributes.length > 0;
    if (id === "pillars") return project.pillars.length > 0;
    if (id === "philosophy") return project.philosophy.locked;
    if (id === "voice") return project.voice.locked;
    if (id === "persona") return project.persona.locked;
    if (id === "creative") return project.creative.length > 0;
    return null;
  };

  const saveProject = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project.name || "brand-strategy").replace(/\s+/g, "-").toLowerCase()}.json`;
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
        setStep("clientBrief");
      } catch {
        alert("That file doesn't look like a valid project file.");
      }
    };
    reader.readAsText(file);
  };

  const exportMarkdown = () => {
    const p = project;
    const lines = [
      `# ${p.name || "Untitled Brand Strategy"}`,
      "",
      `## ${exportLabel("summary")}`, p.execSummary || "Not yet written", "",
      `## Communication Problem`, p.challenge || "Not yet defined", "",
      `## ${exportLabel("research")}`, ...p.research.map((r) => `- ${r.text}`), "",
      `## ${exportLabel("patterns")}`, ...p.patterns.map((pt) => `- ${pt.note}`), "",
      `## Key Insight`, p.keyInsight || "Not yet defined", "",
      `## Audience`, p.audience || "Not yet defined", "",
      `## Opportunity`, p.opportunity.text || "Not yet locked", "",
      `## ${exportLabel("positioning")}`,
      p.positioning.locked
        ? `For **${p.positioning.audience}**, unlike ${p.positioning.market}, this brand ${p.positioning.promise}, because ${p.positioning.rtb}.`
        : "Not yet locked", "",
      `## ${exportLabel("differentiators")}`, ...p.differentiators.map((d) => `- ${d.text}`), "",
      `## Brand Attributes (This, Not That)`, ...p.attributes.map((a) => `- **${a.this}**, not ${a.not}`), "",
      `## Brand Pillars`, ...p.pillars.map((pl) => `- **${pl.name}**: ${pl.link}`), "",
      `## Brand Philosophy`,
      p.philosophy.what ? `**What:** ${p.philosophy.what}` : "",
      p.philosophy.how ? `**How:** ${p.philosophy.how}` : "",
      p.philosophy.why ? `**Why:** ${p.philosophy.why}` : "",
      "",
      `## Voice & Tone`, p.voice.style || "", p.voice.avoid ? `Never: ${p.voice.avoid}` : "", "",
      `## Brand Persona`, p.persona.description || "", p.persona.howDescribed ? `Others would describe them as: ${p.persona.howDescribed}` : "", p.persona.notThis ? `Would never: ${p.persona.notThis}` : "", "",
      `## Creative Direction`, ...p.creative.filter((c) => !c.skipped).map((c) => `- **${c.category}**: ${c.approach}`), "",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(p.name || "brand-strategy").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  const phases = [];
  STEPS.forEach((s) => { if (s.phase && !phases.includes(s.phase)) phases.push(s.phase); });

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
        <EntryScreen project={project} setProject={setProject} onStart={() => setStep("clientBrief")} onLoad={() => fileInputRef.current?.click()} />
      ) : (
        <div className="flex">
          <aside className="no-print w-64 shrink-0 h-screen sticky top-0 flex flex-col" style={{ background: T.paperRaised, borderRight: `1px solid ${T.line}` }}>
            <div className="px-6 pt-7 pb-5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="uppercase font-semibold mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.14em", color: T.inkSoft, fontFamily: "Instrument Sans" }}>Brand Strategy Builder</div>
              <div className="leading-[1.05] truncate" style={{ fontSize: "23px", fontFamily: "Instrument Serif", color: T.ink }}>{project.name || "Untitled project"}</div>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2">
              {phases.map((phase) => (
                <div key={phase} className="mb-3">
                  <div className="px-3 pt-3 pb-1.5 uppercase font-semibold" style={{ fontSize: "10px", letterSpacing: "0.14em", color: T.inkSoft, opacity: 0.7 }}>{phase}</div>
                  {STEPS.filter((s) => s.phase === phase).map((s) => {
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
                        style={{ fontSize: "13.5px", background: active ? T.signalSoft : "transparent", color: active ? T.signal : T.ink, fontFamily: "Instrument Sans", fontWeight: active ? 600 : 500 }}
                      >
                        <Icon size={15} />
                        <span className="flex-1">{s.label}</span>
                        {project.flags?.[s.id] && <AlertCircle size={13} style={{ color: T.rule }} />}
                        {ls === true && !project.flags?.[s.id] && <Check size={13} style={{ color: T.marigold }} />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="p-3 space-y-1" style={{ borderTop: `1px solid ${T.line}` }}>
              <button onClick={saveProject} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft }}>
                <Save size={14} /> Save project
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.inkSoft }}>
                <Upload size={14} /> Load project
              </button>
              {project.reopenLog.length > 0 && (
                <button onClick={() => setHistoryOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontSize: "13px", color: T.rule }}>
                  <RotateCcw size={14} /> Revision history ({project.reopenLog.length})
                </button>
              )}
              <input ref={fileInputRef} type="file" accept=".json" onChange={loadProject} className="hidden" />
            </div>
          </aside>

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
              {step === "clientBrief" && <ClientBriefStep project={project} setProject={setProject} onNext={() => setStep("challenge")} onOpen={openHandbook} />}
              {step === "challenge" && <ChallengeStep project={project} setProject={setProject} onNext={() => setStep("research")} onOpen={openHandbook} />}
              {step === "research" && <ResearchCapture project={project} setProject={setProject} onNext={() => setStep("patterns")} onOpen={openHandbook} />}
              {step === "patterns" && <PatternRecognition project={project} setProject={setProject} onNext={() => setStep("keyInsight")} onOpen={openHandbook} />}
              {step === "keyInsight" && <KeyInsightStep project={project} setProject={setProject} onNext={() => setStep("audience")} onOpen={openHandbook} />}
              {step === "audience" && <AudienceStep project={project} setProject={setProject} onNext={() => setStep("opportunity")} onOpen={openHandbook} />}
              {step === "opportunity" && <OpportunityStep project={project} setProject={setProject} onNext={() => setStep("positioning")} onOpen={openHandbook} onRequestReopen={requestReopen} />}
              {step === "positioning" && <PositioningStep project={project} setProject={setProject} onNext={() => setStep("differentiators")} onOpen={openHandbook} onRequestReopen={requestReopen} onResolveFlag={resolveFlag} />}
              {step === "differentiators" && <DifferentiatorsStep project={project} setProject={setProject} onNext={() => setStep("attributes")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "attributes" && <AttributesStep project={project} setProject={setProject} onNext={() => setStep("pillars")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "pillars" && <PillarsStep project={project} setProject={setProject} onNext={() => setStep("philosophy")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "philosophy" && <PhilosophyStep project={project} setProject={setProject} onNext={() => setStep("voice")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "voice" && <VoiceStep project={project} setProject={setProject} onNext={() => setStep("persona")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "persona" && <PersonaStep project={project} setProject={setProject} onNext={() => setStep("creative")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "creative" && <CreativeDirectionStep project={project} setProject={setProject} onNext={() => setStep("summary")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "summary" && <TellTheStoryStep project={project} setProject={setProject} onNext={() => setStep("critique")} onOpen={openHandbook} onResolveFlag={resolveFlag} />}
              {step === "critique" && <CritiquePrepStep project={project} setProject={setProject} onNext={() => setStep("finalReview")} />}
              {step === "finalReview" && <FinalReviewStep project={project} setStep={setStep} onNext={() => setStep("brandStrategy")} />}
              {step === "brandStrategy" && <BrandStrategyStep project={project} onExportMarkdown={exportMarkdown} onExportPDF={exportPDF} />}
            </main>
          </div>
        </div>
      )}

      <HandbookPanel termId={handbookTerm} onClose={() => setHandbookTerm(null)} onOpen={openHandbook} />
      {rippleTarget && (
        <RippleModal nodeId={rippleTarget} downstream={getDownstream(rippleTarget)} onConfirm={confirmReopen} onClose={() => setRippleTarget(null)} />
      )}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(36,28,56,0.55)" }}>
          <div className="w-full max-w-md rounded-xl p-7 overflow-y-auto" style={{ background: T.paperRaised, maxHeight: "80vh" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold tracking-wide uppercase" style={{ fontSize: "12px", color: T.signal }}>Revision history</span>
              <button onClick={() => setHistoryOpen(false)}><X size={18} style={{ color: T.inkSoft }} /></button>
            </div>
            <p className="mb-5" style={{ fontSize: "13.5px", color: T.inkSoft }}>Evidence of rigor, not a flaw.</p>
            <div className="space-y-3">
              {project.reopenLog.slice().reverse().map((entry, i) => (
                <div key={i} className="rounded-lg px-4 py-3" style={{ background: T.lavender, borderLeft: `3px solid ${T.rule}` }}>
                  <div className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>Reopened: {STEP_LABEL[entry.node]}</div>
                  <div className="mt-1 uppercase tracking-wide" style={{ fontSize: "12px", color: T.inkSoft, fontFamily: "Instrument Sans", fontWeight: 500 }}>{new Date(entry.at).toLocaleString()}</div>
                  {entry.downstream.length > 0 && (
                    <div className="mt-1.5" style={{ fontSize: "12.5px", color: T.signal, fontFamily: "Instrument Sans", fontWeight: 500 }}>Flagged: {entry.downstream.map((d) => STEP_LABEL[d]).join(", ")}</div>
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
   ENTRY
   ============================================================ */
function EntryScreen({ project, setProject, onStart, onLoad }) {
  return (
    <div className="min-h-screen px-6" style={{ background: T.paper }}>
      <div className="w-full max-w-2xl mx-auto pt-20 pb-24">
        <div className="text-center mb-16">
          <div className="uppercase font-semibold mb-8" style={{ fontSize: "10.5px", letterSpacing: "0.16em", color: T.inkSoft }}>Brand Strategy Builder</div>
          <h1 className="mb-7" style={{ lineHeight: "0.92", fontFamily: "Instrument Serif", letterSpacing: "-0.03em", color: T.ink, fontSize: "clamp(64px, 11vw, 132px)" }}>
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
            <input value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} placeholder="e.g. Amaranth Bakery"
              className="w-full rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
          </div>
          <button onClick={onStart} disabled={!project.name.trim()}
            className="w-full py-4 rounded-md font-bold disabled:opacity-30 mt-3"
            style={{ fontSize: "15.5px", letterSpacing: "-0.005em", background: T.ink, color: "#fff" }}>
            Start building
          </button>
          <button onClick={onLoad} className="w-full py-1 mt-1" style={{ fontSize: "12.5px", color: T.inkSoft }}>
            or load a project file
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CLIENT BRIEF
   ============================================================ */
function ClientBriefStep({ project, setProject, onNext, onOpen }) {
  return (
    <div>
      <SectionHeader
        eyebrow="01"
        title="Client Brief"
        blurb="Every project begins with understanding the assignment. Before you decide how something should look, make sure you understand what you've actually been asked to create. Great strategy begins with listening before making decisions."
        note="The better you understand the brief, the better your decisions become."
      />
      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>Summarize the brief in your own words.</div>
      <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>Focus on the client's goal, not simply what they asked you to make.</p>
      <textarea
        value={project.client}
        onChange={(e) => setProject({ ...project, client: e.target.value })}
        rows={5}
        placeholder="What is the client actually trying to accomplish?"
        className="w-full rounded-md px-4 py-3 outline-none resize-none"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
        autoFocus
      />
      <NextButton onClick={onNext} disabled={!project.client.trim()} />
    </div>
  );
}

/* ============================================================
   COMMUNICATION PROBLEM
   ============================================================ */
function ChallengeStep({ project, setProject, onNext, onOpen }) {
  return (
    <div>
      <SectionHeader
        eyebrow="02"
        title="Communication Problem"
        blurb="Every design project is trying to change something. Clients often tell you what they want to make, but not the problem they're trying to solve. Your job is to identify the communication problem behind the request."
        note="Design solves problems, not requests."
      />
      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>What communication problem does this project need to solve?</div>
      <textarea
        value={project.challenge}
        onChange={(e) => setProject({ ...project, challenge: e.target.value })}
        rows={4}
        placeholder="Not what they asked for. What's actually broken, unclear, or missing."
        className="w-full rounded-md px-4 py-3 outline-none resize-none"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
        autoFocus
      />
      <NextButton onClick={onNext} disabled={!project.challenge.trim()} />
    </div>
  );
}

/* ============================================================
   RESEARCH
   ============================================================ */
function ResearchCapture({ project, setProject, onNext, onOpen }) {
  const [draft, setDraft] = useState({ text: "", tag: "audience" });
  const tags = [
    { id: "audience", label: "Audience" },
    { id: "competitor", label: "Competitor" },
    { id: "context", label: "Context" },
  ];

  const add = () => {
    if (!draft.text.trim()) return;
    setProject({ ...project, research: [...project.research, { id: crypto.randomUUID(), text: draft.text, tag: draft.tag }] });
    setDraft({ text: "", tag: draft.tag });
  };

  return (
    <div>
      <SectionHeader
        eyebrow="03"
        title="Research"
        blurb="Good strategy begins with curiosity. Before you start solving problems, spend time understanding them. Research helps you replace assumptions with evidence and gives your creative decisions something solid to stand on."
        note="Strong research produces observations, not opinions."
      />
      <p className="mb-4" style={{ fontSize: "13px", color: T.inkSoft }}>Don't stop at the brief. Study competitors, customers, reviews, trends, and culture. This work informs the strategy and will not appear in the final document.</p>

      <div className="rounded-xl p-5 mb-6" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
        <div className="flex gap-2 mb-3">
          {tags.map((t) => (
            <button key={t.id} onClick={() => setDraft({ ...draft, tag: t.id })}
              className="px-3 py-1.5 rounded-full" style={{ fontSize: "12.5px", background: draft.tag === t.id ? T.ink : T.paper, color: draft.tag === t.id ? "#fff" : T.inkSoft }}>
              {t.label}
            </button>
          ))}
        </div>
        <textarea value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} rows={2}
          placeholder="What have you noticed?"
          className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none mb-3" style={{ fontSize: "14.5px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
        <button onClick={add} disabled={!draft.text.trim()} className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md font-medium disabled:opacity-30" style={{ fontSize: "13px", background: T.ink, color: "#fff" }}>
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {project.research.map((r) => (
          <div key={r.id} className="rounded-lg p-3.5 flex items-start gap-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
            <Chip>{r.tag}</Chip>
            <div className="flex-1" style={{ fontSize: "14px", color: T.ink }}>{r.text}</div>
          </div>
        ))}
      </div>
      {project.research.length === 0 && (
        <div className="text-center py-10 italic" style={{ fontSize: "17px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>Nothing here yet.</div>
      )}

      <NextButton onClick={onNext} />
    </div>
  );
}

/* ============================================================
   PATTERNS
   ============================================================ */
function PatternRecognition({ project, setProject, onNext, onOpen }) {
  const [note, setNote] = useState("");

  const add = () => {
    if (!note.trim()) return;
    setProject({ ...project, patterns: [...project.patterns, { id: crypto.randomUUID(), note }] });
    setNote("");
  };

  return (
    <div>
      <SectionHeader
        eyebrow="04"
        title="Patterns"
        blurb="Research becomes strategy when you recognize what repeats. Individual observations are interesting, but patterns reveal what actually matters. As you review your research, look for themes, behaviors, tensions, or opportunities that appear more than once."
        note="A pattern is an interpretation, not a summary."
      />
      <p className="mb-4" style={{ fontSize: "13px", color: T.inkSoft }}>Don't list everything you found. Identify the ideas that consistently surfaced and deserve your attention.</p>

      {project.research.length > 0 && (
        <div className="rounded-lg px-4 py-3 mb-7" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          <div className="uppercase font-semibold mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>Your research</div>
          <ul className="space-y-1">
            {project.research.map((r) => <li key={r.id} style={{ fontSize: "13.5px", color: T.ink }}>{r.text}</li>)}
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

      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>What pattern do you see?</div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="What do a few of these suggest, together?"
        className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <button onClick={add} disabled={!note.trim()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
        <Plus size={14} /> Add pattern
      </button>

      <div className="mt-2"><NextButton onClick={onNext} /></div>
    </div>
  );
}

/* ============================================================
   KEY INSIGHT
   ============================================================ */
function KeyInsightStep({ project, setProject, onNext, onOpen }) {
  return (
    <div>
      <SectionHeader
        eyebrow="05"
        title="Key Insight"
        blurb="Every strong strategy is built on one clear insight. Research gives you information. An insight gives that information meaning. It's the discovery that changes how you think about the project and becomes the foundation for the decisions that follow."
        note="A good insight gives the project direction."
      />
      <p className="mb-4" style={{ fontSize: "13px", color: T.inkSoft }}>Review everything you've learned. If this insight changed, your strategy would likely change too.</p>

      {project.patterns.length > 0 && (
        <div className="rounded-lg px-4 py-3 mb-7" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          <div className="uppercase font-semibold mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>Your patterns</div>
          <ul className="space-y-1">
            {project.patterns.map((p) => <li key={p.id} className="italic" style={{ fontSize: "13.5px", color: T.ink, fontFamily: "Instrument Serif" }}>{p.note}</li>)}
          </ul>
        </div>
      )}

      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>
        What's the most important thing you've learned?
      </div>
      <textarea
        value={project.keyInsight}
        onChange={(e) => setProject({ ...project, keyInsight: e.target.value })}
        rows={3}
        placeholder="The discovery that changes the direction, not a summary of your research."
        className="w-full rounded-md px-4 py-3 outline-none resize-none"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
        autoFocus
      />
      <NextButton onClick={onNext} disabled={!project.keyInsight.trim()} />
    </div>
  );
}

/* ============================================================
   AUDIENCE
   ============================================================ */
function AudienceStep({ project, setProject, onNext, onOpen }) {
  return (
    <div>
      <SectionHeader
        eyebrow="06"
        title="Audience"
        blurb="Great brands are built for specific people. Research helps you understand the world. Defining your audience helps you decide who matters most. The more clearly you understand the people you're designing for, the more focused your strategy becomes."
        note="When you try to speak to everyone, you usually connect with no one."
      />
      <p className="mb-4" style={{ fontSize: "13px", color: T.inkSoft }}>Think beyond demographics. Consider their goals, motivations, needs, and behaviors.</p>

      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>Who is this brand trying to reach?</div>
      <textarea
        value={project.audience}
        onChange={(e) => setProject({ ...project, audience: e.target.value })}
        rows={4}
        placeholder="Describe the audience this brand should serve."
        className="w-full rounded-md px-4 py-3 outline-none resize-none"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
        autoFocus
      />
      <NextButton onClick={onNext} disabled={!project.audience.trim()} />
    </div>
  );
}

/* ============================================================
   OPPORTUNITY
   ============================================================ */
function OpportunityStep({ project, setProject, onNext, onOpen, onRequestReopen }) {
  const [showReflection, setShowReflection] = useState(false);
  const o = project.opportunity;

  const togglePattern = (id) => {
    const has = o.patternIds.includes(id);
    setProject({ ...project, opportunity: { ...o, patternIds: has ? o.patternIds.filter((x) => x !== id) : [...o.patternIds, id] } });
  };

  const doLock = (answers) => {
    setProject({ ...project, opportunity: { ...o, locked: true, reflection: answers } });
    setShowReflection(false);
    onNext();
  };

  return (
    <div>
      <SectionHeader
        eyebrow="07, first lock"
        title="Opportunity"
        blurb="Not every problem is worth solving. Strong strategies focus on one opportunity instead of trying to solve everything at once. Your research should help you recognize where this brand can create the greatest value or make the biggest difference."
        note="The best opportunities come from understanding what others have overlooked."
      />

      <div className="mb-4">
        <div className="uppercase font-semibold mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>Link supporting patterns</div>
        <div className="flex flex-wrap gap-2">
          {project.patterns.map((p) => (
            <button key={p.id} disabled={o.locked} onClick={() => togglePattern(p.id)}
              className="px-3 py-1.5 rounded-full transition disabled:opacity-60"
              style={{ fontSize: "12.5px", background: o.patternIds.includes(p.id) ? T.ink : T.paperRaised, color: o.patternIds.includes(p.id) ? "#fff" : T.ink, border: `1px solid ${T.line}` }}>
              {p.note.slice(0, 40)}{p.note.length > 40 ? "..." : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>Where is the opportunity?</div>
      <textarea value={o.text} disabled={o.locked} onChange={(e) => setProject({ ...project, opportunity: { ...o, text: e.target.value } })}
        rows={3} placeholder="Based on your research and insight, describe the opportunity this brand should pursue."
        className="w-full rounded-md px-4 py-3 outline-none resize-none disabled:opacity-70"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />

      {o.locked ? (
        <div className="mt-6 rounded-lg px-4 py-3 flex items-center gap-2" style={{ background: T.marigoldSoft }}>
          <Lock size={15} style={{ color: T.ink }} />
          <span className="italic" style={{ fontSize: "13.5px", color: T.ink, fontFamily: "Instrument Serif" }}>Locked. Reopen any time.</span>
        </div>
      ) : (
        <button onClick={() => setShowReflection(true)} disabled={!o.text.trim()}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-semibold disabled:opacity-30"
          style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
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
          prompts={["What evidence gave you confidence in this decision?", "What's one alternative opportunity you considered and rejected, and why?"]}
          onSubmit={doLock}
          onClose={() => setShowReflection(false)}
        />
      )}

      <NextButton onClick={onNext}>{o.locked ? "Continue" : "Continue, I'll come back to this"}</NextButton>
    </div>
  );
}

/* ============================================================
   POSITIONING
   ============================================================ */
const POSITIONING_MICRO_STEPS = [
  { key: "who", field: "audience", q: "Who is this most clearly for?", ph: "Not everyone. The specific person or group this has to work for." },
  { key: "needs", field: null, q: "What do they need, want, or value?", ph: "What actually matters to this person in this situation?" },
  { key: "alternatives", field: "market", q: "What alternatives are they currently choosing from?", ph: "What do they do instead, today, without this?" },
  { key: "difference", field: "rtb", q: "What makes this meaningfully different?", ph: "Different in a way that actually matters to them." },
  { key: "after", field: "promise", q: "What should the audience believe, feel, or understand after encountering the design?", ph: "The one thing you want to land." },
];

function PositioningStep({ project, setProject, onNext, onOpen, onRequestReopen, onResolveFlag }) {
  const p = project.positioning;
  const startStage = p.audience && p.market && p.promise && p.rtb ? "template" : (p.after || "").trim() ? "template" : 0;
  const [stage, setStage] = useState(startStage);
  const [draft, setDraft] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const set = (field) => (e) => setProject({ ...project, positioning: { ...p, [field]: e.target.value } });
  const filled = p.audience && p.market && p.promise && p.rtb;

  const submitMicro = (step) => {
    if (!draft.trim()) return;
    const updated = { ...project.positioning, [step.key]: draft, ...(step.field ? { [step.field]: draft } : {}) };
    setProject({ ...project, positioning: updated });
    setDraft("");
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
      <SectionHeader
        eyebrow="08, the spine"
        title="Positioning"
        blurb="Positioning defines where the brand belongs. A positioning statement helps explain who the brand is for, what makes it different, and why it matters. It becomes the foundation for every creative decision that follows."
        note="Positioning gives every design decision a purpose."
      />

      {typeof stage === "number" && (
        <>
          <div className="mb-2" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>{POSITIONING_MICRO_STEPS[stage].q}</div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder={POSITIONING_MICRO_STEPS[stage].ph}
            className="w-full rounded-md px-4 py-3 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} autoFocus />
          <button onClick={() => submitMicro(POSITIONING_MICRO_STEPS[stage])} disabled={!draft.trim()}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: "#fff" }}>
            Continue <ArrowRight size={15} />
          </button>
        </>
      )}

      {stage === "template" && (
        <>
          <div className="mb-4 font-medium" style={{ fontSize: "20px", color: T.ink, fontFamily: "Instrument Serif" }}>Assemble it into one sentence.</div>
          <div className="rounded-xl p-6 space-y-4" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
            {[["audience", "For (audience)"], ["market", "unlike (competitive alternative)"], ["promise", "this brand (promise)"], ["rtb", "because (reason to believe)"]].map(([field, label]) => (
              <div key={field}>
                <label className="block font-medium mb-1" style={{ fontSize: "12.5px", color: T.inkSoft }}>{label}</label>
                <input value={p[field]} disabled={p.locked} onChange={set(field)}
                  className="w-full rounded-md px-3.5 py-2 outline-none disabled:opacity-70" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg px-4 py-3" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
            <p style={{ fontSize: "13.5px", color: T.inkSoft }}>
              Swap test: could a competitor say this exact sentence? If yes, it isn't specific enough yet.
            </p>
          </div>

          {p.locked ? (
            <div className="mt-6 rounded-lg px-5 py-4" style={{ background: T.marigold, borderLeft: `4px solid ${T.rule}` }}>
              <Pin size={14} style={{ color: T.ink, display: "inline", marginRight: 8 }} />
              <span className="italic" style={{ fontSize: "19px", fontFamily: "Instrument Serif", color: T.ink }}>
                For {p.audience}, unlike {p.market}, this brand {p.promise}, because {p.rtb}.
              </span>
            </div>
          ) : (
            <button onClick={() => setShowReflection(true)} disabled={!filled}
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium disabled:opacity-30" style={{ fontSize: "14px", background: T.ink, color: T.paperRaised }}>
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
          <NextButton onClick={onNext}>{p.locked ? "Continue" : "Continue, I'll come back to this"}</NextButton>
        </>
      )}
    </div>
  );
}

/* ============================================================
   DIFFERENTIATORS
   ============================================================ */
function DifferentiatorsStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    setProject({ ...project, differentiators: [...project.differentiators, { id: crypto.randomUUID(), text: draft }] });
    setDraft("");
  };
  const remove = (id) => setProject({ ...project, differentiators: project.differentiators.filter((d) => d.id !== id) });

  return (
    <div>
      {project.flags?.differentiators && <FlagBanner onResolve={() => onResolveFlag("differentiators")} />}
      <SectionHeader
        eyebrow="09"
        title="Differentiators"
        blurb="People choose brands for a reason. A strong brand stands for something people value. Differentiators help explain why someone would choose this brand over another. They are not features or buzzwords. They are meaningful reasons to believe."
        note="People choose brands for a reason. Make yours clear."
      />

      <div className="rounded-lg px-4 py-3 mb-5" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
        <p className="italic" style={{ fontSize: "14.5px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>For {project.positioning.audience}, unlike {project.positioning.market}, this brand {project.positioning.promise}, because {project.positioning.rtb}.</p>
      </div>

      <div className="space-y-2 mb-4">
        {project.differentiators.map((d) => (
          <div key={d.id} className="flex items-center gap-2">
            <div className="flex-1 rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}`, fontSize: "15px", color: T.ink }}>{d.text}</div>
            <button onClick={() => remove(d.id)} style={{ color: T.inkSoft }}><X size={16} /></button>
          </div>
        ))}
      </div>

      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>Why would someone choose this instead of a competitor?</div>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="A feature, approach, or capability the alternatives don't have."
        className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <button onClick={add} disabled={!draft.trim()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
        <Plus size={14} /> Add
      </button>

      <div><NextButton onClick={onNext} disabled={project.differentiators.length === 0} /></div>
    </div>
  );
}

/* ============================================================
   BRAND ATTRIBUTES
   ============================================================ */
function AttributesStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const [thisDraft, setThisDraft] = useState("");
  const [notDraft, setNotDraft] = useState("");
  const add = () => {
    if (!thisDraft.trim() || !notDraft.trim()) return;
    setProject({ ...project, attributes: [...project.attributes, { id: crypto.randomUUID(), this: thisDraft, not: notDraft }] });
    setThisDraft(""); setNotDraft("");
  };
  const remove = (id) => setProject({ ...project, attributes: project.attributes.filter((a) => a.id !== id) });

  return (
    <div>
      {project.flags?.attributes && <FlagBanner onResolve={() => onResolveFlag("attributes")} />}
      <SectionHeader
        eyebrow="10"
        title="Brand Attributes"
        blurb="Every brand creates an impression. Brand attributes describe the qualities people should consistently experience whenever they interact with the brand. They influence visual identity, messaging, photography, illustration, motion, and every other creative decision."
        note="People should recognize these qualities before they recognize the logo."
      />

      <div className="space-y-2 mb-5">
        {project.attributes.map((a) => (
          <div key={a.id} className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
            <span className="italic flex-1" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{a.this}</span>
            <span style={{ fontSize: "12px", color: T.inkSoft }}>not</span>
            <span className="italic flex-1" style={{ fontSize: "15px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>{a.not}</span>
            <button onClick={() => remove(a.id)} style={{ color: T.inkSoft }}><X size={16} /></button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-medium mb-1.5" style={{ fontSize: "12.5px", color: T.inkSoft }}>This</label>
          <input value={thisDraft} onChange={(e) => setThisDraft(e.target.value)} placeholder="e.g., unhurried" className="w-full rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
        </div>
        <div>
          <label className="block font-medium mb-1.5" style={{ fontSize: "12.5px", color: T.inkSoft }}>Not that</label>
          <input value={notDraft} onChange={(e) => setNotDraft(e.target.value)} placeholder="e.g., slow" className="w-full rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
        </div>
      </div>
      <p className="mt-2" style={{ fontSize: "12.5px", color: T.inkSoft }}>The "not" should be a real, plausible alternative a competitor could choose, not a strawman.</p>
      <button onClick={add} disabled={!thisDraft.trim() || !notDraft.trim()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
        <Plus size={14} /> Add pair
      </button>

      <div><NextButton onClick={onNext} disabled={project.attributes.length === 0} /></div>
    </div>
  );
}

/* ============================================================
   BRAND PILLARS
   ============================================================ */
function PillarsStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const p = project.positioning;
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const add = () => {
    if (!name.trim() || !link.trim()) return;
    setProject({ ...project, pillars: [...project.pillars, { id: crypto.randomUUID(), name, link, locked: true }] });
    setName(""); setLink("");
  };
  const remove = (id) => setProject({ ...project, pillars: project.pillars.filter((pl) => pl.id !== id) });

  return (
    <div>
      {project.flags?.pillars && <FlagBanner onResolve={() => onResolveFlag("pillars")} />}
      <SectionHeader
        eyebrow="11"
        title="Brand Pillars"
        blurb="Strong brands are built on consistent principles. Brand pillars represent the ideas the brand should continually reinforce through its actions, messaging, and experiences. They help teams make better decisions long after this project is complete."
        note="When you're unsure what to do, your pillars should point the way."
      />

      <div className="rounded-lg px-4 py-3 mb-5" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
        <p className="italic" style={{ fontSize: "14.5px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>For {p.audience}, unlike {p.market}, this brand {p.promise}, because {p.rtb}.</p>
      </div>

      <div className="space-y-3 mb-4">
        {project.pillars.map((pl) => (
          <div key={pl.id} className="rounded-lg px-4 py-3 flex items-start justify-between" style={{ background: T.marigoldSoft, border: `1px solid ${T.line}` }}>
            <div>
              <div className="italic" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>{pl.name}</div>
              <div style={{ fontSize: "13px", color: T.inkSoft }}>{pl.link}</div>
            </div>
            <button onClick={() => remove(pl.id)} style={{ color: T.inkSoft }}><X size={16} /></button>
          </div>
        ))}
      </div>

      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>What should this brand always stand for?</div>
      <label className="block font-medium mb-1.5 mt-3" style={{ fontSize: "12.5px", color: T.inkSoft }}>Pillar name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="A short, ownable name." className="w-full rounded-md px-3.5 py-2.5 outline-none mb-3" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <label className="block font-medium mb-1.5" style={{ fontSize: "12.5px", color: T.inkSoft }}>Which part of your positioning does this come from?</label>
      <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full rounded-md px-3.5 py-2.5 outline-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <button onClick={add} disabled={!name.trim() || !link.trim()} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
        <Plus size={14} /> Add pillar
      </button>

      <div><NextButton onClick={onNext} disabled={project.pillars.length === 0} /></div>
    </div>
  );
}

/* ============================================================
   BRAND PHILOSOPHY
   ============================================================ */
function PhilosophyStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const ph = project.philosophy;
  const set = (field) => (e) => setProject({ ...project, philosophy: { ...ph, [field]: e.target.value } });
  const confirm = () => { setProject({ ...project, philosophy: { ...ph, locked: true } }); onNext(); };

  return (
    <div>
      {project.flags?.philosophy && <FlagBanner onResolve={() => onResolveFlag("philosophy")} />}
      <SectionHeader
        eyebrow="12"
        title="Brand Philosophy"
        blurb="Strong brands know what they stand for. A brand philosophy explains what the brand does, how it does it differently, and why that matters. It gives people inside and outside the organization a shared understanding of the brand's purpose."
        note="A strong philosophy helps people understand what the brand stands for."
      />
      <p className="mb-5" style={{ fontSize: "13px", color: T.inkSoft }}>Answer each question honestly. Someone unfamiliar with the brand should quickly understand what makes it meaningful.</p>
      <div className="space-y-5">
        {[["what", "What do you do?"], ["how", "How do you do it differently?"], ["why", "Why does it matter?"]].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium mb-1.5" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>{label}</label>
            <textarea value={ph[field]} onChange={set(field)} rows={2}
              className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
          </div>
        ))}
      </div>
      <NextButton onClick={confirm} disabled={!ph.what.trim() || !ph.how.trim() || !ph.why.trim()} />
    </div>
  );
}

/* ============================================================
   VOICE & TONE
   ============================================================ */
function VoiceStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const v = project.voice;
  const confirm = () => { setProject({ ...project, voice: { ...v, locked: true } }); onNext(); };

  return (
    <div>
      {project.flags?.voice && <FlagBanner onResolve={() => onResolveFlag("voice")} />}
      <SectionHeader
        eyebrow="13"
        title="Voice & Tone"
        blurb="Every brand has a voice. A consistent voice helps people recognize the brand wherever they encounter it. Whether someone reads a website, social media post, email, or advertisement, it should always sound like the same brand."
        note="If someone read it out loud, would they recognize the brand?"
      />
      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>If this brand spoke, how would it sound?</div>
      <p className="mb-3" style={{ fontSize: "13px", color: T.inkSoft }}>Focus on personality, not specific phrases or marketing language.</p>
      <label className="block uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>How it sounds</label>
      <textarea value={v.style} onChange={(e) => setProject({ ...project, voice: { ...v, style: e.target.value } })} rows={2}
        placeholder="Casual or formal? Playful or serious?" className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none mb-4" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <label className="block uppercase font-semibold mb-1.5" style={{ fontSize: "10.5px", letterSpacing: "0.08em", color: T.inkSoft }}>Would never sound like</label>
      <textarea value={v.avoid} onChange={(e) => setProject({ ...project, voice: { ...v, avoid: e.target.value } })} rows={2}
        placeholder="Words, phrases, or tones that are off limits." className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <NextButton onClick={confirm} disabled={!v.style.trim()} />
    </div>
  );
}

/* ============================================================
   BRAND PERSONA
   ============================================================ */
function PersonaStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const per = project.persona;
  const confirm = () => { setProject({ ...project, persona: { ...per, locked: true } }); onNext(); };

  return (
    <div>
      {project.flags?.persona && <FlagBanner onResolve={() => onResolveFlag("persona")} />}
      <SectionHeader
        eyebrow="14"
        title="Brand Persona"
        blurb="People connect with people. Imagining the brand as a person creates consistency across design, writing, and customer experience. A clear personality helps everyone working on the brand make decisions that feel authentic."
        note="Designing for a personality is easier than designing for a demographic."
      />
      <p className="mb-5" style={{ fontSize: "13px", color: T.inkSoft }}>Picture this brand walking into a room. Describe the person you see.</p>
      <label className="block font-medium mb-1.5" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>Who would it be?</label>
      <textarea value={per.description} onChange={(e) => setProject({ ...project, persona: { ...per, description: e.target.value } })} rows={3}
        placeholder="Describe them like a character. How they act, what they care about." className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none mb-4" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <label className="block font-medium mb-1.5" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>How would people describe them?</label>
      <textarea value={per.howDescribed} onChange={(e) => setProject({ ...project, persona: { ...per, howDescribed: e.target.value } })} rows={2}
        className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none mb-4" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <label className="block font-medium mb-1.5" style={{ fontSize: "16px", color: T.ink, fontFamily: "Instrument Serif" }}>What would they never do?</label>
      <textarea value={per.notThis} onChange={(e) => setProject({ ...project, persona: { ...per, notThis: e.target.value } })} rows={2}
        className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
      <NextButton onClick={confirm} disabled={!per.description.trim()} />
    </div>
  );
}

/* ============================================================
   CREATIVE DIRECTION
   ============================================================ */
function CreativeDirectionStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  const doneCategories = new Set(project.creative.map((c) => c.category));
  const catIndex = CREATIVE_CATEGORIES.findIndex((c) => !doneCategories.has(c.id));
  const allDone = catIndex === -1;
  const cat = allDone ? null : CREATIVE_CATEGORIES[catIndex];

  const [feel, setFeel] = useState("");
  const [approach, setApproach] = useState("");

  const save = (mode) => {
    setProject({
      ...project,
      creative: [...project.creative, { id: crypto.randomUUID(), category: cat.id, feel, approach, justification: feel, locked: mode === "lock", exploring: mode === "explore", skipped: false }],
    });
    setFeel(""); setApproach("");
  };

  const skip = () => {
    setProject({ ...project, creative: [...project.creative, { id: crypto.randomUUID(), category: cat.id, feel: "", approach: "", justification: "", locked: false, exploring: false, skipped: true }] });
    setFeel(""); setApproach("");
  };

  return (
    <div>
      {project.flags?.creative && <FlagBanner onResolve={() => onResolveFlag("creative")} />}
      <SectionHeader
        eyebrow="15"
        title="Creative Direction"
        blurb="Creative direction translates strategy into design. Before choosing colors, typography, imagery, or logos, define the feeling you want people to experience. A clear creative direction ensures every visual decision reinforces the strategy instead of distracting from it."
        note="Creative direction should express the strategy, not decorate it."
      />

      {project.creative.length > 0 && (
        <div className="space-y-2 mb-7">
          {project.creative.map((c) => (
            <div key={c.id} className="rounded-lg px-4 py-3" style={{ background: c.locked ? T.marigoldSoft : T.paperRaised, border: `1px solid ${T.line}` }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold" style={{ fontSize: "12px", color: T.inkSoft }}>{c.category}</span>
                {c.locked && <Lock size={12} style={{ color: T.ink }} />}
                {c.exploring && <span className="italic" style={{ fontSize: "11.5px", color: T.signal }}>exploring</span>}
                {c.skipped && <span className="italic" style={{ fontSize: "11.5px", color: T.inkSoft }}>skipped</span>}
              </div>
              {!c.skipped && <div className="italic" style={{ fontSize: "15px", color: T.ink, fontFamily: "Instrument Serif" }}>{c.approach}</div>}
            </div>
          ))}
        </div>
      )}

      {!allDone && (
        <div className="rounded-xl p-6" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
          <div className="uppercase font-semibold mb-4" style={{ fontSize: "10.5px", letterSpacing: "0.1em", color: T.inkSoft }}>{cat.id}</div>

          <label className="block font-medium mb-1.5" style={{ fontSize: "13px", color: T.inkSoft }}>Feeling</label>
          <textarea value={feel} onChange={(e) => setFeel(e.target.value)} rows={2} placeholder="e.g., trustworthy, unhurried, urgent"
            className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none mb-4" style={{ fontSize: "15px", background: T.paper, border: `1px solid ${T.line}` }} />

          <label className="block font-medium mb-1.5" style={{ fontSize: "13px", color: T.inkSoft }}>Approach</label>
          <textarea value={approach} onChange={(e) => setApproach(e.target.value)} rows={2} placeholder={cat.hint}
            className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "15px", background: T.paper, border: `1px solid ${T.line}` }} />

          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => save("lock")} disabled={!feel.trim() || !approach.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold disabled:opacity-30" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
              <Lock size={13} /> Lock this direction
            </button>
            <button onClick={() => save("explore")} disabled={!feel.trim()} className="px-4 py-2 rounded-md font-medium disabled:opacity-30" style={{ fontSize: "13.5px", background: T.lavender, color: T.signal }}>
              Mark as exploring
            </button>
            <button onClick={skip} style={{ fontSize: "12.5px", color: T.inkSoft }}>Skip</button>
          </div>
        </div>
      )}

      <NextButton onClick={onNext} disabled={project.creative.length === 0} />
    </div>
  );
}

/* ============================================================
   TELL THE STORY  (workbook label; exports as "Strategy Summary")
   ============================================================ */
function TellTheStoryStep({ project, setProject, onNext, onOpen, onResolveFlag }) {
  return (
    <div>
      {project.flags?.summary && <FlagBanner onResolve={() => onResolveFlag("summary")} />}
      <SectionHeader
        eyebrow="16"
        title="Tell the Story"
        blurb="Every strategy should tell one clear story. By now you've defined the communication problem, uncovered key insights, identified an opportunity, and built a strategic direction. The final step is connecting those ideas into a narrative someone else can quickly understand."
        note="If you can't explain the strategy clearly, it probably isn't clear yet."
      />
      <div className="mb-1.5" style={{ fontSize: "16.5px", color: T.ink, fontFamily: "Instrument Serif", fontStyle: "italic" }}>What's the story of your strategy?</div>
      <textarea
        value={project.execSummary}
        onChange={(e) => setProject({ ...project, execSummary: e.target.value })}
        rows={8}
        placeholder="Write one clear paragraph that explains how your strategy developed and why it leads to the creative direction you've recommended."
        className="w-full rounded-md px-4 py-3 outline-none resize-none leading-relaxed"
        style={{ fontSize: "15px", background: T.paperRaised, border: `1px solid ${T.line}` }}
      />
      <NextButton onClick={onNext} disabled={!project.execSummary.trim()}>Continue to Critique Prep</NextButton>
    </div>
  );
}

/* ============================================================
   CRITIQUE PREP
   ============================================================ */
function CritiquePrepStep({ project, setProject, onNext }) {
  const [role, setRole] = useState(null);
  const active = CRITIQUE_ROLES.find((r) => r.id === role);
  const answers = project.critique[role] || ["", "", ""];

  const setAnswer = (i, val) => {
    const next = [...answers];
    next[i] = val;
    setProject({ ...project, critique: { ...project.critique, [role]: next } });
  };

  if (!role) {
    return (
      <div>
        <SectionHeader
          eyebrow="17"
          title="Critique Prep"
          blurb="Great designers don't just present solutions. They explain their thinking. Every design decision should connect back to the strategy you've developed. Preparing for critique isn't about defending your work. It's about clearly communicating the reasoning behind your decisions."
          note="Confidence comes from preparation."
        />
        <p className="mb-6" style={{ fontSize: "13px", color: T.inkSoft }}>Choose a reviewer and write your answers before you defend this in a real critique.</p>
        <div className="grid grid-cols-2 gap-3">
          {CRITIQUE_ROLES.map((r) => (
            <button key={r.id} onClick={() => setRole(r.id)} className="text-left rounded-xl p-4" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
              <div className="mb-1" style={{ fontSize: "15px", fontFamily: "Instrument Serif", color: T.ink }}>{r.name}</div>
              <div style={{ fontSize: "12.5px", color: T.inkSoft }}>Probes {r.focus}</div>
            </button>
          ))}
        </div>
        <NextButton onClick={onNext}>Continue to Final Review</NextButton>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader eyebrow={`Reviewing as ${active.name}`} title="Answer as if defending this live." blurb={`Probing ${active.focus}. Write short, direct answers, the way you'd say them out loud.`} />
      <div className="space-y-6">
        {active.questions.map((q, i) => (
          <div key={i}>
            <div className="mb-2 italic" style={{ fontSize: "17px", color: T.ink, fontFamily: "Instrument Serif" }}>{q}</div>
            <textarea value={answers[i]} onChange={(e) => setAnswer(i, e.target.value)} rows={2}
              className="w-full rounded-md px-3.5 py-2.5 outline-none resize-none" style={{ fontSize: "14.5px", background: T.paperRaised, border: `1px solid ${T.line}` }} />
          </div>
        ))}
      </div>
      <button onClick={() => setRole(null)} className="mt-6" style={{ fontSize: "13px", color: T.inkSoft }}>Choose a different reviewer</button>
      <div><NextButton onClick={onNext}>Continue to Final Review</NextButton></div>
    </div>
  );
}

/* ============================================================
   FINAL REVIEW
   ============================================================ */
function FinalReviewStep({ project, setStep, onNext }) {
  const rows = [
    { id: "challenge", label: "Communication Problem", done: !!project.challenge.trim() },
    { id: "research", label: "Research", done: project.research.length > 0 },
    { id: "patterns", label: "Patterns", done: project.patterns.length > 0 },
    { id: "keyInsight", label: "Key Insight", done: !!project.keyInsight.trim() },
    { id: "audience", label: "Audience", done: !!project.audience.trim() },
    { id: "opportunity", label: "Opportunity", done: project.opportunity.locked },
    { id: "positioning", label: "Positioning", done: project.positioning.locked },
    { id: "differentiators", label: "Differentiators", done: project.differentiators.length > 0 },
    { id: "attributes", label: "Brand Attributes", done: project.attributes.length > 0 },
    { id: "pillars", label: "Brand Pillars", done: project.pillars.length > 0 },
    { id: "philosophy", label: "Brand Philosophy", done: project.philosophy.locked },
    { id: "voice", label: "Voice & Tone", done: project.voice.locked },
    { id: "persona", label: "Brand Persona", done: project.persona.locked },
    { id: "creative", label: "Creative Direction", done: project.creative.length > 0 },
    { id: "summary", label: "Tell the Story", done: !!project.execSummary.trim() },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="18"
        title="Final Review"
        blurb="Take one final look before you move forward. Everything you've written has led to this moment. Review each section carefully, make any final refinements, and make sure every decision supports the strategy you've developed."
        note="Good design is easier when the strategy is clear."
      />
      <div className="space-y-2 mb-8">
        {rows.map((r) => (
          <button key={r.id} onClick={() => setStep(r.id)} className="w-full flex items-center justify-between rounded-lg px-4 py-3" style={{ background: T.paperRaised, border: `1px solid ${T.line}` }}>
            <span style={{ fontSize: "14.5px", color: T.ink }}>{r.label}</span>
            {r.done ? <Check size={16} style={{ color: T.marigold }} /> : <span className="italic" style={{ fontSize: "12.5px", color: T.inkSoft, fontFamily: "Instrument Serif" }}>not yet</span>}
          </button>
        ))}
      </div>
      <p className="mb-6" style={{ fontSize: "13.5px", color: T.inkSoft }}>When you're confident in your work, export your Brand Strategy and use it as the foundation for the rest of your design process.</p>
      <NextButton onClick={onNext}>Continue to Brand Strategy</NextButton>
    </div>
  );
}

/* ============================================================
   BRAND STRATEGY  (the finished document)
   ============================================================ */
function BrandStrategyStep({ project, onExportMarkdown, onExportPDF }) {
  const p = project;
  const Section = ({ n, title, children }) => (
    <div className="mb-10 pb-10" style={{ borderBottom: `1px solid ${T.line}` }}>
      <div className="uppercase font-semibold mb-2" style={{ fontSize: "11px", letterSpacing: "0.14em", color: T.rule }}>{n}</div>
      <h2 className="mb-3" style={{ fontSize: "30px", fontFamily: "Instrument Serif", color: T.ink }}>{title}</h2>
      <div style={{ fontSize: "15.5px", lineHeight: "1.6", color: T.ink }}>{children}</div>
    </div>
  );

  return (
    <div>
      <div className="no-print flex items-center justify-between mb-11 pb-7" style={{ borderBottom: `1.5px solid ${T.rule}` }}>
        <div>
          <div className="uppercase font-semibold mb-3" style={{ fontSize: "11px", letterSpacing: "0.16em", color: T.inkSoft }}>The Finished Document</div>
          <h1 style={{ fontSize: "46px", lineHeight: "1.0", fontFamily: "Instrument Serif", letterSpacing: "-0.02em", color: T.ink }}>Brand Strategy</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={onExportMarkdown} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium" style={{ fontSize: "13.5px", background: T.paperRaised, color: T.signal, border: `1px solid ${T.line}` }}>
            <FileDown size={14} /> Markdown
          </button>
          <button onClick={onExportPDF} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-semibold" style={{ fontSize: "13.5px", background: T.ink, color: "#fff" }}>
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      <div className="mb-2" style={{ fontSize: "13px", color: T.inkSoft }}>{p.name}</div>

      <Section n="01" title={exportLabel("summary")}>{p.execSummary || "Not yet written"}</Section>
      <Section n="02" title="Communication Problem">{p.challenge || "Not yet defined"}</Section>
      <Section n="03" title={exportLabel("research")}>
        <ul className="space-y-1 list-disc pl-5">{p.research.map((r) => <li key={r.id}>{r.text}</li>)}</ul>
      </Section>
      <Section n="04" title={exportLabel("patterns")}>
        <ul className="space-y-1 list-disc pl-5">{p.patterns.map((pt) => <li key={pt.id}>{pt.note}</li>)}</ul>
      </Section>
      <Section n="05" title="Key Insight">{p.keyInsight || "Not yet defined"}</Section>
      <Section n="06" title="Audience">{p.audience || "Not yet defined"}</Section>
      <Section n="07" title="Opportunity">{p.opportunity.text || "Not yet defined"}</Section>
      <Section n="08" title={exportLabel("positioning")}>
        {p.positioning.locked
          ? <span className="italic" style={{ fontFamily: "Instrument Serif", fontSize: "19px" }}>For {p.positioning.audience}, unlike {p.positioning.market}, this brand {p.positioning.promise}, because {p.positioning.rtb}.</span>
          : "Not yet defined"}
      </Section>
      <Section n="09" title={exportLabel("differentiators")}>
        <ul className="space-y-1 list-disc pl-5">{p.differentiators.map((d) => <li key={d.id}>{d.text}</li>)}</ul>
      </Section>
      <Section n="10" title="Brand Attributes">
        <ul className="space-y-1">{p.attributes.map((a) => <li key={a.id}><b>{a.this}</b>, not {a.not}</li>)}</ul>
      </Section>
      <Section n="11" title="Brand Pillars">
        <ul className="space-y-2">{p.pillars.map((pl) => <li key={pl.id}><b className="italic" style={{ fontFamily: "Instrument Serif" }}>{pl.name}</b>: {pl.link}</li>)}</ul>
      </Section>
      <Section n="12" title="Brand Philosophy">
        <p><b>What:</b> {p.philosophy.what || "Not yet defined"}</p>
        <p><b>How:</b> {p.philosophy.how || "Not yet defined"}</p>
        <p><b>Why:</b> {p.philosophy.why || "Not yet defined"}</p>
      </Section>
      <Section n="13" title="Voice & Tone">
        <p>{p.voice.style || "Not yet defined"}</p>
        {p.voice.avoid && <p style={{ color: T.inkSoft }}>Never: {p.voice.avoid}</p>}
      </Section>
      <Section n="14" title="Brand Persona">
        <p>{p.persona.description || "Not yet defined"}</p>
        {p.persona.howDescribed && <p style={{ color: T.inkSoft }}>Others would describe them as: {p.persona.howDescribed}</p>}
        {p.persona.notThis && <p style={{ color: T.inkSoft }}>Would never: {p.persona.notThis}</p>}
      </Section>
      <Section n="15" title="Creative Direction">
        <ul className="space-y-2">{p.creative.filter((c) => !c.skipped).map((c) => <li key={c.id}><b>{c.category}:</b> {c.approach}</li>)}</ul>
      </Section>
    </div>
  );
}
