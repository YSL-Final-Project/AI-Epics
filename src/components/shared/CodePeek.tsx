import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';

// ── Syntax Highlighter ────────────────────────────────────────────────────────

const KW = new Set([
  'import','export','from','default','const','let','var','function','return',
  'if','else','for','while','do','class','extends','new','this','super',
  'interface','type','enum','async','await','yield',
  'true','false','null','undefined','void','typeof','instanceof',
  'try','catch','finally','throw','switch','case','break','continue',
  'static','public','private','readonly','as','of','in','with',
  'useEffect','useRef','useState','useTransform','useScroll',
  'useMotionValueEvent','useReducedMotion','useId',
]);

const TC: Record<string, string> = {
  kw:    '#ff79c6',
  type:  '#8be9fd',
  str:   '#f1fa8c',
  num:   '#bd93f9',
  cmt:   '#6272a4',
  fn:    '#50fa7b',
  prop:  '#ffb86c',
  tag:   '#ff79c6',
  plain: '#f8f8f2',
  punct: '#f8f8f299',
};

interface Tok { t: string; v: string }

function tokenizeLine(line: string): Tok[] {
  const res: Tok[] = [];
  let i = 0;
  const n = line.length;
  while (i < n) {
    if (line[i] === '/' && line[i + 1] === '/') { res.push({ t: 'cmt', v: line.slice(i) }); break; }
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const q = line[i]; let j = i + 1;
      while (j < n) { if (line[j] === '\\') { j += 2; continue; } if (line[j] === q) { j++; break; } j++; }
      res.push({ t: 'str', v: line.slice(i, j) }); i = j; continue;
    }
    if (line[i] === '<' && line[i + 1] === '/') {
      let j = i; while (j < n && line[j] !== '>') j++;
      res.push({ t: 'tag', v: line.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (line[i] === '<' && line[i + 1] && /[A-Za-z]/.test(line[i + 1])) {
      let j = i + 1; while (j < n && /[A-Za-z0-9.]/.test(line[j])) j++;
      res.push({ t: 'tag', v: line.slice(i, j) }); i = j; continue;
    }
    if (/[0-9]/.test(line[i]) && (i === 0 || !/[A-Za-z_$]/.test(line[i - 1]))) {
      let j = i; while (j < n && /[0-9._xXa-fA-F]/.test(line[j])) j++;
      res.push({ t: 'num', v: line.slice(i, j) }); i = j; continue;
    }
    if (/[A-Za-z_$]/.test(line[i])) {
      let j = i; while (j < n && /[A-Za-z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j); let k = j; while (k < n && line[k] === ' ') k++;
      if (KW.has(word)) res.push({ t: 'kw', v: word });
      else if (/^[A-Z]/.test(word)) res.push({ t: 'type', v: word });
      else if (line[k] === '(') res.push({ t: 'fn', v: word });
      else res.push({ t: 'plain', v: word });
      i = j; continue;
    }
    if (line[i] === '.' && line[i + 1] && /[A-Za-z_$]/.test(line[i + 1])) {
      let j = i + 1; while (j < n && /[A-Za-z0-9_$]/.test(line[j])) j++;
      res.push({ t: 'prop', v: line.slice(i, j) }); i = j; continue;
    }
    if (/[{}()[\];,<>]/.test(line[i])) { res.push({ t: 'punct', v: line[i] }); i++; continue; }
    res.push({ t: 'plain', v: line[i] }); i++;
  }
  return res;
}

function CodeHighlight({ code }: { code: string }) {
  const lines = code.split('\n');
  const lineNumWidth = String(lines.length).length;
  return (
    <pre style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace", fontSize: 12.5, lineHeight: 1.7, margin: 0, padding: '16px 20px', overflowX: 'auto', tabSize: 2 }}>
      {lines.map((line, idx) => (
        <div key={idx} style={{ display: 'flex', minHeight: '1.7em' }} className="group hover:bg-white/[0.03] transition-colors duration-75 rounded">
          <span style={{ color: '#6272a4', userSelect: 'none', minWidth: `${lineNumWidth + 2}ch`, textAlign: 'right', paddingRight: '1.5ch', flexShrink: 0, fontSize: 11, lineHeight: 1.7 }}>{idx + 1}</span>
          <span style={{ flex: 1 }}>{tokenizeLine(line).map((t, j) => <span key={j} style={{ color: TC[t.t] ?? TC.plain }}>{t.v}</span>)}</span>
        </div>
      ))}
    </pre>
  );
}

// ── Hand-drawn hint SVG ───────────────────────────────────────────────────────

/** A sketchy pointing hand (index finger down) */
function HandSVG({ color = 'white' }: { color?: string }) {
  return (
    <svg viewBox="0 0 28 38" width="22" height="30" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {/* Index finger */}
      <path d="M12 32 C12 32 12 18 12 11 C12 7.5 13 6 14 6 C15 6 16 7.5 16 11 L16 20" strokeWidth="2.2"/>
      {/* Middle finger */}
      <path d="M16 20 C16 20 16 12 16 10 C16 7.5 17 6.5 18.5 6.5 C20 6.5 20.5 8 20.5 10 L20.5 24" strokeWidth="2.2"/>
      {/* Ring finger */}
      <path d="M20.5 24 C20.5 24 20.5 16 20.5 14 C20.5 12 21.5 11 22.5 11 C24 11 24.5 12.5 24.5 14 L24.5 26" strokeWidth="2.2"/>
      {/* Thumb */}
      <path d="M12 24 C12 24 9.5 22 8.5 18.5 C7.5 15 9.5 13.5 11 14.5 L12 18" strokeWidth="2.2"/>
      {/* Palm */}
      <path d="M8.5 28 C8.5 34.5 24.5 34.5 24.5 26" strokeWidth="2.2"/>
    </svg>
  );
}

/** A hand pointing upward (for close hint) */
function HandUpSVG({ color = 'white' }: { color?: string }) {
  return (
    <svg viewBox="0 0 28 38" width="18" height="26" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleY(-1)' }}>
      <path d="M12 32 C12 32 12 18 12 11 C12 7.5 13 6 14 6 C15 6 16 7.5 16 11 L16 20" strokeWidth="2.2"/>
      <path d="M16 20 C16 20 16 12 16 10 C16 7.5 17 6.5 18.5 6.5 C20 6.5 20.5 8 20.5 10 L20.5 24" strokeWidth="2.2"/>
      <path d="M20.5 24 C20.5 24 20.5 16 20.5 14 C20.5 12 21.5 11 22.5 11 C24 11 24.5 12.5 24.5 14 L24.5 26" strokeWidth="2.2"/>
      <path d="M12 24 C12 24 9.5 22 8.5 18.5 C7.5 15 9.5 13.5 11 14.5 L12 18" strokeWidth="2.2"/>
      <path d="M8.5 28 C8.5 34.5 24.5 34.5 24.5 26" strokeWidth="2.2"/>
    </svg>
  );
}

// ── Hand Hint Badge (open prompt) ─────────────────────────────────────────────

function HandHint({ visible, labels }: { visible: boolean; labels: { clickExpand: string; viewCode: string } }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {/* Sketchy speech bubble */}
          <div style={{
            background: 'rgba(13,17,23,0.92)',
            border: '1.5px solid rgba(80,250,123,0.3)',
            borderRadius: 10,
            padding: '5px 10px 5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(80,250,123,0.1)',
            // Slight tilt for hand-drawn feel
            transform: 'rotate(-1.5deg)',
            position: 'relative',
          }}>
            {/* Bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              right: 18,
              width: 10,
              height: 6,
              overflow: 'hidden',
            }}>
              <div style={{
                width: 10,
                height: 10,
                background: 'rgba(13,17,23,0.92)',
                border: '1.5px solid rgba(80,250,123,0.3)',
                transform: 'rotate(45deg)',
                transformOrigin: 'center',
                marginTop: -5,
              }} />
            </div>

            {/* Swinging hand */}
            <motion.div
              animate={{ x: [-5, 5, -5], rotate: [-8, 8, -8] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top center', display: 'flex' }}
            >
              <HandSVG color="#50fa7b" />
            </motion.div>

            {/* Text */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.03em',
              lineHeight: 1.3,
              textAlign: 'left',
            }}>
              <div style={{ color: '#50fa7b', fontWeight: 700, fontSize: 10 }}>{labels.clickExpand}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9.5 }}>{labels.viewCode}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Close Hint Badge (inside window) ─────────────────────────────────────────

function CloseHint({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{
        position: 'absolute',
        bottom: -34,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        zIndex: 10,
      }}
    >
      {/* Bouncing hand */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'flex' }}
      >
        <HandUpSVG color="rgba(255,255,255,0.4)" />
      </motion.div>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </motion.button>
  );
}

// ── CodePeek Component ────────────────────────────────────────────────────────

interface CodePeekProps {
  code: string;
  title: string;
  fileName: string;
  className?: string;
}

const RAINBOW =
  'conic-gradient(from 0deg, #ff79c6, #8be9fd, #50fa7b, #f1fa8c, #bd93f9, #ffb86c, #ff79c6)';

export default function CodePeek({
  code,
  title,
  fileName,
  className = 'absolute top-3 right-3 z-10',
}: CodePeekProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setHasOpened(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* ── Trigger + Hint ───────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className={className}
            style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
          >
            {/* Hand hint — shows until first open */}
            <HandHint visible={!hasOpened} labels={{ clickExpand: t.codePeek.clickExpand, viewCode: t.codePeek.viewCode }} />

            {/* Trigger pill */}
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                background: 'rgba(13,17,23,0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.45)',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(139,233,253,0.35)';
                el.style.color = 'rgba(139,233,253,0.9)';
                el.style.boxShadow = '0 2px 20px rgba(139,233,253,0.15)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.12)';
                el.style.color = 'rgba(255,255,255,0.45)';
                el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.4)';
              }}
            >
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#50fa7b', display: 'block', animation: 'codePeekPulse 2s ease-in-out infinite' }} />
              </span>
              &lt;/&gt; {fileName}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Code Window (Portal) ───────────────────── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 z-[9998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
                  onClick={handleClose}
                />

                {/* Window wrapper */}
                <motion.div
                  className="fixed z-[9999]"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: 'min(680px, 92vw)',
                    borderRadius: 13,
                    padding: 1.5,
                    background: RAINBOW,
                    boxShadow: '0 30px 80px rgba(0,0,0,0.75), 0 0 50px rgba(139,92,246,0.12), 0 0 100px rgba(80,250,123,0.06)',
                    animation: 'codePeekSpin 6s linear infinite',
                  }}
                  initial={{ x: '-50%', y: '-50%', clipPath: 'inset(0 50% 100% 50% round 13px)', opacity: 0, scale: 0.92 }}
                  animate={{ x: '-50%', y: '-50%', clipPath: 'inset(0 0% 0% 0% round 13px)', opacity: 1, scale: 1 }}
                  exit={{
                    x: '-50%', y: '-50%',
                    clipPath: ['inset(0 0% 0% 0% round 13px)', 'inset(0 5% 0% 5% round 13px)', 'inset(0 50% 100% 50% round 13px)'],
                    opacity: [1, 1, 0],
                    scale: [1, 0.98, 0.92],
                    transition: { duration: 0.4, times: [0, 0.3, 1], ease: [0.55, 0, 1, 0.45] },
                  }}
                  drag
                  dragMomentum={false}
                  dragConstraints={{ left: -400, right: 400, top: -250, bottom: 250 }}
                >
                  {/* Inner window */}
                  <div style={{ borderRadius: 11.5, background: '#0d1117', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '72vh', position: 'relative' }}>

                    {/* ── Title Bar ── */}
                    <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'grab', userSelect: 'none', flexShrink: 0 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={handleClose}
                          title={t.codePeek.closeWindow}
                          style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0, boxShadow: '0 0 6px rgba(255,95,87,0.5)' }}
                        />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', boxShadow: '0 0 6px rgba(254,188,46,0.4)' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', boxShadow: '0 0 6px rgba(40,200,64,0.4)' }} />
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'rgba(255,255,255,0.35)', flex: 1, textAlign: 'center', letterSpacing: '0.04em' }}>
                        {fileName}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#50fa7b', background: 'rgba(80,250,123,0.08)', border: '1px solid rgba(80,250,123,0.2)', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.05em' }}>
                        {title}
                      </span>
                    </div>

                    {/* ── Code Area ── */}
                    <div style={{ overflow: 'auto', flex: 1 }}>
                      <CodeHighlight code={code} />
                    </div>

                    {/* ── Footer ── */}
                    <div style={{ background: '#161b22', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>
                        {code.split('\n').length} lines · TypeScript · React
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.08em' }}>
                        {t.codePeek.dragHint}
                      </span>
                    </div>
                  </div>

                  {/* ── Close Hint (below window) ── */}
                  <CloseHint onClose={handleClose} label={t.codePeek.collapse} />
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
