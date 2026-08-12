import { useState } from "react";

const STEPS = [
  {
    id: "age",
    question: "What's your age range?",
    type: "single",
    options: ["18–25", "26–35", "36–45", "46–55", "55+"],
  },
  {
    id: "goal",
    question: "What's your primary wellness goal?",
    type: "single",
    options: ["More energy & focus", "Stronger immunity", "Better sleep", "Weight management", "Athletic performance"],
  },
  {
    id: "diet",
    question: "How would you describe your diet?",
    type: "single",
    options: ["Balanced omnivore", "Vegetarian", "Vegan", "Keto / low-carb", "No specific pattern"],
  },
  {
    id: "activity",
    question: "How active are you?",
    type: "single",
    options: ["Sedentary (desk job, little movement)", "Lightly active (1–2x/week)", "Moderately active (3–4x/week)", "Very active (5+x/week)"],
  },
  {
    id: "concerns",
    question: "Any specific health concerns? (pick all that apply)",
    type: "multi",
    options: ["Fatigue & low energy", "Frequent illness", "Digestive issues", "Joint or muscle pain", "Stress & anxiety", "Poor concentration", "None of the above"],
  },
  {
    id: "sleep",
    question: "How's your sleep quality?",
    type: "single",
    options: ["Excellent (7–9h, feel rested)", "Decent (some nights poor)", "Struggling (often tired)", "Chronically poor"],
  },
  {
    id: "sun",
    question: "How much sun exposure do you get?",
    type: "single",
    options: ["Plenty (outdoor lifestyle)", "Moderate (some outdoor time)", "Limited (mostly indoors)", "Very little (northern climate / office work)"],
  },
];

// Affiliate product catalogue
const PRODUCTS = {
  "vitamin-d": {
    name: "Terranova Vitamin D3 2000 IU + K2",
    benefit: "Bone health, immunity & calcium metabolism",
    url: "https://www.amazon.co.uk/Terranova-Vitamin-D3-K2-Complex/dp/B07PFF6TW9/?tag=nutralyze-21",
    tag: "Vitamin D3 + K2",
  },
  "magnesium": {
    name: "Magnesium Bisglycinate 500mg",
    benefit: "Relaxation, sleep & muscle recovery",
    url: "https://www.amazon.co.uk/Supplements-Magnesium-Bisglycinate-Absorption-Supplement/dp/B0F3JY2FB8/?tag=nutralyze-21",
    tag: "Magnesium",
  },
  "omega-3": {
    name: "Solgar Triple Strength Omega-3",
    benefit: "Heart, brain & joint support",
    url: "https://www.amazon.co.uk/Solgar-Triple-Strength-Omega-3-Softgels/dp/B000NI6WHY/?tag=nutralyze-21",
    tag: "Omega-3",
  },
  "b12": {
    name: "Solgar Methylcobalamin B12 1000mcg",
    benefit: "Energy, nerve function & red blood cells",
    url: "https://www.amazon.co.uk/Solgar-Methylcobalamin-Vitamin-1000-Nuggets/dp/B0F5HTSG2N/?tag=nutralyze-21",
    tag: "Vitamin B12",
  },
  "zinc": {
    name: "Solgar Zinc Picolinate 22mg",
    benefit: "Immunity, skin & testosterone support",
    url: "https://www.amazon.co.uk/Solgar-Zinc-Picolinate-22-Tablets/dp/B00020ICLC/?tag=nutralyze-21",
    tag: "Zinc",
  },
  "vitamin-c": {
    name: "Solgar Vitamin C 1000mg",
    benefit: "Antioxidant, immunity & collagen synthesis",
    url: "https://www.amazon.co.uk/Solgar-Vitamin-1000-Vegetable-Capsules/dp/B00020IBF4/?tag=nutralyze-21",
    tag: "Vitamin C",
  },
  "iron": {
    name: "Solgar Gentle Iron Bisglycinate",
    benefit: "Energy, oxygen transport & fatigue reduction",
    url: "https://www.amazon.co.uk/Solgar-Gentle-Bisglycinate-Vegetable-Capsules/dp/B0001OP028/?tag=nutralyze-21",
    tag: "Iron",
  },
  "coq10": {
    name: "Solgar Vegetarian CoQ-10 200mg",
    benefit: "Cellular energy & cardiovascular health",
    url: "https://www.amazon.co.uk/Solgar-Vegetarian-CoQ-10-200-Capsules/dp/B00S9XYW40/?tag=nutralyze-21",
    tag: "CoQ10",
  },
  "ashwagandha": {
    name: "Solgar Ashwagandha Root Extract",
    benefit: "Stress relief, cortisol balance & energy",
    url: "https://www.amazon.co.uk/SOLGAR-Ashwaganda-Root-60-CT/dp/B000Z92QVW/?tag=nutralyze-21",
    tag: "Ashwagandha",
  },
};

