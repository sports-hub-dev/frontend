import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import MAP from "./mapData";

const AMBER = "#F2A93B";
const BLUE = "#5AB0FF";
const HQ = { x: 232, y: 114.7 };
const RIYADH = { x: 659.1, y: 305.8 };

const COUNTRIES = [
  { k: "eg", name: "Egypt", dsp: true, desc: "Biker & 4-wheeler uniforms, jackets, safety vests and helmets", cap: "Up to 30,000 units annually", pct: 23 },
  { k: "sa", name: "Saudi Arabia", dsp: true, desc: "Scalable production capacity to meet fluctuating demand", cap: "Up to 90,000 units annually", pct: 69 },
  { k: "ae", name: "United Arab Emirates", dsp: true, desc: "Regional inventory pinning for fast, reliable delivery", cap: "Up to 130,000 units annually", pct: 100 },
  { k: "kw", name: "Kuwait", desc: "[Uniforms and workwear you supply in Kuwait, and for which industries]" },
  { k: "bh", name: "Bahrain", desc: "[Uniforms and workwear you supply in Bahrain, and for which industries]" },
  { k: "qa", name: "Qatar", desc: "[Uniforms and workwear you supply in Qatar, and for which industries]" },
];

const SITES = {
  eg: {
    ...HQ, title: "Sports Hub HQ", kicker: "Headquarters · Alexandria",
    address: "134 Tawoynat Smouha, First Floor, Alexandria, Egypt",
    url: "https://www.google.com/maps/search/?api=1&query=134+Tawoynat+Smouha+Alexandria+Egypt",
    photo: "/images/factory-embroidery-line.webp", zoomLabel: "Zoom to HQ",
  },
  sa: {
    ...RIYADH, title: "Riyadh warehouse", kicker: "Warehouse · Riyadh",
    address: "Al Ghanamiyah, Riyadh 14512, Saudi Arabia",
    url: "https://maps.app.goo.gl/fPpvQNTc5JTwEhcU9", photo: null, zoomLabel: "Zoom to warehouse",
  },
};

// Warehouse beacons. Egypt and UAE are placeholders until exact locations are confirmed.
const WAREHOUSES = [
  { x: HQ.x, y: HQ.y, label: "EGYPT WAREHOUSE", anchor: "end", dx: -16, dy: 24 },
  { x: RIYADH.x, y: RIYADH.y, label: "KSA WAREHOUSE", anchor: "end", dx: -18, dy: -12 },
  { x: 872.8, y: 286.9, label: "UAE WAREHOUSE", anchor: "start", dx: 16, dy: 24 },
];

const LABELS = {
  eg: { dx: 0, dy: 30, a: "middle", t: "Egypt" },
  sa: { dx: 0, dy: 32, a: "middle", t: "Saudi Arabia" },
  ae: { dx: 16, dy: 6, a: "start", t: "UAE" },
  kw: { dx: -14, dy: -12, a: "end", t: "Kuwait" },
  bh: { dx: -14, dy: -10, a: "end", t: "Bahrain" },
  qa: { dx: 0, dy: 30, a: "middle", t: "Qatar" },
};

const arcPath = (k) => {
  const [x, y] = MAP.cities[k];
  const dist = Math.hypot(x - HQ.x, y - HQ.y);
  return `M${HQ.x} ${HQ.y} Q${((HQ.x + x) / 2).toFixed(1)} ${((HQ.y + y) / 2 - dist * 0.32).toFixed(1)} ${x} ${y}`;
};

const Pin = ({ x, y, title, sub, visible }) => (
  <g opacity={visible ? 1 : 0} style={{ transition: "opacity .5s ease .7s", pointerEvents: "none" }}>
    <ellipse cx={x} cy={y + 0.3} rx="9" ry="3" fill="#000" opacity=".5" />
    {[0, 0.9, 1.8].map((d) => (
      <circle key={d} className="sh-radar" cx={x} cy={y} r="5" fill="none" stroke={AMBER} strokeWidth=".8" style={{ animationDelay: `${d}s` }} />
    ))}
    <rect className="sh-beam" x={x - 1.6} y={y - 114.7} width="3.2" height="98" fill="url(#sh-beamg)" />
    <path d={`M${x} ${y}c-6-8-9-12-9-16a9 9 0 0 1 18 0c0 4-3 8-9 16z`} fill={AMBER} stroke="#060A14" strokeWidth="1" />
    <circle cx={x} cy={y - 16.2} r="3.2" fill="#060A14" />
    <text x={x + 12} y={y - 15.7} fontSize="7.5" fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif" paintOrder="stroke" stroke="#060A14" strokeWidth="2">{title}</text>
    <text x={x + 12} y={y - 6.7} fontSize="5" fill="#C9D1E0" fontFamily="Inter, sans-serif" paintOrder="stroke" stroke="#060A14" strokeWidth="1.5">{sub}</text>
  </g>
);

