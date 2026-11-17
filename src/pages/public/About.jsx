import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useReveal } from "../../hooks/useReveal";
import RegionMap from "../../components/about/RegionMap";
import useCountUp from "../../hooks/useCountUp";

const IMG = {
  visibility: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385598/8cd4d8c7-8f28-4fa9-984e-ae7f467260d1.png",
  jacket: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385791/2ca85078-9dd2-42c6-84d6-7af661d0c56c.png",
  truck: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784941567/752652639_1573384814500064_6403601339349822122_n_dr8opg.jpg",
  stock: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784941567/751665757_1427493726067978_4485987897282091929_n_bkduzc.jpg",
};

const PORTFOLIO = [
  { title: "Biker Uniforms", desc: "Long-sleeve t-shirts and pants, engineered for mobility and adaptive to the Gulf climate — Oeko-Tex 100 certified fabrics.", img: IMG.visibility, bg: "bg-navy-500", fit: "tall" },
  { title: "4-Wheeler Uniforms", desc: "Polo shirts and durable trousers designed for comfort during extended shifts behind the wheel.", img: IMG.truck, bg: "bg-navy-900", fit: "cover" },
  { title: "Jackets", desc: "All-weather protection with breathable, water-resistant finishes that keep riders dry and cool.", img: IMG.jacket, bg: "bg-[#F4F4F4]", fit: "tall" },
  { title: "Safety Vests", desc: "High-visibility, EN ISO 20471-compliant vests for on-road and warehouse environments.", bg: "bg-amber-700" },
  { title: "Safety Shoes", desc: "Impact- and slip-resistant footwear for delivery riders and warehouse staff alike.", bg: "bg-navy-700" },
  { title: "Helmets", desc: "Protective headgear manufactured in strict compliance with applicable safety and certification standards.", bg: "bg-navy-900" },
];

const photo = (src, cap, alt, w = 420) => ({ type: "photo", src, cap, alt, w });
const chapter = (word, ar, desc) => ({ type: "chapter", word, ar, desc });
const GALLERY = [
  { type: "intro" },
  photo("/images/factory-front.webp", "The factory, Egypt", "Front of the factory building", 460),
  chapter("Cut.", "قص", "Fabric is stacked, marked and cut in layers so every piece in an order matches."),
  photo("/images/hero-cutting.webp", "Layered cutting", "Worker cutting stacked navy fabric with a straight knife"),
  photo("/images/factory-cutting-glove.webp", "Cut-resistant gloves on every table", "Close-up of a cutter with a chain-mail glove"),
  photo("/images/factory-cutting-floor.webp", "The cutting floor", "Team working at the cutting tables", 460),
  chapter("Stitch.", "تطريز", "Multi-head machines embroider logos onto quilted jackets, many at once."),
  photo("/images/factory-embroidery-line.webp", "Embroidery line", "Row of multi-head embroidery machines", 460),
  photo("/images/factory-embroidery-closeup.webp", "Your logo, stitched in", "Embroidery head stitching a logo on navy fabric"),
  chapter("Finish.", "تشطيب", "Every jacket is pressed and checked before it leaves the floor."),
  photo("/images/factory-pressing.webp", "Pressing and final check", "Hands pressing a blue delivery jacket"),
  chapter("Pack.", "تعبئة", "Sorted by size and type, boxed, labelled and stored until it ships."),
  photo("/images/warehouse-made-in-egypt.webp", "Made in Egypt", "Labelled boxes in the warehouse"),
  photo("/images/warehouse-boxes.webp", "Ready to ship", "Sports Hub branded boxes stacked in the warehouse cage"),
  { type: "cta" },
];

const Stat = ({ target, suffix, label, start, first }) => {
  const value = useCountUp(target, start);
  return (
    <div className={`flex flex-col gap-2.5 border-l-2 px-8 py-5 ${first ? "border-amber" : "border-navy-500"}`}>
      <span className="font-editorial text-6xl font-semibold leading-none text-amber lg:text-[88px]">{value}{suffix}</span>
      <span className="text-[15px] text-navy-100">{label}</span>
    </div>
  );
};