// Logic: pick relevant products based on quiz answers
function selectProducts(answers) {
  const selected = [];
  const goal = answers.goal || "";
  const concerns = answers.concerns || [];
  const diet = answers.diet || "";
  const sleep = answers.sleep || "";
  const sun = answers.sun || "";
  const activity = answers.activity || "";

  // Always recommend Vitamin D if limited sun
  if (sun.includes("Limited") || sun.includes("Very little") || sun.includes("northern")) {
    selected.push("vitamin-d");
  }

  // Energy goals
  if (goal.includes("energy") || concerns.includes("Fatigue & low energy")) {
    selected.push("b12");
    selected.push("coq10");
    if (!selected.includes("iron")) selected.push("iron");
  }

  // Immunity
  if (goal.includes("immunity") || concerns.includes("Frequent illness")) {
    if (!selected.includes("vitamin-c")) selected.push("vitamin-c");
    if (!selected.includes("zinc")) selected.push("zinc");
    if (!selected.includes("vitamin-d")) selected.push("vitamin-d");
  }

  // Sleep / stress
  if (goal.includes("sleep") || sleep.includes("Struggling") || sleep.includes("Chronically") || concerns.includes("Stress")) {
    if (!selected.includes("magnesium")) selected.push("magnesium");
    if (!selected.includes("ashwagandha")) selected.push("ashwagandha");
  }

  // Athletic / weight
  if (goal.includes("Athletic") || goal.includes("Weight")) {
    if (!selected.includes("omega-3")) selected.push("omega-3");
    if (!selected.includes("magnesium")) selected.push("magnesium");
    if (!selected.includes("zinc")) selected.push("zinc");
  }

  // Vegan/vegetarian → B12 always
  if (diet.includes("Vegetarian") || diet.includes("Vegan")) {
    if (!selected.includes("b12")) selected.push("b12");
    if (!selected.includes("iron")) selected.push("iron");
    if (!selected.includes("omega-3")) selected.push("omega-3");
  }

  // Joint pain
  if (concerns.includes("Joint or muscle pain")) {
    if (!selected.includes("omega-3")) selected.push("omega-3");
    if (!selected.includes("magnesium")) selected.push("magnesium");
  }

  // Active people
  if (activity.includes("Very active") || activity.includes("Moderately")) {
    if (!selected.includes("magnesium")) selected.push("magnesium");
    if (!selected.includes("coq10")) selected.push("coq10");
  }

  // Fallback: always show at least 3
  if (selected.length < 3) {
    ["vitamin-d", "magnesium", "vitamin-c"].forEach(k => {
      if (!selected.includes(k)) selected.push(k);
    });
  }

  // Max 4 products
  return [...new Set(selected)].slice(0, 4).map(k => PRODUCTS[k]);
}

const palette = {
  bg: "#080F1A",
  card: "#0F1C2E",
  cardBorder: "#1A2D45",
  accent: "#00C9A7",
  accentDim: "#007A65",
  text: "#E8F0F8",
  muted: "#6B8099",
  optionBg: "#0A1828",
  optionHover: "#122035",
  optionSelected: "#0D2A22",
  optionSelectedBorder: "#00C9A7",
  error: "#FF6B6B",
  productCard: "#0A1F35",
  productBorder: "#1E3450",
};

