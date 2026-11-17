import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useReveal } from "../../hooks/useReveal";
import HeroCarousel from "../../components/ui/HeroCarousel";
import logo from "../../assets/logo.png";

const IMG_VISIBILITY = "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385598/8cd4d8c7-8f28-4fa9-984e-ae7f467260d1.png";
const IMG_PADEL = "https://res.cloudinary.com/dsfa43amy/image/upload/v1785761159/Padel_r2sgcp.png";
const IMG_JACKET = "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385791/2ca85078-9dd2-42c6-84d6-7af661d0c56c.png";
const IMG_TRUCK = "https://res.cloudinary.com/dsfa43amy/image/upload/v1784941567/752652639_1573384814500064_6403601339349822122_n_dr8opg.jpg";

const HERO_IMAGES = [
  "https://res.cloudinary.com/dsfa43amy/image/upload/v1784941567/748948191_2068249790565558_6777729908389190862_n_vqpqh3.jpg",
  IMG_TRUCK,
  "https://res.cloudinary.com/dsfa43amy/image/upload/v1784941567/751665757_1427493726067978_4485987897282091929_n_bkduzc.jpg",
  "/images/hero-embroidery-row.webp",
  "/images/hero-cutting.webp",
];

const BADGES = [
  "Oeko-Tex 100 Certified",
  "EN ISO 20471 Compliant",
  "1-Month Lead Time",
  "Egypt · Saudi Arabia · UAE · Kuwait · Bahrain · Qatar",
];

const STORY_PANELS = [
  {
    eyebrow: "Visibility",
    title: "Seen from every angle.",
    copy: "Reflective trims and high-contrast panels are placed exactly where drivers need to be seen most — keeping every last-mile route safer, day or night.",
    image: IMG_VISIBILITY,
    alt: "Sports Hub hi-vis uniform worn by a driver",
    card: "bg-navy-900 text-white",
    eyebrowColor: "text-amber",
    copyColor: "text-navy-100",
    imageBox: "bg-navy-500 items-end",
    imageClass: "h-full max-h-[520px] w-auto",
    top: "md:top-24",
  },
  {
    eyebrow: "Padel",
    title: "Designed for the fastest-growing sport.",
    copy: "From performance apparel to custom teamwear and accessories, Sportshub delivers premium padel solutions for clubs, academies, tournaments, and players.",
    image: IMG_PADEL,
    alt: "Sports Hub padel performance shirt",
    card: "bg-white text-navy-900",
    eyebrowColor: "text-amber-700",
    copyColor: "text-navy-500",
    imageBox: "bg-navy-50 items-center",
    imageClass: "h-auto w-[88%] max-w-[500px]",
    reversed: true,
    top: "md:top-32",
  },
  {
    eyebrow: "Durability",
    title: "Made to outlast the route.",
    copy: "Every stitch and seam is tested against the realities of daily wear, so the uniform still looks sharp long after day one.",
    image: IMG_JACKET,
    alt: "Sports Hub insulated delivery jacket",
    card: "bg-amber text-navy-900",
    eyebrowColor: "text-navy-900",
    copyColor: "text-navy-700",
    imageBox: "bg-[#F4F4F4] items-center",
    imageClass: "h-full max-h-[520px] w-auto",
    top: "md:top-40",
  },
];

const QUOTE =
  "“Every garment we send out is judged by the same standard — would it hold up on a real route, in real weather, for a full shift.”";

const ICONS = {
  vest: (
    <>
      <path d="M8 3 4.5 5.5V21h6v-7h3v7h6V5.5L16 3l-2 4h-4z" />
      <path d="M4.5 12h6M13.5 12h6M4.5 16h6M13.5 16h6" />
    </>
  ),
  shoe: (
    <>
      <path d="M3 17V10l4-.5L10 5h3l1 4 5.5 2.5A2.5 2.5 0 0 1 21 14v3z" />
      <path d="M3 20h18M7 9.5V13M10.5 9v4" />
    </>
  ),
  helmet: (
    <>
      <path d="M4 16a8 8 0 0 1 16 0v1.5H4z" />
      <path d="M12 8v4M8.5 9.5l1.5 3M15.5 9.5l-1.5 3M2.5 17.5h19" />
    </>
  ),
};

const CATEGORIES = [
  { name: "Amazon Uniform", image: IMG_VISIBILITY, box: "bg-navy-500 items-end", img: "h-full w-auto", drop: "mt-1.5", delay: "-0.4s" },
  { name: "Padel", image: IMG_PADEL, box: "bg-navy-50 items-center", img: "h-auto w-full", drop: "mt-5", delay: "-1.3s" },
  { name: "Vest", icon: "vest", drop: "mt-8", delay: "-2.1s" },
  { name: "Safety Shoes", icon: "shoe", drop: "mt-8", delay: "-0.9s" },
  { name: "Jackets", image: IMG_JACKET, box: "bg-[#F4F4F4] items-center", img: "h-full w-auto", drop: "mt-5", delay: "-1.8s" },
  { name: "Helmets", icon: "helmet", drop: "mt-1.5", delay: "-2.7s" },
];