const GalleryItem = ({ item }) => {
  if (item.type === "intro") {
    return (
      <div className="flex h-[560px] w-[440px] max-w-[85vw] shrink-0 flex-col justify-center gap-5 pr-5">
        <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Inside the Factory</span>
        <h2 className="font-editorial text-5xl font-semibold leading-none sm:text-6xl">From fabric to your team.</h2>
        <p className="text-[17px] leading-relaxed text-navy-100">Keep scrolling to follow a uniform through the line, from the cutting table to the box it ships in.</p>
      </div>
    );
  }
  if (item.type === "cta") {
    return (
      <div className="flex h-[560px] w-[420px] max-w-[85vw] shrink-0 flex-col justify-end gap-4 rounded-3xl bg-amber p-10 text-navy-900">
        <span className="font-editorial text-5xl font-semibold leading-none">Want to see it in person?</span>
        <span className="text-base leading-relaxed">Book a visit or ask for samples with your logo.</span>
        <Link to={ROUTES.CONTACT} className="self-start rounded-full bg-navy-900 px-6 py-3.5 font-semibold text-white">Contact us</Link>
      </div>
    );
  }
  if (item.type === "chapter") {
    return (
      <div className="flex h-[560px] w-[340px] max-w-[80vw] shrink-0 flex-col justify-between rounded-3xl border border-navy-700 bg-navy-900 p-9">
        <span className="text-right text-4xl font-bold text-navy-500" dir="rtl" lang="ar">{item.ar}</span>
        <span className="flex flex-col gap-4">
          <span className="font-editorial text-[88px] font-semibold leading-[0.9] text-amber">{item.word}</span>
          <span className="text-base leading-relaxed text-navy-100">{item.desc}</span>
        </span>
      </div>
    );
  }
  return (
    <figure className="sh-hs-frame relative m-0 h-[560px] max-w-[85vw] shrink-0 overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,.5)]" style={{ width: item.w }}>
      <img src={item.src} alt={item.alt} loading="lazy" className="block h-full w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-ink/90 to-transparent p-5 text-[15px] font-semibold text-white">{item.cap}</figcaption>
    </figure>
  );
};