const styles = {
  root: {
    minHeight: "100vh",
    background: palette.bg,
    fontFamily: "'Inter', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 16px 60px",
    color: palette.text,
  },
  header: {
    width: "100%",
    maxWidth: 640,
    padding: "32px 0 0",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: palette.text,
  },
  logoAccent: { color: palette.accent },
  tagline: {
    fontSize: 11,
    color: palette.muted,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginLeft: "auto",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    background: palette.card,
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 20,
    padding: "36px 32px",
    marginTop: 32,
  },
  progressBar: {
    width: "100%",
    height: 3,
    background: palette.cardBorder,
    borderRadius: 2,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${palette.accentDim}, ${palette.accent})`,
    borderRadius: 2,
    transition: "width 0.4s ease",
  }),
  stepLabel: {
    fontSize: 11,
    color: palette.muted,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  question: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.35,
    marginBottom: 28,
    letterSpacing: "-0.3px",
  },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  option: (selected) => ({
    padding: "14px 18px",
    background: selected ? palette.optionSelected : palette.optionBg,
    border: `1.5px solid ${selected ? palette.optionSelectedBorder : palette.cardBorder}`,
    borderRadius: 12,
    color: selected ? palette.accent : palette.text,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: selected ? 600 : 400,
  }),
  checkDot: (selected) => ({
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: `2px solid ${selected ? palette.accent : palette.muted}`,
    background: selected ? palette.accent : "transparent",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  }),
  checkSquare: (selected) => ({
    width: 18,
    height: 18,
    borderRadius: 5,
    border: `2px solid ${selected ? palette.accent : palette.muted}`,
    background: selected ? palette.accent : "transparent",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  }),
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
  },
  btnBack: {
    background: "transparent",
    border: `1px solid ${palette.cardBorder}`,
    color: palette.muted,
    padding: "12px 22px",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 500,
  },
  btnNext: (disabled) => ({
    background: disabled ? palette.accentDim : palette.accent,
    border: "none",
    color: "#000",
    padding: "12px 28px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.15s ease",
  }),
  resultText: {
    fontSize: 15,
    lineHeight: 1.75,
    color: palette.text,
    whiteSpace: "pre-wrap",
  },
  loader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    padding: "40px 0",
  },
  spinner: {
    width: 44,
    height: 44,
    border: `3px solid ${palette.cardBorder}`,
    borderTop: `3px solid ${palette.accent}`,
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loaderText: { color: palette.muted, fontSize: 14, letterSpacing: "0.5px" },
  heroCard: {
    width: "100%",
    maxWidth: 640,
    background: `linear-gradient(135deg, #0D2A22 0%, ${palette.card} 100%)`,
    border: `1px solid ${palette.optionSelectedBorder}`,
    borderRadius: 20,
    padding: "44px 32px",
    marginTop: 32,
    textAlign: "center",
  },
  heroTag: {
    display: "inline-block",
    background: "#0D2A22",
    border: `1px solid ${palette.accent}`,
    color: palette.accent,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    padding: "5px 12px",
    borderRadius: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "-0.8px",
    lineHeight: 1.2,
    marginBottom: 14,
  },
  heroSub: {
    fontSize: 15,
    color: palette.muted,
    lineHeight: 1.6,
    maxWidth: 420,
    margin: "0 auto 32px",
  },
  btnStart: {
    background: palette.accent,
    border: "none",
    color: "#000",
    padding: "15px 36px",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },
  disclaimer: {
    fontSize: 11,
    color: palette.muted,
    marginTop: 16,
    lineHeight: 1.5,
  },
  emailRow: {
    display: "flex",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },
  emailInput: {
    flex: 1,
    minWidth: 200,
    background: palette.optionBg,
    border: `1.5px solid ${palette.cardBorder}`,
    borderRadius: 10,
    padding: "12px 16px",
    color: palette.text,
    fontSize: 14,
    outline: "none",
  },
  btnEmail: {
    background: palette.accent,
    border: "none",
    color: "#000",
    padding: "12px 22px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emailSent: {
    color: palette.accent,
    fontSize: 13,
    marginTop: 10,
    fontWeight: 600,
  },
  // Product card styles
  productsSection: {
    marginTop: 32,
    paddingTop: 28,
    borderTop: `1px solid ${palette.cardBorder}`,
  },
  productsSectionTitle: {
    fontSize: 13,
    color: palette.accent,
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  productsSectionSub: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 18,
  },
  productGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  productCard: {
    background: palette.productCard,
    border: `1px solid ${palette.productBorder}`,
    borderRadius: 14,
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    textDecoration: "none",
    transition: "border-color 0.15s ease",
  },
  productLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  productTag: {
    fontSize: 10,
    fontWeight: 700,
    color: palette.accent,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  productName: {
    fontSize: 14,
    fontWeight: 600,
    color: palette.text,
    lineHeight: 1.3,
  },
  productBenefit: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 1.4,
  },
  productBtn: {
    background: palette.accent,
    color: "#000",
    fontSize: 12,
    fontWeight: 700,
    padding: "8px 14px",
    borderRadius: 8,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  affiliateNote: {
    fontSize: 11,
    color: palette.muted,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 1.5,
  },
};

function Spinner() {
  return (
    <div style={styles.loader}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.spinner} />
      <div style={styles.loaderText}>Analysing your profile with AI…</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5l2.5 2.5L8 3" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProductCards({ products }) {
  return (
    <div style={styles.productsSection}>
      <div style={styles.productsSectionTitle}>✦ Recommended for you</div>
      <div style={styles.productsSectionSub}>
        Science-backed supplements matched to your profile — available on Amazon UK
      </div>
      <div style={styles.productGrid}>
        {products.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.productCard}
          >
            <div style={styles.productLeft}>
              <div style={styles.productTag}>{p.tag}</div>
              <div style={styles.productName}>{p.name}</div>
              <div style={styles.productBenefit}>{p.benefit}</div>
            </div>
            <div style={styles.productBtn}>View →</div>
          </a>
        ))}
      </div>
      <div style={styles.affiliateNote}>
        * As an Amazon Associate, Nutralyze earns from qualifying purchases. This does not affect our recommendations.
      </div>
    </div>
  );
}

