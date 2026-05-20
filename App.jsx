import { useState } from "react";
const ACCENT = "#FF4500";
const DARK = "#0A0A0A";
const CARD = "#141414";
const BORDER = "#222";
const MUTED = "#666";
const GOLD = "#FFB800";
const styles = {
  app: { minHeight: "100vh", background: DARK, color: "#F0F0F0", fontFamily: "Georgia, serif", overflowX: "hidden" },
  hero: { textAlign: "center", padding: "60px 24px 40px" },
  badge: { display: "inline-block", background: "#FF450020", border: "1px solid #FF4500", color: "#FF4500", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", padding: "6px 16px", borderRadius: "2px", marginBottom: "24px" },
  h1: { fontSize: "3rem", fontWeight: "900", lineHeight: 1.05, margin: "0 0 16px", letterSpacing: "-2px" },
  flame: { color: ACCENT },
  sub: { fontSize: "1rem", color: "#AAA", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.6 },
  pricingRow: { display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "40px" },
  pasteArea: { width: "100%", maxWidth: "600px", display: "block", margin: "0 auto 20px", background: CARD, border: "1px solid #222", borderRadius: "4px", color: "#F0F0F0", padding: "16px", fontSize: "0.9rem", resize: "vertical", minHeight: "160px", outline: "none", boxSizing: "border-box" },
  roastBtn: (loading) => ({ background: loading ? "#B03000" : ACCENT, color: "#fff", border: "none", padding: "16px 48px", fontSize: "1rem", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "2px", cursor: "pointer", display: "block", margin: "0 auto 40px" }),
  section: { maxWidth: "720px", margin: "0 auto", padding: "0 24px 60px" },
  resultCard: { background: CARD, border: "1px solid #222", borderRadius: "4px", marginBottom: "20px", overflow: "hidden" },
  cardBody: { padding: "20px", fontSize: "0.95rem", lineHeight: 1.75, color: "#CCC", whiteSpace: "pre-wrap" },
  scoreRow: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" },
  scoreBox: (color) => ({ flex: 1, minWidth: "120px", background: CARD, border: "1px solid " + color + "40", borderRadius: "4px", padding: "16px", textAlign: "center" }),
  scoreNum: (color) => ({ fontSize: "2.2rem", fontWeight: "900", color, lineHeight: 1 }),
  scoreLabel: { fontSize: "0.7rem", color: MUTED, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "4px" },
  tabRow: { display: "flex", borderBottom: "1px solid #222" },
  tab: (active) => ({ padding: "10px 20px", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", color: active ? ACCENT : MUTED, borderBottom: active ? "2px solid #FF4500" : "2px solid transparent", background: "transparent", border: "none", marginBottom: "-1px" }),
  errorBox: { background: "#1A0000", border: "1px solid #FF4500", borderRadius: "4px", padding: "16px 20px", color: "#FF8888", fontSize: "0.85rem", maxWidth: "600px", margin: "0 auto 20px", textAlign: "center" },
  footer: { textAlign: "center", padding: "24px", color: MUTED, fontSize: "0.75rem", borderTop: "1px solid #222" },
  howRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginTop: "24px" },
  howCard: { background: CARD, border: "1px solid #222", borderRadius: "4px", padding: "20px", textAlign: "center" },
};
const SYSTEM_PROMPT = `You are a brutally honest resume expert. Respond ONLY with valid JSON no markdown: {"roast":"2-3 paragraphs brutal critique","scores":{"overall":0,"impact":0,"clarity":0,"keywords":0},"topIssues":["issue1","issue2","issue3","issue4","issue5"],"rewrite":"improved resume","tips":["tip1","tip2","tip3"]}`;
function ScoreColor(n) { if (n >= 75) return "#4ADE80"; if (n >= 50) return "#FFB800"; return "#FF4500"; }
export default function ResumeRoaster() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("roast");
  const [plan, setPlan] = useState("basic");
  const roast = async () => {
    if (!resumeText.trim()) { setError("Please paste your resume text first."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + import.meta.env.VITE_GROQ_KEY },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 2000, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: "Analyze this resume. Plan: " + plan + "\n\n" + resumeText.slice(0, 4000) }] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");
      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean)); setActiveTab("roast");
    } catch (err) { setError("Error: " + err.message); } finally { setLoading(false); }
  };
  return (
    <div style={styles.app}>
      <div style={styles.hero}>
        <div style={styles.badge}>🔥 AI-Powered · Brutally Honest</div>
        <h1 style={styles.h1}>Resume<span style={styles.flame}> Roast</span><br />& Rewrite</h1>
        <p style={styles.sub}>Stop sending a resume that is quietly killing your chances. Get roasted. Get fixed. Get hired.</p>
        <div style={styles.pricingRow}>
          {[{key:"basic",label:"Basic — Free"},{key:"pro",label:"Pro — $9"},{key:"executive",label:"Executive — $29"}].map((p) => (
            <button key={p.key} onClick={() => setPlan(p.key)} style={{ background: plan===p.key ? ACCENT : "transparent", border: "1px solid " + (plan===p.key ? ACCENT : BORDER), color: plan===p.key ? "#fff" : MUTED, padding: "10px 22px", borderRadius: "2px", cursor: "pointer", fontSize: "0.85rem" }}>{p.label}</button>
          ))}
        </div>
      </div>
      <div style={styles.section}>
        <textarea style={styles.pasteArea} placeholder="Paste your resume text here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        <button style={styles.roastBtn(loading)} onClick={roast} disabled={loading}>{loading ? "🔥 Roasting..." : "🔥 Roast My Resume"}</button>
        {!result && (
          <div style={styles.howRow}>
            {[{n:"1",t:"Paste your resume"},{n:"2",t:"AI reads ruthlessly"},{n:"3",t:"Get roast + rewrite"},{n:"4",t:"Apply and get hired"}].map((h) => (
              <div key={h.n} style={styles.howCard}><div style={{fontSize:"2rem",color:ACCENT,fontWeight:"900"}}>{h.n}</div><div style={{fontSize:"0.8rem",color:"#AAA",marginTop:"8px"}}>{h.t}</div></div>
            ))}
          </div>
        )}
        {result && (
          <>
            <div style={styles.scoreRow}>
              {Object.entries(result.scores).map(([k,v]) => (
                <div key={k} style={styles.scoreBox(ScoreColor(v))}><div style={styles.scoreNum(ScoreColor(v))}>{v}</div><div style={styles.scoreLabel}>{k}</div></div>
              ))}
            </div>
            <div style={styles.resultCard}>
              <div style={styles.tabRow}>
                {["roast","issues","rewrite","tips"].map((t) => (
                  <button key={t} style={styles.tab(activeTab===t)} onClick={() => setActiveTab(t)}>{t==="roast"?"🔥 Roast":t==="issues"?"⚠️ Issues":t==="rewrite"?"✨ Rewrite":"💡 Tips"}</button>
                ))}
              </div>
              {activeTab==="roast" && <div style={styles.cardBody}>{result.roast}</div>}
              {activeTab==="issues" && <div style={styles.cardBody}>{result.topIssues?.map((issue,i) => <div key={i} style={{marginBottom:"12px",display:"flex",gap:"10px"}}><span style={{color:ACCENT,fontWeight:"bold"}}>#{i+1}</span><span>{issue}</span></div>)}</div>}
              {activeTab==="rewrite" && <div style={styles.cardBody}>{result.rewrite}</div>}
              {activeTab==="tips" && <div style={styles.cardBody}>{result.tips?.map((tip,i) => <div key={i} style={{marginBottom:"12px",display:"flex",gap:"10px"}}><span style={{color:GOLD}}>→</span><span>{tip}</span></div>)}</div>}
            </div>
            <button style={{...styles.roastBtn(false),background:"#1A1A1A",border:"1px solid #222",color:"#AAA"}} onClick={() => {setResult(null);setResumeText("");setError("");}}>Roast Another Resume</button>
          </>
        )}
      </div>
      <footer style={styles.footer}>RESUME ROASTER · AI-POWERED · {new Date().getFullYear()}</footer>
    </div>
  );
             }