const RegionMap = ({ warehousesOn, onToggleWarehouses }) => {
  const [sel, setSel] = useState("eg");
  const [zoom, setZoom] = useState(null);
  const [flip, setFlip] = useState(0);

  const pick = (k) => {
    setSel(k);
    setFlip((n) => n + 1);
    setZoom(SITES[k] ? k : null);
  };

  const zt = zoom && zoom === sel ? zoom : null;
  const target = zt ? SITES[zt] : null;
  const site = SITES[sel];
  const cur = COUNTRIES.find((c) => c.k === sel);
  const [ax, ay] = MAP.cities.Alexandria;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-6 text-sm text-navy-100">
        <span className="flex items-center gap-2.5"><span className="block h-[3px] w-7 rounded bg-amber" />Amazon DSP uniforms &amp; PPE</span>
        <span className="flex items-center gap-2.5"><span className="block h-[3px] w-7 rounded" style={{ background: BLUE }} />Uniforms &amp; workwear</span>
      </div>

      <div id="sh-map" className="relative scroll-mt-24" style={{ perspective: 1800 }}>
        <div className="sh-tilt relative overflow-hidden rounded-[28px] border border-navy-700 shadow-[0_40px_90px_rgba(0,0,0,.55)]">
          <div style={{ transformOrigin: "50% 52%", transition: "transform 1.6s cubic-bezier(.65,0,.25,1)", transform: target ? "perspective(1400px) rotateX(38deg) scale(1.22)" : "none" }}>
            <svg viewBox="0 0 1100 640" role="img" aria-label="Map of Sports Hub delivery from Alexandria to Egypt, Saudi Arabia, the UAE, Kuwait, Bahrain and Qatar" className="block h-auto w-full">
              <defs>
                <linearGradient id="sh-beamg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={AMBER} stopOpacity="0" />
                  <stop offset="1" stopColor="#FFD58A" stopOpacity=".9" />
                </linearGradient>
                <pattern id="sh-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                  <path d="M44 0H0V44" fill="none" stroke="#0E1A30" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1100" height="640" fill="#060C1A" />
              <rect width="1100" height="640" fill="url(#sh-grid)" />
              <g style={{ transformOrigin: "0 0", transition: "transform 1.8s cubic-bezier(.65,0,.25,1)", transform: target ? `translate(550px, 330px) scale(3.4) translate(-${target.x}px, -${target.y - 4.7}px)` : "none" }}>
                <g fill="#0F1A2E" stroke="#1E2C48" strokeWidth="1">
                  {MAP.context.map((d, i) => <path key={i} d={d} />)}
                </g>
                {COUNTRIES.map((c) => {
                  const col = c.dsp ? AMBER : BLUE;
                  const isSel = sel === c.k;
                  return (
                    <path
                      key={c.k}
                      className="sh-land"
                      d={MAP.lands[c.k]}
                      fill={c.dsp ? (isSel ? "#7A5418" : "#3B2C12") : isSel ? "#1F5A92" : "#13304F"}
                      stroke={col}
                      strokeWidth="1.2"
                      onClick={() => pick(c.k)}
                    />
                  );
                })}
                <g aria-hidden="true">
                  {MAP.nile.map((d, i) => (
                    <g key={i}>
                      <path d={d} fill="none" stroke="#3E7CC9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity=".25" />
                      <path className="sh-nile" d={d} fill="none" stroke="#7FB6F0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ))}
                  {MAP.lights.map(([x, y, sz, sv], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r={sz * 2.6} fill={sv ? "#FFD58A" : "#8494B8"} opacity={sv ? 0.16 : 0.08} />
                      <circle className="sh-twinkle" cx={x} cy={y} r={sz * 0.9} fill={sv ? "#FFD58A" : "#8494B8"} style={{ animationDelay: `-${(i * 0.73) % 4}s` }} />
                    </g>
                  ))}
                </g>
                {COUNTRIES.filter((c) => c.k !== "eg").map((c, i) => {
                  const d = arcPath(c.k);
                  const col = c.dsp ? AMBER : BLUE;
                  return (
                    <g key={c.k} aria-hidden="true">
                      <path className="sh-arcdraw" d={d} pathLength="1" strokeDasharray="1" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" />
                      <path className="sh-flow" d={d} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 90" />
                      <circle className="sh-packet" r="4.5" fill={col} style={{ offsetPath: `path('${d}')`, animationDelay: `-${i * 0.9}s` }} />
                    </g>
                  );
                })}
                <g opacity={zt === "eg" ? 0 : 1} style={{ transition: "opacity .4s ease" }}>
                  <rect x={ax - 6} y={ay - 6} width="12" height="12" rx="2" fill="#fff" transform={`rotate(45 ${ax} ${ay})`} />
                  <text x={ax - 14} y={ay - 14} textAnchor="end" fill="#C9D1E0" fontSize="13" fontWeight="600" letterSpacing="1.5" fontFamily="Inter, sans-serif" paintOrder="stroke" stroke="#060A14" strokeWidth="4">HQ · ALEXANDRIA</text>
                </g>
                {COUNTRIES.map((c) => {
                  const [x, y] = MAP.cities[c.k];
                  const l = LABELS[c.k];
                  const col = c.dsp ? AMBER : BLUE;
                  const hidden = zt === c.k;
                  return (
                    <g key={c.k} opacity={hidden ? 0 : 1} onClick={() => pick(c.k)} style={{ cursor: "pointer" }}>
                      <circle className="sh-ping" cx={x} cy={y} r="9" fill={col} />
                      <circle cx={x} cy={y} r="5.5" fill={col} stroke="#060A14" strokeWidth="2" />
                      <text x={x + l.dx} y={y + l.dy} textAnchor={l.a} fill="#fff" fontSize="16" fontWeight="600" fontFamily="Inter, sans-serif" paintOrder="stroke" stroke="#060A14" strokeWidth="4">{l.t}</text>
                    </g>
                  );
                })}
                <g opacity={warehousesOn ? 1 : 0} style={{ transition: "opacity .7s ease", pointerEvents: "none" }}>
                  {WAREHOUSES.map((w) => (
                    <g key={w.label}>
                      <circle cx={w.x} cy={w.y} r="26" fill="#FFD58A" opacity=".18" />
                      <circle className="sh-radar" cx={w.x} cy={w.y} r="6" fill="none" stroke="#FFD58A" strokeWidth="1.5" />
                      <circle className="sh-radar" cx={w.x} cy={w.y} r="6" fill="none" stroke="#FFD58A" strokeWidth="1.5" style={{ animationDelay: "1.2s" }} />
                      <rect className="sh-beam" x={w.x - 2.5} y={w.y - 120} width="5" height="120" fill="url(#sh-beamg)" />
                      <circle cx={w.x} cy={w.y} r="7" fill="#FFF4D6" stroke={AMBER} strokeWidth="2" />
                      <text x={w.x + w.dx} y={w.y + w.dy} textAnchor={w.anchor} fill="#FFD58A" fontSize="13" fontWeight="700" letterSpacing="1" fontFamily="Inter, sans-serif" paintOrder="stroke" stroke="#060A14" strokeWidth="4">{w.label}</text>
                    </g>
                  ))}
                </g>
                <Pin x={HQ.x} y={HQ.y} title="Sports Hub HQ" sub="134 Tawoynat Smouha, First Floor, Alexandria" visible={zt === "eg"} />
                <Pin x={RIYADH.x} y={RIYADH.y} title="Riyadh warehouse" sub="Al Ghanamiyah, Riyadh 14512" visible={zt === "sa"} />
              </g>
            </svg>
          </div>
          <div className="sh-sweep" aria-hidden="true" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-1000" style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 35%, rgba(6,10,20,.85) 100%)", opacity: target ? 1 : 0 }} />

          {warehousesOn && (
            <div className="sh-info absolute left-5 top-5 flex items-center gap-2.5 rounded-full border border-amber bg-navy-ink/90 px-4 py-2.5 text-[13px] font-semibold">
              <span className="block h-2 w-2 rounded-full bg-[#FFD58A] shadow-[0_0_10px_#FFD58A]" />
              Our warehouses: Egypt · KSA · UAE
              <button onClick={onToggleWarehouses} aria-label="Turn off warehouse lights" className="ml-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy-700">×</button>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-5 left-5 hidden max-w-[calc(100%-40px)] flex-wrap gap-2 sm:flex">
            {[["1-month", "lead time"], ["250K+", "units a year"], ["2x to 3x", "peak scaling"]].map(([b, t], i) => (
              <span key={b} className="sh-glass" style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
                <strong className="text-lg text-amber">{b}</strong> {t}
              </span>
            ))}
          </div>

          {target && site && (
            <div className="sh-hqcard absolute right-5 top-5 w-[300px] max-w-[calc(100%-40px)] overflow-hidden rounded-[20px] border border-navy-500 bg-navy-ink/95 shadow-[0_24px_60px_rgba(0,0,0,.6)]">
              {site.photo ? (
                <img src={site.photo} alt="Sports Hub production floor" className="sh-kb block h-[140px] w-full object-cover" />
              ) : (
                <div className="flex h-[140px] items-center justify-center border-b border-dashed border-navy-500 bg-navy-900 text-[13px] text-navy-300">Photo coming soon</div>
              )}
              <div className="flex flex-col gap-2.5 p-[18px]">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber">{site.kicker}</span>
                <span className="font-editorial text-[22px] font-semibold text-white">{site.title}</span>
                <span className="text-sm leading-normal text-navy-100">{site.address}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2">
                  <a href={site.url} target="_blank" rel="noreferrer" className="rounded-full bg-amber px-3.5 py-2.5 text-[13px] font-semibold text-navy-900">Directions</a>
                  <Link to={ROUTES.CONTACT} className="rounded-full border border-navy-500 px-3.5 py-2.5 text-[13px] font-semibold text-white">Contact us</Link>
                  <button onClick={() => setZoom(null)} className="min-h-[38px] text-[13px] text-navy-100 underline">Back to region</button>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-[18px]">
        <div key={flip} className="sh-info flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 rounded-[22px] border border-navy-700 bg-navy-900 p-7">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-editorial text-3xl font-semibold">{cur.name}</h3>
            {cur.dsp ? (
              <span className="rounded-full border border-amber/50 bg-amber/15 px-3 py-1.5 text-xs font-bold tracking-wide text-amber">Amazon DSP</span>
            ) : (
              <span className="rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide" style={{ color: "#8CC8FF", borderColor: "rgba(90,176,255,.45)", background: "rgba(90,176,255,.12)" }}>Uniforms &amp; workwear</span>
            )}
          </div>
          <p className="text-base leading-relaxed text-navy-100">{cur.desc}</p>
          {cur.cap && (
            <>
          <div className="h-2.5 overflow-hidden rounded bg-navy-700">
            <div className="sh-grow h-full rounded bg-amber" style={{ width: `${cur.pct}%` }} />
          </div>
          <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-amber">{cur.cap}</span>
            </>
          )}
          {site && (
            <div className="mt-1.5 flex flex-col gap-3.5 border-t border-navy-700 pt-[18px]">
              <span className="text-[15px] leading-normal"><strong>{site.title}</strong><br />{site.address}</span>
              <span className="flex flex-wrap gap-2.5">
                <a href={site.url} target="_blank" rel="noreferrer" className="rounded-full bg-amber px-5 py-3 text-sm font-semibold text-navy-900">Open in Google Maps</a>
                <button onClick={() => setZoom(zt ? null : sel)} className="min-h-[44px] rounded-full border-[1.5px] border-navy-500 px-[18px] text-sm font-semibold">
                  {zt ? "Back to region" : site.zoomLabel}
                </button>
              </span>
            </div>
          )}
        </div>
        <div className="grid min-w-0 flex-[1_1_420px] grid-cols-2 content-start gap-2.5 sm:grid-cols-3">
          {COUNTRIES.map((c) => {
            const on = sel === c.k;
            const col = c.dsp ? AMBER : BLUE;
            return (
              <button
                key={c.k}
                onClick={() => pick(c.k)}
                aria-pressed={on}
                className="flex min-h-[48px] items-center gap-2.5 rounded-[14px] px-3.5 py-2.5 text-left text-sm font-semibold"
                style={{ background: on ? "#1B2A4A" : "#0A1324", border: `1.5px solid ${on ? col : "#1B2A4A"}` }}
              >
                <span className="block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: col }} />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RegionMap;