export default function NutralyzeQuiz() {
  const [screen, setScreen] = useState("hero");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [consent, setConsent] = useState(false);

  const currentStep = STEPS[step];
  const progress = (step / STEPS.length) * 100;
  const currentAnswer = answers[currentStep?.id];
  const hasAnswer = currentStep?.type === "multi"
    ? currentAnswer?.length > 0
    : !!currentAnswer;

  function selectOption(option) {
    if (currentStep.type === "multi") {
      const prev = answers[currentStep.id] || [];
      const next = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      setAnswers({ ...answers, [currentStep.id]: next });
    } else {
      setAnswers({ ...answers, [currentStep.id]: option });
    }
  }

  function isSelected(option) {
    if (currentStep.type === "multi") {
      return (answers[currentStep.id] || []).includes(option);
    }
    return answers[currentStep.id] === option;
  }

  async function generatePlan() {
    setScreen("loading");

    const summary = STEPS.map((s) => {
      const ans = answers[s.id];
      const val = Array.isArray(ans) ? ans.join(", ") : ans;
      return `${s.question}: ${val}`;
    }).join("\n");

    const productKeys = Object.keys(PRODUCTS).join(", ");

    const catalogueInfo = `
Available supplement products (use these exact names, dosages and forms in your recommendations):
- vitamin-d: Terranova Vitamin D3 2000 IU + K2 complex
- magnesium: Magnesium Bisglycinate 500mg (note: 500mg is the elemental + glycinate combined weight; effective elemental dose is ~100mg — recommend as 1 capsule daily)
- omega-3: Solgar Triple Strength Omega-3 (fish oil, high EPA/DHA)
- b12: Solgar Methylcobalamin B12 1000mcg (sublingual, methylated form)
- zinc: Solgar Zinc Picolinate 22mg
- vitamin-c: Solgar Vitamin C 1000mg
- iron: Solgar Gentle Iron Bisglycinate (gentle on stomach)
- coq10: Solgar Vegetarian CoQ-10 200mg
- ashwagandha: Solgar Ashwagandha Root Extract (standardised root extract, not KSM-66 — refer to it as "Ashwagandha Root Extract")
`;

    const prompt = `You are a certified nutritionist creating a personalised 30-day wellness plan.

User profile:
${summary}

${catalogueInfo}

Create a structured, science-backed wellness plan. Format it clearly with these sections:
1. YOUR PROFILE SUMMARY (2-3 sentences interpreting their data)
2. TOP 4 RECOMMENDED SUPPLEMENTS (each with: exact product name from the catalogue above, why it's right for them, dosage matching the catalogue, timing)
3. NUTRITION FOCUS (3-4 key dietary principles for their profile)
4. LIFESTYLE RECOMMENDATIONS (2-3 practical habits)
5. WHAT TO EXPECT IN 30 DAYS

At the very end, on a new line, add exactly this format with no extra text:
PRODUCTS:key1,key2,key3,key4

Choose 3-4 keys from this list that best match your supplement recommendations: ${productKeys}

Important: All recommendations must be informational and educational only — not medical advice. Use confident, evidence-based language. Be specific to their profile, not generic. Keep it concise and actionable.`;

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const fullText = data.text || "";

      // Parse PRODUCTS line and strip it from visible text
      const productsMatch = fullText.match(/PRODUCTS:([a-z0-9,\-]+)/i);
      if (productsMatch) {
        const keys = productsMatch[1].split(",").map(k => k.trim()).filter(k => PRODUCTS[k]);
        setProducts(keys.slice(0, 4).map(k => PRODUCTS[k]));
      } else {
        // Fallback to answer-based selection
        setProducts(selectProducts(answers));
      }

      const cleanText = fullText.replace(/\nPRODUCTS:[^\n]*/i, "").trim();
      setResult(cleanText);
      setScreen("result");
    } catch (e) {
      setResult("We couldn't generate your plan right now. Please try again.");
      setProducts(selectProducts(answers));
      setScreen("result");
    }
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      generatePlan();
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const [emailSending, setEmailSending] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  async function handleEmailSubmit() {
    if (!email.includes("@")) return;
    setEmailSending(true);
    setEmailErrorMsg("");
    try {
      const response = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, planText: result, products }),
      });
      const data = await response.json();
      if (data.emailSent) {
        setEmailSent(true);
      } else {
        setEmailErrorMsg("We saved your details but couldn't send the email right now.");
      }
    } catch (e) {
      setEmailErrorMsg("Something went wrong. Please try again.");
    } finally {
      setEmailSending(false);
    }
  }

  function renderResult() {
    if (!result) return null;
    const sections = result.split(/\n(?=\d+\.)/g);
    return sections.map((section, i) => (
      <div key={i} style={{ marginBottom: 20 }}>
        <div style={styles.resultText}>{section.trim()}</div>
      </div>
    ));
  }

  // HERO
  if (screen === "hero") {
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <div style={styles.logo}>Nutra<span style={styles.logoAccent}>lyze</span></div>
          <div style={styles.tagline}>AI Wellness</div>
        </div>
        <div style={styles.heroCard}>
          <div style={styles.heroTag}>Personalised by AI</div>
          <div style={styles.heroTitle}>
            Your body.<br />Your supplements.<br />
            <span style={{ color: palette.accent }}>Your plan.</span>
          </div>
          <div style={styles.heroSub}>
            Answer 7 questions. Get a science-backed, personalised nutrition plan generated by AI — tailored to your goals, diet, and lifestyle.
          </div>

          {/* GDPR Article 9 consent checkbox */}
          <div
            style={{ maxWidth: 420, margin: "0 auto 20px", textAlign: "left", cursor: "pointer" }}
            onClick={() => setConsent(!consent)}
            role="checkbox"
            aria-checked={consent}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setConsent(!consent); } }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 20, height: 20, minWidth: 20, borderRadius: 5,
                border: `2px solid ${consent ? palette.accent : palette.muted}`,
                background: consent ? palette.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease", marginTop: 2,
              }}>
                {consent && <CheckIcon />}
              </div>
              <div style={{ fontSize: 12, color: palette.muted, lineHeight: 1.5 }}>
                I consent to Nutralyze processing my health-related quiz answers to generate a personalised wellness plan, as described in the{" "}
                <a
                  href="https://nutralyze.health/disclaimer-privacy-notice-nutralyze-health-disclaimer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: palette.accent, textDecoration: "underline" }}
                >Disclaimer &amp; Privacy Notice</a>.
              </div>
            </div>
          </div>

          <button
            style={{ ...styles.btnStart, opacity: consent ? 1 : 0.4, cursor: consent ? "pointer" : "not-allowed" }}
            onClick={() => consent && setScreen("quiz")}
            disabled={!consent}
          >
            Start free analysis →
          </button>
          <div style={styles.disclaimer}>
            Takes 2 minutes · Informational only · Not medical advice
          </div>
        </div>
      </div>
    );
  }

  // LOADING
  if (screen === "loading") {
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <div style={styles.logo}>Nutra<span style={styles.logoAccent}>lyze</span></div>
        </div>
        <div style={styles.card}>
          <Spinner />
        </div>
      </div>
    );
  }

  // RESULT
  if (screen === "result") {
    return (
      <div style={styles.root}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.header}>
          <div style={styles.logo}>Nutra<span style={styles.logoAccent}>lyze</span></div>
          <div style={styles.tagline}>Your Plan</div>
        </div>
        <div style={styles.card}>
          <div style={{ fontSize: 13, color: palette.accent, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
            ✦ AI Analysis Complete
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>
            Your 30-Day Wellness Plan
          </div>
          <div style={{ fontSize: 13, color: palette.muted, marginBottom: 28 }}>
            Personalised based on your profile · Informational only
          </div>
          <div style={{ borderTop: `1px solid ${palette.cardBorder}`, paddingTop: 24 }}>
            {renderResult()}
          </div>

          {/* Affiliate Products */}
          {products.length > 0 && <ProductCards products={products} />}

          {/* Email capture */}
          <div style={{ borderTop: `1px solid ${palette.cardBorder}`, paddingTop: 24, marginTop: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
              Save your plan
            </div>
            <div style={{ fontSize: 13, color: palette.muted, marginBottom: 4 }}>
              Enter your email to receive your full plan + weekly wellness tips.
            </div>
            {!emailSent ? (
              <>
                <div style={styles.emailRow}>
                  <input
                    style={styles.emailInput}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button style={styles.btnEmail} onClick={handleEmailSubmit} disabled={emailSending}>
                    {emailSending ? "Sending…" : "Send plan"}
                  </button>
                </div>
                {emailErrorMsg && (
                  <div style={{ color: palette.error, fontSize: 12, marginTop: 8 }}>{emailErrorMsg}</div>
                )}
              </>
            ) : (
              <div style={styles.emailSent}>✓ Plan sent — check your inbox!</div>
            )}
          </div>

          <button
            style={{ ...styles.btnBack, marginTop: 24, width: "100%", textAlign: "center" }}
            onClick={() => { setScreen("hero"); setStep(0); setAnswers({}); setResult(""); setProducts([]); setEmailSent(false); setConsent(false); }}
          >
            ← Start over
          </button>
        </div>
      </div>
    );
  }

  // QUIZ
  return (
    <div style={styles.root}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.header}>
        <div style={styles.logo}>Nutra<span style={styles.logoAccent}>lyze</span></div>
        <div style={styles.tagline}>Analysis</div>
      </div>
      <div style={styles.card}>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(progress)} />
        </div>
        <div style={styles.stepLabel}>Question {step + 1} of {STEPS.length}</div>
        <div style={styles.question}>{currentStep.question}</div>
        {currentStep.type === "multi" && (
          <div style={{ fontSize: 12, color: palette.muted, marginBottom: 16 }}>Select all that apply</div>
        )}
        <div style={styles.optionsGrid}>
          {currentStep.options.map((opt) => {
            const sel = isSelected(opt);
            return (
              <button key={opt} style={styles.option(sel)} onClick={() => selectOption(opt)}>
                <div style={currentStep.type === "multi" ? styles.checkSquare(sel) : styles.checkDot(sel)}>
                  {sel && <CheckIcon />}
                </div>
                {opt}
              </button>
            );
          })}
        </div>
        <div style={styles.navRow}>
          <button style={styles.btnBack} onClick={handleBack} disabled={step === 0}>
            ← Back
          </button>
          <button style={styles.btnNext(!hasAnswer)} onClick={handleNext} disabled={!hasAnswer}>
            {step === STEPS.length - 1 ? "Generate my plan →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
