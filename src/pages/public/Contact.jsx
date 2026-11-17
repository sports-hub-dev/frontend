import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { contactApi } from "../../api/contact.api";
import TurnstileWidget from "../../components/ui/TurnstileWidget";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=134+Tawoynat+Smouha+Alexandria+Egypt";
const WHATSAPP_URL = "https://wa.me/+201128772325";

const CONTACT_DETAILS = [
  {
    label: "Email", value: "info@sportshubegypt.com", href: "mailto:info@sportshubegypt.com",
    icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></>,
  },
  {
    label: "Phone", value: "+20 103 367 5585", href: "tel:+201033675585",
    icon: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />,
  },
  {
    label: "Address", value: "134 Tawoynat Smouha, First Floor, Alexandria, Egypt", href: MAPS_URL, external: true,
    icon: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  },
];

const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  subject: yup.string().trim().required("Subject is required"),
  message: yup.string().trim().min(10, "Message must be at least 10 characters").required("Message is required"),
});

/** Input with a label that floats up when focused or filled. */
const FloatField = React.forwardRef(({ id, label, error, textarea, ...props }, ref) => {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="sh-fl">
      <Tag id={id} ref={ref} placeholder=" " aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      <label htmlFor={id}>{label}</label>
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-safety-red">{error}</p>}
    </div>
  );
});
FloatField.displayName = "FloatField";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleVerify = useCallback((token) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(""), []);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    if (!turnstileToken) { toast.error("Please complete the verification check."); return; }
    setSending(true);
    try {
      await contactApi.submitMessage({ ...values, turnstileToken });
      setSent(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-navy-ink text-white">
      <section className="px-6 pb-24 pt-20 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-14">
          {/* Left: intro + contact details */}
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
            <p className="sh-rise text-[13px] font-semibold uppercase tracking-[0.22em] text-amber">Get in Touch</p>
            <h1 className="sh-rise font-editorial text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl" style={{ "--sh-step": "0.1s" }}>
              We'd love to hear from you.
            </h1>
            <p className="sh-rise max-w-lg text-lg leading-relaxed text-navy-100" style={{ "--sh-step": "0.2s" }}>
              Questions about an order, a DSP partnership, or bulk uniform requirements — reach out and our team will get back to you.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {CONTACT_DETAILS.map((d, i) => (
                <a
                  key={d.label}
                  href={d.href}
                  {...(d.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="sh-detail sh-rise flex items-center gap-4 rounded-2xl border-[1.5px] border-navy-700 px-5 py-4 text-white"
                  style={{ "--sh-step": `${0.3 + i * 0.12}s` }}
                >
                  <span className="sh-ico flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-navy-700 text-amber">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {d.icon}
                    </svg>
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-300">{d.label}</span>
                    <span className="text-[17px] font-medium">{d.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="sh-rise relative min-w-0 flex-[1_1_460px] overflow-hidden rounded-[28px] bg-navy-50 p-7 text-navy-900 sm:p-10" style={{ "--sh-step": "0.2s" }}>
            {sent ? (
              <div className="relative flex min-h-[460px] flex-col items-center justify-center gap-4 text-center">
                <svg className="sh-plane absolute left-[45%] top-[45%]" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#10192C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" fill="#F2A93B" />
                </svg>
                <div className="sh-pop flex h-[76px] w-[76px] items-center justify-center rounded-full bg-amber">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10192C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <h2 className="sh-fadein font-editorial text-4xl font-semibold">Message sent</h2>
                <p className="sh-fadein text-base text-navy-500">Thanks for reaching out — our team will get back to you soon.</p>
                <button type="button" onClick={() => setSent(false)} className="sh-fadein min-h-[44px] text-navy-900 underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <h2 className="mb-1 font-editorial text-3xl font-semibold sm:text-4xl">Send us a message</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FloatField id="c-name" label="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
                  <FloatField id="c-email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
                </div>
                <FloatField id="c-subject" label="Subject" error={errors.subject?.message} {...register("subject")} />
                <FloatField id="c-msg" label="Message" textarea rows={5} error={errors.message?.message} {...register("message")} />
                <TurnstileWidget onVerify={handleVerify} onExpire={handleExpire} />
                <button
                  type="submit"
                  disabled={sending || !turnstileToken}
                  className="btn-transition flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-navy-900 text-base font-semibold text-white hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{sending ? "Sending…" : "Send Message"}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2A93B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Drawn map card */}
      <section className="px-6 pb-28 sm:px-8">
        <div className="relative mx-auto h-[420px] max-w-7xl overflow-hidden rounded-[28px] border border-navy-700 bg-navy-900">
          <div aria-hidden="true" className="absolute inset-0 scale-125 -rotate-[8deg]" style={{ background: "repeating-linear-gradient(90deg, transparent 0 79px, #1B2A4A 79px 81px), repeating-linear-gradient(0deg, transparent 0 59px, #1B2A4A 59px 61px)" }} />
          <svg viewBox="0 0 1280 420" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <path d="M0 0 H1280 V70 C 1050 110, 900 40, 700 90 S 300 60, 0 110 Z" fill="#1E4C8A" />
            <path d="M0 110 C 300 60, 500 120, 700 90 S 1050 110, 1280 70" fill="none" stroke="#3E7CC9" strokeWidth="2" />
            <path d="M0 330 C 220 300, 420 360, 640 280 S 1000 200, 1280 230" fill="none" stroke="#3E5288" strokeWidth="14" strokeLinecap="round" />
            <path d="M1280 120 C 1000 160, 760 90, 540 170 S 200 210, 0 160" fill="none" stroke="#3E5288" strokeWidth="10" strokeLinecap="round" />
            <g className="sh-car"><rect x="-12" y="-7" width="24" height="14" rx="4" fill="#F2A93B" /></g>
            <g className="sh-car2"><rect x="-10" y="-6" width="20" height="12" rx="4" fill="#EEF1F7" /></g>
            <text x="40" y="52" fill="#9CC3EE" fontSize="15" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="3">MEDITERRANEAN SEA</text>
          </svg>
          <div className="absolute left-[58%] top-[56%]">
            <span className="sh-ping-dot absolute -left-3.5 -top-3.5 block h-7 w-7 rounded-full bg-amber/60" />
            <span className="sh-pin absolute left-0 top-0 block">
              <svg width="44" height="56" viewBox="0 0 24 30" aria-hidden="true"><path d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 30 12 30s12-9.7 12-18.4C24 5.2 18.6 0 12 0z" fill="#F2A93B" /><circle cx="12" cy="11.5" r="4.5" fill="#10192C" /></svg>
            </span>
          </div>
          <div className="absolute bottom-6 left-6 flex max-w-xs flex-col gap-1.5 rounded-[18px] border border-navy-700 bg-navy-ink/90 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-amber">Sports Hub · Smouha</span>
            <span className="text-[15px] leading-normal">134 Tawoynat Smouha, First Floor, Alexandria, Egypt</span>
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="text-sm font-semibold text-amber hover:text-amber-300">Get directions →</a>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp button, rendered on <body> so it stays fixed on screen */}
      {typeof document !== "undefined" &&
        createPortal(
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="sh-wa fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6z" /><path d="M9 10c0 3 2 5 5 5l1.2-1.3-2-1-1 .8c-.8-.3-1.5-1-1.8-1.8l.8-1-1-2z" />
            </svg>
          </a>,
          document.body
        )}
    </div>
  );
};

export default Contact;
