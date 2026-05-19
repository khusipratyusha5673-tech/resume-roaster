import { useState, useRef } from "react";
const ACCENT = "#FF4500";
const DARK = "#0A0A0A";
const CARD = "#141414";
const BORDER = "#222";
const MUTED = "#666";
const GOLD = "#FFB800";
const styles = {
  app: { minHeight: "100vh", background: DARK, color: "#F0F0F0", fontFamily: "'Georgia', 'Times New Roman', serif", overflowX: "hidden" },
  hero: { textAlign: "center", padding: "60px 24px 40px", position: "relative" },
  badge: { display: "inline-block", background: `${ACCENT}20`, border: `1px solid ${ACCENT}`, color: ACCENT, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", padding: "6px 16px", borderRadius: "2px", marginBottom: "24px", fontFamily: "'Courier New', monospace" },
  h1: { fontSize: "clamp(2.2rem, 6vw, 4.5rem)", fontWeight: "900", lineHeight: 1.05, margin: "0 0 16px", letterSpacing: "-2px" },
  flame: { color: ACCENT },
  sub: { fontSize: "1.1rem", color: "#AAA", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.6, fontFamily: "'Courier New', monospace", fontStyle: "italic" },
  pricingRow: { display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "40px" },
  priceBadge: (active) => ({ background: active ? ACCENT : "transparent", border: `1px solid ${active ? ACCENT : BORDER}`, color: active ? "#fff" : MUTED, padding: "10px 22px", borderRadius: "2px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "'Courier New', monospace", transition: "all 0.2s", letterSpacing: "1px" }),
  uploadZone: (drag) => ({ border: `2px dashed ${drag ? ACCENT : BORDER}`, borderRadius: "4px", padding: "40px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", background: drag ? `${ACCENT}08` : "#0D0D0D", maxWidth: "600px", margin: "0 auto 24px" }),
  uploadIcon: { fontSize: "2.5rem", marginBottom: "12px" },
  uploadText: { color: MUTED, fontFamily: "'Courier New', monospace", fontSize: "0.9rem", lineHeight: 1.6 },
  pasteArea: { width: "100%", maxWidth: "600px", display: "block", margin: "0 auto 20px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", color: "#F0F0F0", padding: "16px", fontSize: "0.9rem", fontFamily: "'Courier New', monospace", resize: "vertical", minHeight: "160px", outline: "none", boxSizing: "border-box" },
  roastBtn: (loading, disabled) => ({ background: disabled ? "#222" : loading ? "#B03000" : ACCENT, color: disabled ? MUTED : "#fff", border: "none", padding: "16px 48px", fontSize: "1rem", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "2px", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Courier New', monospace", transition: "all 0.2s", display: "block", margin: "0 auto 40px" }),
  section: { maxWidth: "720px", margin: "0 auto", padding: "0 24px 60px" },
  resultCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", marginBottom: "20px", overflow: "hidden" },
  cardBody: { padding: "20px", fontSize: "0.95rem", lineHeight: 1.75, color: "#CCC", whiteSpace: "pre-wrap" },
  scoreRow: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" },
  scoreBox: (color) => ({ flex: 1, minWidth: "120px", background: CARD, border: `1px solid ${color}40`, borderRadius: "4px", padding: "16px", textAlign: "center" }),
  scoreNum: (color) => ({ fontSize: "2.2rem", fontWeight: "900", color, lineHeight: 1, fontFamily: "'Georgia', serif" }),
  scoreLabel: { fontSize: "0.7rem", color: MUTED, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", marginTop: "4px" },
  divider: { border: "none", borderTop: `1px solid ${BORDER}`, margin: "40px 0" },
  howRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginTop: "24px" },
  howCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "24px 20px", textAlign: "center" },
  howNum: { fontSize: "2rem", color: ACCENT, fontWeight: "900", fontFamily: "'Georgia', serif" },
  howTitle: { fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", color: "#AAA", marginTop: "8px", lineHeight: 1.4 },
  tabRow: { display: "flex", gap: "0", marginBottom: "0", borderBottom: `1px solid ${BORDER}` },
  tab: (active) => ({ padding: "10px 20px", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", color: active ? ACCENT : MUTED, borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent", background: "transparent", border: "none", marginBottom: "-1px", transition: "all 0.2s" }),
  copyBtn: { float: "right", background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, padding: "4px 12px", fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", cursor: "pointer", borderRadius: "2px", transition: "all 0.2s" },
  errorBox: { background: "#1A0000", border: `1px solid ${ACCENT}`, borderRadius: "4px", padding: "16px 20px", color: "#FF8888", fontFamily: "'Courier New', monospace", fontSize: "0.85rem", maxWidth: "600px", margin: "0 auto 20px", textAlign: "center" },
  footer: { textAlign: "center", padding: "24px", color: MUTED, fontFamily: "'Courier New', monospace", fontSize: "0.75rem", letterSpacing: "1px", borderTop: `1px solid ${BORDER}` },
  inputToggle: { display: "flex", justifyContent: "center", gap: "0", marginBottom: "20px", border: `1px solid ${BORDER}`, borderRadius: "4px", overflow: "hidden", maxWidth: "300px", margin: "0 auto 24px" },
  toggleBtn: (active) => ({ flex: 1, padding: "8px 16px", background: active ? ACCENT : "transparent", color: active ? "#fff" : MUTED, border: "none", cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Courier New', monospace", letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s" }),
};
const SYSTEM_PROMPT = `You are a brutally honest but constructive resume expert. Respond ONLY with valid JSON: {"roast":"2-3 paragraphs brutal critique","scores":{"overall":0,"impact":0,"clarity":0,"keywords":0},"topIssues":["issue1","issue2","issue3","issue4","issue5"],"rewrite":"improved resume text","tips":["tip1","tip2","tip3"]}`;
function ScoreColor(n) { if (n >= 75) return "#4ADE80"; if (n >= 50) return GOLD; return ACCENT; }
export default function ResumeRoaster() {
  const [resumeText, setResumeText] = useState("");
  const [inputMode, setInputMode] = useState("paste");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("roast");
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState("basic");
  const fileRef = useRef();
  const handleFile = (file) => { if (!file) return; const reader = new FileReader(); reader.onload = (e) => setResumeText(e.target.result); reader.readAsText(file); };
  const roast = async () => {
    if (!resumeText.trim()) { setError("Please paste your resume text first."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages: [{ role: "user", content: `Analyze this resume. Plan: ${plan}\n\n${resumeText.slice(0, 4000)}` }] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");
      const text = data.content.map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean)); setActiveTab("roast");
    } catch (err) { setError("Error: " + err.message); } finally { setLoading(false); }
  };
  const copyRewrite = () => { if (result?.rewrite) { navigator.clipboard.writeText(result.rewrite); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  return (
    <div style={styles.app}>
      <div style={styles.hero}>
        <div style={styles.badge}>🔥 AI-Powered · Brutally Honest</div>
        <h1 style={styles.h1}>Resume<span style={styles.flame}> Roast</span><br />& Rewrite</h1>
        <p style={styles.sub}>Stop sending a resume that's quietly killing your chances. Get roasted. Get fixed. Get hired.</p>
        <div style={styles.pricingRow}>
          {[{key:"basic",label:"Basic — Free"},{key:"pro",label:"Pro — $9"},{key:"executive",label:"Executive — $29"}].map((p) => (
            <button key={p.key} style={styles.priceBadge(plan===p.key)} onClick={() => setPlan(p.key)}>{p.label}</button>
          ))}
        </div>
      </div>
      <div style={styles.section}>
        <div style={styles.inputToggle}>
          <button style={styles.toggleBtn(inputMode==="paste")} onClick={() => setInputMode("paste")}>Paste Text</button>
          <button style={styles.toggleBtn(inputMode==="upload")} onClick={() => setInputMode("upload")}>Upload File</button>
        </div>
        {inputMode==="paste" ? (
          <textarea style={styles.pasteArea} placeholder="Paste your resume text here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        ) : (
          <div style={styles.uploadZone(dragging)} onDragOver={(e) => {e.preventDefault();setDragging(true);}} onDragLeave={() => setDragging(false)} onDrop={(e) => {e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}} onClick={() => fileRef.current?.click()}>
            <div style={styles.uploadIcon}>📄</div>
            <div style={styles.uploadText}>{resumeText ? `✅ File loaded — ${resumeText.length} chars` : "Drop your resume or click to browse"}</div>
            <input ref={fileRef} type="file" accept=".txt,.md" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        )}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        <button style={styles.roastBtn(loading,loading)} onClick={roast} disabled={loading}>{loading ? "🔥 Roasting..." : "🔥 Roast My Resume"}</button>
        {!result && (
          <div style={styles.howRow}>
            {[{n:"1",t:"Paste your resume"},{n:"2",t:"AI reads it ruthlessly"},{n:"3",t:"Get roast + rewrite"},{n:"4",t:"Apply fixes. Get hired."}].map((h) => (
              <div key={h.n} style={styles.howCard}><div style={styles.howNum}>{h.n}</div><div style={styles.howTitle}>{h.t}</div></div>
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
              {activeTab==="rewrite" && <div><div style={{padding:"12px 20px 0"}}><button style={styles.copyBtn} onClick={copyRewrite}>{copied?"✅ Copied!":"Copy"}</button></div><div style={styles.cardBody}>{result.rewrite}</div></div>}
              {activeTab==="tips" && <div style={styles.cardBody}>{result.tips?.map((tip,i) => <div key={i} style={{marginBottom:"12px",display:"flex",gap:"10px"}}><span style={{color:GOLD}}>→</span><span>{tip}</span></div>)}</div>}
            </div>
            <button style={{...styles.roastBtn(false,false),background:"#1A1A1A",border:`1px solid ${BORDER}`,color:"#AAA"}} onClick={() => {setResult(null);setResumeText("");setError("");}}>Roast Another Resume</button>
          </>
        )}
      </div>
      <footer style={styles.footer}>RESUME ROASTER · AI-POWERED · {new Date().getFullYear()}</footer>
    </div>
  );
    }