const About = () => {
  const [openPanel, setOpenPanel] = useState(0);
  const [warehousesOn, setWarehousesOn] = useState(false);
  const { ref: statsRef, isVisible: statsVisible } = useReveal({ threshold: 0.3 });

  const toggleWarehouses = () => {
    setWarehousesOn((on) => {
      if (!on) document.getElementById("sh-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return !on;
    });
  };

  return (
    <div className="bg-navy-50">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[720px] items-end overflow-hidden bg-navy-ink text-white">
        <img src="/images/factory-embroidery-hall.webp" alt="Embroidery section of the Sports Hub factory" className="sh-kb absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-ink via-navy-ink/60 to-navy-ink/30" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-10 px-6 pb-20 sm:px-8">
          <div className="flex min-w-0 flex-[1_1_620px] flex-col gap-5">
            <span className="sh-mask"><span className="sh-line block text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Who We Are</span></span>
            <h1 className="font-editorial text-5xl font-semibold leading-none tracking-tight sm:text-7xl lg:text-[88px]">
              <span className="sh-mask"><span className="sh-line block">Personal protective</span></span>
              <span className="sh-mask"><span className="sh-line block" style={{ animationDelay: ".12s" }}>equipment, purpose-built</span></span>
              <span className="sh-mask"><span className="sh-line block" style={{ animationDelay: ".24s" }}>for delivery.</span></span>
            </h1>
          </div>
          <p className="sh-rise min-w-0 max-w-md flex-[1_1_360px] text-[17px] leading-relaxed text-navy-100" style={{ "--sh-step": ".4s" }}>
            Sports Hub specializes in delivering high-performance personal protective equipment (PPE) and uniforms to fulfil the specific needs of demanding environments. Our regional capabilities span Egypt, Saudi Arabia, and the United Arab Emirates (UAE) — manufactured and owned by controlled warehousing, ensuring a seamless and robust supply chain for Amazon's DSP operations. Beyond delivery, we supply uniforms and workwear to businesses in Kuwait, Bahrain and Qatar.
          </p>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-navy-900 px-6 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-6 md:grid-cols-3">
          <Stat first target={1} suffix="-month" label="Lead time from order to delivery" start={statsVisible} />
          <Stat target={6} suffix="" label="Countries served across Egypt and the Gulf" start={statsVisible} />
          <Stat target={250} suffix="K+" label="Combined annual unit capacity" start={statsVisible} />
        </div>
      </section>

      {/* ── Product portfolio: expanding panels ─────────────────────────── */}
      <section className="px-6 py-28 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="sh-reveal flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-amber-700">Scope Coverage</span>
              <h2 className="font-editorial text-4xl font-semibold leading-none text-navy-900 sm:text-6xl">Product Portfolio</h2>
            </div>
            <p className="max-w-md text-[17px] leading-relaxed text-navy-500">
              A full range of uniforms and PPE, engineered for performance, safety, and comfort — designed to hold up to the demands of daily delivery routes.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:min-h-[480px] md:flex-row">
            {PORTFOLIO.map((p, i) => {
              const open = openPanel === i;
              return (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => setOpenPanel(i)}
                  onMouseEnter={() => setOpenPanel(i)}
                  aria-expanded={open}
                  className={`sh-panel relative flex min-h-[160px] items-end overflow-hidden rounded-3xl p-7 text-left md:min-h-[480px] md:min-w-[110px] ${p.bg}`}
                  style={{ flexGrow: open ? 5 : 1, flexBasis: 0 }}
                >
                  {p.img && (
                    <img
                      src={p.img}
                      alt=""
                      className={`sh-panel-img absolute ${p.fit === "tall" ? "bottom-0 left-1/2 h-full w-auto -translate-x-1/2" : "inset-0 h-full w-full object-cover"}`}
                      style={{ opacity: open ? 1 : 0.45 }}
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-ink/90 via-navy-ink/20 to-transparent" />
                  <span className="relative flex flex-col gap-3">
                    <span className="text-[13px] font-bold tracking-[0.14em] text-amber">0{i + 1}</span>
                    <span className="font-editorial text-[26px] font-semibold leading-tight text-white">{p.title}</span>
                    {open && <span className="sh-panel-copy max-w-sm text-[15px] leading-relaxed text-navy-100">{p.desc}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Regional coverage map ───────────────────────────────────────── */}
      <section className="overflow-hidden bg-navy-ink px-6 py-28 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-11">
          <div className="sh-reveal flex max-w-3xl flex-col gap-3.5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Volume Readiness</span>
            <h2 className="font-editorial text-4xl font-semibold leading-none sm:text-6xl">Regional Coverage</h2>
            <p className="text-[17px] leading-relaxed text-navy-100">
              Our production model is built to scale 2x to 3x during peak periods, without compromising quality or delivery timelines.
            </p>
          </div>
          <RegionMap warehousesOn={warehousesOn} onToggleWarehouses={toggleWarehouses} />

          {/* Inside the operation */}
          <div className="mt-16 flex flex-col gap-6">
            <span className="sh-reveal text-[13px] font-semibold uppercase tracking-[0.22em] text-navy-300">Inside the Operation</span>
            <div className="sh-reel grid grid-cols-1 gap-5 md:grid-cols-3">
              <figure className="sh-shot relative m-0 h-[340px] -rotate-2 overflow-hidden rounded-3xl">
                <img src="/images/factory-embroidery-closeup.webp" alt="Embroidery machine stitching a logo on a quilted jacket" loading="lazy" className="block h-full w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-ink/90 to-transparent px-5 py-5 font-editorial text-[22px] font-semibold">Production floor</figcaption>
              </figure>
              <button
                type="button"
                onClick={toggleWarehouses}
                aria-pressed={warehousesOn}
                className={`sh-shot relative block h-[340px] w-full translate-y-0 rotate-[1.5deg] overflow-hidden rounded-3xl border-2 text-left md:translate-y-6 ${warehousesOn ? "border-amber" : "border-transparent"}`}
              >
                <img src="/images/warehouse-boxes.webp" alt="Sports Hub boxes in the warehouse cage" loading="lazy" className="block h-full w-full object-cover" />
                <span className="absolute right-3.5 top-3.5 flex items-center gap-2 rounded-full bg-navy-ink/85 px-3 py-1.5 text-xs font-semibold">
                  <span className={`sh-dotlive block h-2 w-2 rounded-full ${warehousesOn ? "bg-[#FFD58A]" : "bg-navy-300"}`} />
                  {warehousesOn ? "Lit on the map" : "Tap to light up on the map"}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 bg-gradient-to-t from-navy-ink/95 to-transparent px-5 py-5">
                  <span className="font-editorial text-[22px] font-semibold">Warehouse stock</span>
                  <span className="flex flex-wrap gap-1.5">
                    {["Egypt", "KSA", "UAE"].map((c) => <span key={c} className="rounded-full bg-amber px-2.5 py-1 text-xs font-semibold text-navy-900">{c}</span>)}
                  </span>
                </span>
              </button>
              <figure className="sh-shot relative m-0 h-[340px] -rotate-1 overflow-hidden rounded-3xl">
                <img src={IMG.truck} alt="Sports Hub boxes loaded onto a truck" loading="lazy" className="block h-full w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-ink/90 to-transparent px-5 py-5 font-editorial text-[22px] font-semibold">Loading for delivery</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── Factory gallery: scrolls sideways as you scroll down ────────── */}
      <section className="sh-hs border-t border-navy-700 bg-navy-ink text-white" aria-label="Inside the factory">
        <div className="sh-hs-sticky">
          <div className="sh-hs-track">
            {GALLERY.map((item, i) => <GalleryItem key={i} item={item} />)}
          </div>
          <div aria-hidden="true" className="absolute inset-x-[6vw] bottom-8 h-[3px] rounded bg-navy-700">
            <div className="sh-hs-bar h-full rounded bg-amber" />
          </div>
        </div>
      </section>

      {/* ── Promises ────────────────────────────────────────────────────── */}
      <section className="px-6 py-28 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-12">
          <div className="relative h-1 rounded bg-navy-100"><div className="sh-draw absolute inset-0 rounded bg-navy-900" /></div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              ["1", "mo", "Swift Turnaround", "Committed to a 1-month lead time from order delivery, ensuring operational needs are met promptly."],
              ["3", "mo", "Innovation Pipeline", "A dedicated 3-month new product development (NPD) process to bring cutting-edge solutions to market."],
              ["✓", "", "Production Excellence", "A production cycle built on post-sample approval, guaranteeing consistent, dependable quality."],
            ].map(([n, u, t, d]) => (
              <div key={t} className="sh-reveal flex flex-col gap-3.5 text-navy-900">
                <span className="font-editorial text-7xl font-semibold leading-none">{n}<span className="text-3xl">{u}</span></span>
                <h3 className="text-[22px] font-semibold">{t}</h3>
                <p className="text-base leading-relaxed text-navy-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sustainability ──────────────────────────────────────────────── */}
      <section id="sustainability" className="relative overflow-hidden border-t border-navy-700 bg-navy-900 px-6 py-28 text-white sm:px-8">
        <div aria-hidden="true">
          {[["8%", 18, 0], ["18%", 34, 2.5], ["31%", 12, 5], ["47%", 26, 1.2], ["62%", 16, 6.4], ["74%", 40, 3.6], ["88%", 20, 7.5]].map(([l, s, d]) => (
            <span key={l} className="sh-bubble" style={{ left: l, width: s, height: s, animationDelay: `${d}s` }} />
          ))}
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-wrap gap-14">
          <div className="sh-reveal flex min-w-0 flex-[1_1_380px] flex-col gap-4">
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Environmental &amp; Social Responsibility</span>
            <h2 className="font-editorial text-4xl font-semibold leading-none sm:text-6xl">Our Commitment to Sustainability</h2>
            <span className="mt-3 self-start rounded-full border border-amber/45 bg-amber/10 px-5 py-3 text-sm font-semibold text-amber-300">
              CO₂ removal supported with every purchase
            </span>
          </div>
          <div className="sh-reveal flex min-w-0 flex-[1_1_460px] flex-col gap-4 text-base leading-[1.7] text-navy-100">
            <p>At SportsHub, we believe that business growth should go hand in hand with environmental and social responsibility. We are committed to supporting responsible sourcing, promoting transparency throughout our supply chain, and working with partners who uphold high standards of quality, ethics, and compliance.</p>
            <p>We continuously seek opportunities to improve operational efficiency, reduce environmental impact, and encourage responsible manufacturing practices wherever possible. Sustainability is an ongoing journey, and we remain committed to making meaningful improvements as our business continues to grow.</p>
            <p>As part of our commitment to sustainability, OUTFIT THEORY READYMADE GARMENTS TRADING L.L.C S.O.C supports initiatives that help remove CO₂ from the atmosphere with every purchase.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden text-white">
        <img src={IMG.stock} alt="" loading="lazy" className="sh-parallax absolute inset-x-0 -top-16 h-[calc(100%+128px)] w-full object-cover" />
        <div className="absolute inset-0 bg-navy-ink/75" />
        <div className="sh-reveal relative flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="font-editorial text-5xl font-semibold leading-none sm:text-7xl">Partner with Sports Hub</h2>
          <p className="text-lg leading-relaxed text-navy-100">Whether you're an individual customer or represent a delivery service partner, we're ready to outfit your team.</p>
          <div className="flex w-full flex-col justify-center gap-3.5 sm:w-auto sm:flex-row">
            <Link to={ROUTES.PRODUCTS} className="btn-transition rounded-full bg-amber px-8 py-4 font-semibold text-navy-900 hover:bg-amber-300">Shop Products</Link>
            <Link to={ROUTES.REGISTER_VENDOR} className="btn-transition rounded-full border-[1.5px] border-white/45 px-8 py-4 font-semibold hover:bg-white/10">Register as a DSP</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
