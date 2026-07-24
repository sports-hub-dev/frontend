import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Button from "../../components/ui/Button";
import { useReveal } from "../../hooks/useReveal";

const PRODUCT_LINES = [
  { name: "Biker Uniforms", detail: "Long-sleeve t-shirts and pants, engineered for mobility and adaptive to the Gulf climate — Oeko-Tex 100 certified fabrics." },
  { name: "4-Wheeler Uniforms", detail: "Polo shirts and durable trousers designed for comfort during extended shifts behind the wheel." },
  { name: "Jackets", detail: "All-weather protection with breathable, water-resistant finishes that keep riders dry and cool." },
  { name: "Safety Vests", detail: "High-visibility, EN ISO 20471-compliant vests for on-road and warehouse environments." },
  { name: "Safety Shoes", detail: "Impact- and slip-resistant footwear for delivery riders and warehouse staff alike." },
  { name: "Helmets", detail: "Protective headgear manufactured in strict compliance with applicable safety and certification standards." },
];

const CAPABILITIES = [
  { stat: "1-month", label: "Lead time from order to delivery" },
  { stat: "3", label: "Countries served across the AMET region" },
  { stat: "250K+", label: "Combined annual unit capacity" },
];

const COVERAGE = [
  { country: "Egypt", volume: "up to 30,000 units annually", note: "Biker &amp; 4-wheeler uniforms, jackets, safety vests and helmets" },
  { country: "Saudi Arabia", volume: "up to 90,000 units annually", note: "Scalable production capacity to meet fluctuating demand" },
  { country: "United Arab Emirates", volume: "up to 130,000 units annually", note: "Regional inventory pinning for fast, reliable delivery" },
];

const About = () => {
  const { ref: lineRef, isVisible: lineVisible } = useReveal();
  const { ref: coverageRef, isVisible: coverageVisible } = useReveal();

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="stamp bg-amber/15 text-amber ring-1 ring-inset ring-amber/30">Who We Are</span>
          <h1 className="mt-5 animate-fadeUp font-display text-2xl font-bold text-white sm:text-4xl">
            Personal protective equipment, purpose-built for delivery.
          </h1>
          <p className="mt-5 animate-fadeUp text-sm leading-relaxed text-navy-200 sm:text-base" style={{ animationDelay: "80ms" }}>
            Sportshub is the commercial brand used by Outfit Theory Readymade Garments Trading L.L.C S.O.C for its UAE e-commerce operations in uniforms, workwear and personal protective equipment.

            Sports Hub specializes in delivering high-performance personal protective equipment (PPE) and uniforms to fulfil the specific needs of demanding environments. Our regional capabilities span Egypt, Saudi Arabia, and the United Arab Emirates (UAE) — manufactured and owned by controlled warehousing, ensuring a seamless and robust supply chain for Amazon's DSP operations.
          </p>
        </div>
      </section>

      {/* Capabilities strip */}
      <section className="border-b border-navy-100 bg-white py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-3 sm:px-6">
          {CAPABILITIES.map((c) => (
            <div key={c.label}>
              <p className="font-display text-3xl font-bold text-navy-900">{c.stat}</p>
              <p className="mt-1 text-sm text-navy-400">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product portfolio */}
      <section ref={lineRef} className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Scope Coverage</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-navy-900">Product Portfolio</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-navy-500">
            A full range of uniforms and PPE, engineered for performance, safety, and comfort — designed to hold up
            to the demands of daily delivery routes.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_LINES.map((line, i) => (
            <div
              key={line.name}
              className={`rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:text-left ${lineVisible ? "animate-fadeUp" : "opacity-0"}`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <h3 className="font-display text-sm font-semibold text-navy-900 sm:text-base">{line.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-navy-500 sm:text-sm">{line.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage / manifest style map summary */}
      <section ref={coverageRef} className="bg-navy-900 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber">Volume Readiness</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">AMET Regional Coverage</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-navy-300">
              Our production model is built to scale 2x to 3x during peak periods, without compromising quality or
              delivery timelines.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            {COVERAGE.map((c, i) => (
              <div
                key={c.country}
                className={`flex flex-col justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center sm:flex-row sm:items-center sm:text-left ${coverageVisible ? "animate-fadeUp" : "opacity-0"}`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div>
                  <p className="font-display text-sm font-semibold text-white">{c.country}</p>
                  <p className="mt-0.5 text-xs text-navy-300" dangerouslySetInnerHTML={{ __html: c.note }} />
                </div>
                <span className="tracking-code shrink-0 text-xs font-semibold text-amber">{c.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead time / development */}
      <section className="text-center mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-base font-semibold text-navy-900">Swift Turnaround</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">
              Committed to a 1-month lead time from order delivery, ensuring operational needs are met promptly.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-navy-900">Innovation Pipeline</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">
              A dedicated 3-month new product development (NPD) process to bring cutting-edge solutions to market.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-navy-900">Production Excellence</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">
              A production cycle built on post-sample approval, guaranteeing consistent, dependable quality.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-navy-100 bg-white py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-navy-900">Partner with Sports Hub</h2>
          <p className="mt-3 text-sm text-navy-500">
            Whether you're an individual customer or represent a delivery service partner, we're ready to outfit
            your team.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={ROUTES.PRODUCTS}><Button size="lg">Shop Products</Button></Link>
            <Link to={ROUTES.REGISTER_VENDOR}><Button variant="outline" size="lg">Register as a DSP</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