const GATE_KEY = "sh_gate_seen";

/** Decide once, on first render, whether to play the zipper entrance this visit. */
const shouldPlayGate = () => {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (window.sessionStorage.getItem(GATE_KEY)) return false;
    window.sessionStorage.setItem(GATE_KEY, "1");
  } catch (e) {
    // Storage blocked (private mode): still play it.
  }
  return true;
};

const useCountUp = (target, start) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1600, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return value;
};

const Stat = ({ target, suffix, label, start, first }) => {
  const value = useCountUp(target, start);
  return (
    <div className={`flex flex-col gap-2.5 border-l-2 px-8 py-5 ${first ? "border-amber" : "border-navy-700"}`}>
      <span className="font-editorial text-6xl font-semibold leading-none text-amber lg:text-7xl">
        {value}
        {suffix}
      </span>
      <span className="text-[15px] text-navy-100">{label}</span>
    </div>
  );
};

const ZipperGate = () => (
  <div className="sh-gate" aria-hidden="true">
    <div className="sh-half sh-half-l">
      <div className="sh-cloth sh-cloth-l">
        <div className="sh-reflect" />
        <div className="sh-tape" style={{ right: 0 }} />
        <div className="sh-teeth-l" />
        <div className="absolute left-[14%] top-[15%] rounded-xl bg-white px-3.5 py-2.5 shadow-lift sm:left-[20%]">
          <img src={logo} alt="" className="block h-auto w-24 sm:w-36" />
        </div>
      </div>
    </div>
    <div className="sh-half sh-half-r">
      <div className="sh-cloth sh-cloth-r">
        <div className="sh-reflect" />
        <div className="sh-tape" style={{ left: 0 }} />
        <div className="sh-teeth-r" />
      </div>
    </div>
    <div className="sh-pull">
      <div className="h-11 w-[34px] rounded-b-[14px] rounded-t-[10px] border-2 border-[#8C94A3] bg-[#C3C9D4] shadow-lift" />
      <div className="mx-auto -mt-1.5 flex h-[70px] w-[22px] justify-center rounded-b-xl rounded-t border-2 border-[#7F8796] bg-[#A9B0BD] pt-11">
        <span className="block h-3.5 w-2 rounded bg-[#121212]" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [playGate] = useState(shouldPlayGate);
  const { ref: statsRef, isVisible: statsVisible } = useReveal({ threshold: 0.3 });
  const words = QUOTE.split(" ");
  const base = playGate ? "2.5s" : "0s";

  return (
    <div className="bg-navy-50">
      {/* ── Hero with zipper entrance ───────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-navy-ink text-white" style={{ "--sh-base": base }}>
        <HeroCarousel images={HERO_IMAGES} />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-ink/95 via-navy-ink/75 to-navy-ink/30" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-6 px-6 pb-28 pt-20 sm:px-8">
          <p className="sh-rise text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Sports Hub Collection</p>
          <h1 className="sh-rise max-w-4xl font-editorial text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl" style={{ "--sh-step": "0.15s" }}>
            Built like performance wear.
          </h1>
          <p className="sh-rise max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg" style={{ "--sh-step": "0.3s" }}>
            Professional uniforms and PPE for Egypt's delivery and logistics workforce.
          </p>
          <div className="sh-rise flex flex-col gap-3.5 sm:flex-row" style={{ "--sh-step": "0.45s" }}>
            <Link to={ROUTES.PRODUCTS} className="btn-transition rounded-full bg-amber px-8 py-4 text-center text-base font-semibold text-navy-900 hover:-translate-y-0.5 hover:bg-amber-300">
              Explore the Collection
            </Link>
            <Link to={ROUTES.REGISTER_VENDOR} className="btn-transition rounded-full border-[1.5px] border-white/40 px-8 py-4 text-center text-base font-semibold text-white hover:bg-white/10">
              DSP Partner
            </Link>
          </div>
        </div>

        {/* Certification ticker */}
        <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/15 bg-navy-ink/60 py-4">
          <div className="sh-track flex w-max gap-14 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
            {[0, 1].map((copy) =>
              BADGES.map((badge) => (
                <span key={`${copy}-${badge}`} aria-hidden={copy === 1} className="flex items-center gap-14">
                  {badge}
                  <span className="text-amber">◆</span>
                </span>
              ))
            )}
          </div>
        </div>

        {playGate && <ZipperGate />}
      </section>

      {/* ── Count-up stats ──────────────────────────────────────────────── */}
      <section ref={statsRef} className="border-t border-navy-700 bg-navy-900 px-6 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-6 md:grid-cols-3">
          <Stat first target={1} suffix="-month" label="Lead time from order to delivery" start={statsVisible} />
          <Stat target={6} suffix="" label="Countries served across Egypt and the Gulf" start={statsVisible} />
          <Stat target={250} suffix="K+" label="Combined annual unit capacity" start={statsVisible} />
        </div>
      </section>

      {/* ── Stacked story cards ─────────────────────────────────────────── */}
      <section className="px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-9">
          {STORY_PANELS.map((panel, i) => (
            <article
              key={panel.title}
              className={`sh-stackcard flex min-h-[520px] flex-col overflow-hidden rounded-[28px] shadow-lift md:sticky ${panel.top} ${panel.card} ${panel.reversed ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="flex flex-1 flex-col justify-center gap-5 p-8 sm:p-14">
                <span className={`text-[13px] font-semibold uppercase tracking-[0.22em] ${panel.eyebrowColor}`}>
                  0{i + 1} · {panel.eyebrow}
                </span>
                <h2 className="font-editorial text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl">{panel.title}</h2>
                <p className={`max-w-lg text-[17px] leading-relaxed ${panel.copyColor}`}>{panel.copy}</p>
              </div>
              <div className={`flex min-h-[340px] flex-1 justify-center overflow-hidden ${panel.imageBox}`}>
                <img src={panel.image} alt={panel.alt} loading="lazy" className={`sh-zoom block ${panel.imageClass}`} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Quote, revealed word by word on scroll ──────────────────────── */}
      <section className="sh-quote bg-navy-ink px-6 py-28 text-white sm:px-8 sm:py-40">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <p className="font-editorial text-3xl font-medium leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl">
            {words.map((word, i) => {
              const start = 18 + Math.round((i / words.length) * 40);
              return (
                <span key={`${word}-${i}`} className="sh-word" style={{ animationRange: `cover ${start}% cover ${start + 8}%` }}>
                  {word}{" "}
                </span>
              );
            })}
          </p>
          <div className="flex items-center gap-3.5">
            <span className="block h-0.5 w-10 bg-amber" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-navy-300">Sports Hub Product Team</span>
          </div>
        </div>
      </section>

      {/* ── Shop by line: categories on a clothes line ──────────────────── */}
      <section className="overflow-hidden bg-navy-900 pb-32 pt-24 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-5 px-6 sm:px-8">
          <div className="sh-reveal flex flex-col gap-3.5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Shop by Line</span>
            <h2 className="font-editorial text-4xl font-semibold leading-none sm:text-6xl">Pick it off the line.</h2>
          </div>
          <Link to={ROUTES.PRODUCTS} className="btn-transition rounded-full border-[1.5px] border-white/35 px-6 py-3.5 font-semibold text-white hover:bg-white/10">
            All products
          </Link>
        </div>
        <div className="mt-14 overflow-x-auto pb-10">
          <div className="relative mx-auto min-w-[1240px] max-w-[1440px] px-10">
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 top-0 h-[60px] w-full">
              <path d="M0 4 Q500 70 1000 4" fill="none" stroke="#8595BC" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="flex justify-between gap-4 pt-1.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.name)}`}
                  className={`sh-hang flex w-[180px] flex-col items-center text-navy-900 ${cat.drop}`}
                  style={{ animationDelay: cat.delay }}
                >
                  <span className="relative z-10 block h-[30px] w-3 rounded-[3px] bg-amber" />
                  <span className="sh-tag -mt-2.5 flex w-full flex-col gap-3 rounded-2xl bg-white p-3">
                    {cat.image ? (
                      <span className={`flex h-[180px] justify-center overflow-hidden rounded-[10px] ${cat.box}`}>
                        <img src={cat.image} alt="" loading="lazy" className={`block ${cat.img}`} />
                      </span>
                    ) : (
                      <span className="flex h-[180px] items-center justify-center rounded-[10px] bg-navy-900 text-amber">
                        <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          {ICONS[cat.icon]}
                        </svg>
                      </span>
                    )}
                    <span className="font-editorial text-xl font-semibold">{cat.name}</span>
                    <span className="text-[13px] font-semibold text-amber-700">Shop now →</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="bg-navy-50">
        <div className="sh-expand relative flex min-h-[600px] items-center justify-center overflow-hidden">
          <img src={IMG_TRUCK} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy-ink/75" />
          <div className="sh-reveal relative z-10 flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center text-white">
            <h2 className="font-editorial text-5xl font-semibold leading-none sm:text-7xl">Let's get you outfitted.</h2>
            <p className="text-lg leading-relaxed text-navy-100">
              Browse the full collection, or register your team as a DSP partner for vendor pricing and catalogue access.
            </p>
            <div className="flex w-full flex-col justify-center gap-3.5 sm:w-auto sm:flex-row">
              <Link to={ROUTES.PRODUCTS} className="btn-transition rounded-full bg-amber px-8 py-4 font-semibold text-navy-900 hover:-translate-y-0.5 hover:bg-amber-300">
                Explore the Collection
              </Link>
              <Link to={ROUTES.REGISTER_VENDOR} className="btn-transition rounded-full border-[1.5px] border-white/45 px-8 py-4 font-semibold text-white hover:bg-white/10">
                Register as a DSP
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
