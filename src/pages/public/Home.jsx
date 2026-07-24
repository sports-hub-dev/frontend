import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Button from "../../components/ui/Button";
import { useReveal } from "../../hooks/useReveal";
import HeroCarousel from "../../components/ui/HeroCarousel";

const HERO_IMAGES = [
  "https://res.cloudinary.com/dsfa43amy/image/upload/v1784453290/Testt_u3ljtm.jpg",
  "https://res.cloudinary.com/dsfa43amy/image/upload/v1784453482/Testt2_kxythh.jpg",
  "https://res.cloudinary.com/dsfa43amy/image/upload/v1784453592/Test3_ujzc6r.jpg",
];

const STORY_PANELS = [
  {
    eyebrow: "Visibility",
    title: "Seen from every angle.",
    copy: "Reflective trims and high-contrast panels are placed exactly where drivers need to be seen most — keeping every last-mile route safer, day or night.",
    image: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385598/8cd4d8c7-8f28-4fa9-984e-ae7f467260d1.png",
  },
  {
    eyebrow: "Comfort",
    title: "Built for a full shift.",
    copy: "Breathable, four-way stretch fabrics move with the job — loading, driving, walking — so comfort holds up well past hour eight.",
    image: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385695/d9fe1bf9-0b87-4c96-8734-ec404af5f51d.png",
  },
  {
    eyebrow: "Durability",
    title: "Made to outlast the route.",
    copy: "Every stitch and seam is tested against the realities of daily wear, so the uniform still looks sharp long after day one.",
    image: "https://res.cloudinary.com/dsfa43amy/image/upload/v1784385791/2ca85078-9dd2-42c6-84d6-7af661d0c56c.png",
  },
];

const CATEGORIES = ["T-Shirt", "Jackets", "Vest", "Safety Shoes", "Four Wheelers", "Helmets"];

const Home = () => {
  const { ref: storyRef, isVisible: storyVisible } = useReveal({ threshold: 0.1 });
  const { ref: quoteRef, isVisible: quoteVisible } = useReveal({ threshold: 0.3 });


  return (
    <div className="bg-white">
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-navy-ink">
        <HeroCarousel images={HERO_IMAGES} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-ink via-navy-ink/50 to-navy-ink/10" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40 text-center sm:px-8 sm:pb-24 sm:text-left">
          <p className="animate-fadeUp text-xs font-medium uppercase tracking-[0.25em] text-white mx-auto sm:mx-0">
            Sports Hub Collection
          </p>
          <h1 className="mt-6 max-w-3xl animate-fadeUp font-editorial text-3xl font-normal italic leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl mx-auto sm:mx-0" style={{ animationDelay: "80ms" }}>
            Built like performance wear.
          </h1>
          <p className="mt-6 max-w-lg animate-fadeUp text-sm leading-relaxed text-navy-100/90 sm:text-base mx-auto sm:mx-0" style={{ animationDelay: "160ms" }}>
            Uniforms and PPE for Egypt's delivery and logistics workforce — designed for durability, visibility,
            and all-day comfort.
          </p>
          <div className="mt-10 flex animate-fadeUp flex-col items-center gap-4 sm:flex-row" style={{ animationDelay: "220ms" }}>
            <Link to={ROUTES.PRODUCTS} className="w-full sm:w-64">
              <Button variant="amber" size="lg" className="h-14 w-full">
                Explore the Collection
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER_VENDOR} className="w-full sm:w-64">
              <Button size="lg" className="h-14 w-full border border-white/40 bg-transparent text-white hover:bg-white/10">
                Become a DSP Partner
              </Button>
            </Link>
          </div>
        </div>

        {/* "Keep scrolling" cue, echoing the case-study reference */}
        <div className="absolute bottom-8 right-6 hidden animate-fadeIn items-center gap-3 sm:right-8 sm:flex" style={{ animationDelay: "500ms" }}>
          <span className="text-xs uppercase tracking-[0.2em] text-white/60">Keep Scrolling</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-bounce">
              <path d="M2 4l4 4 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </section>

      {/* ── Minimal credibility strip ───────────────────────────────────── */}
      <section className="border-b border-navy-100 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-3">
          {["Oeko-Tex 100 Certified", "EN ISO 20471 Compliant", "1-Month Lead Time", "Egypt · Saudi Arabia · UAE"].map((item, i) => (
            <span key={item} className="flex items-center gap-x-10">
              <span className="text-xs font-medium uppercase tracking-wide text-navy-400">{item}</span>
              {i < 3 && <span className="hidden h-1 w-1 rounded-full bg-navy-200 sm:inline-block" />}
            </span>
          ))}
        </div>
      </section>

      {/* ── Alternating editorial story panels ──────────────────────────── */}
      <section ref={storyRef} className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <div className="space-y-24 sm:space-y-32">
          {STORY_PANELS.map((panel, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={panel.title}
                className={`grid grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-16 ${storyVisible ? "animate-fadeUp" : "opacity-0"}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={reversed ? "sm:order-2" : ""}>
                  <div className="aspect-[4/5] overflow-hidden rounded-sm bg-navy-50">
                    {panel.image && (
                      <img src={panel.image} alt={panel.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                </div>
                <div className={reversed ? "sm:order-1" : ""}>
                  <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-amber-600">{panel.eyebrow}</p>
                  <h3 className="text-center mt-4 font-editorial text-3xl italic leading-tight text-navy-900 sm:text-4xl">
                    {panel.title}
                  </h3>
                  <p className="text-center mt-4 font-editorial max-w-* leading-relaxed text-navy-500">{panel.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Pull statement ───────────────────────────────────────────────── */}
      <section ref={quoteRef} className="bg-navy-900 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <p className={`font-editorial text-lg italic leading-relaxed text-white sm:text-2xl md:text-3xl ${quoteVisible ? "animate-fadeUp" : "opacity-0"}`}>
            "Every garment we send out is judged by the same standard — would it hold up on a real route, in real
            weather, for a full shift."
          </p>
          <p className={`mt-6 text-xs font-medium uppercase tracking-[0.2em] text-navy-300 ${quoteVisible ? "animate-fadeUp" : "opacity-0"}`} style={{ animationDelay: "120ms" }}>
            Sports Hub Product Team
          </p>
        </div>
      </section>

      {/* ── Category CTA panels ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-amber-600">Shop by Line</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat)}`}
              className="group relative flex h-28 items-center justify-center overflow-hidden rounded-sm bg-navy-900 p-6 text-center transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-editorial text-xl italic text-white transition-transform duration-300 group-hover:scale-105">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-navy-100 py-24 text-center">
        <div className="mx-auto max-w-xl px-6 sm:px-8">
          <h2 className="font-editorial text-3xl italic text-navy-900 sm:text-4xl">Let's get you outfitted.</h2>
          <p className="mt-4 text-base text-navy-500">
            Browse the full collection, or register your team as a DSP partner for vendor pricing and catalogue access.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.PRODUCTS} className="w-full sm:w-64"><Button size="lg" className="w-full">Explore the Collection</Button></Link>
            <Link to={ROUTES.REGISTER_VENDOR} className="w-full sm:w-64"><Button variant="outline" size="lg" className="w-full">Register as a DSP</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
