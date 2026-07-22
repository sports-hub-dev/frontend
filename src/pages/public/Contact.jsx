import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { contactApi } from "../../api/contact.api";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { useReveal } from "../../hooks/useReveal";

const CONTACT_DETAILS = [
  { label: "Email", value: "support@sportshub.example.com", href: "mailto:support@sportshub.example.com",
    icon: "M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9-5 9 5" },
  { label: "Phone", value: "+20 100 000 0000", href: "tel:+201000000000",
    icon: "M3 5a2 2 0 012-2h2.28a1 1 0 01.98.79l1 4a1 1 0 01-.27.95L7.6 10.15a12 12 0 006.25 6.25l1.41-1.41a1 1 0 01.95-.27l4 1a1 1 0 01.79.98V19a2 2 0 01-2 2h-1C8.61 21 3 15.39 3 8V5z" },
  { label: "Address", value: "134 Tawoynat Smouha, First Floor, Alexandria, Egypt",
    icon: "M17.66 10.34a5.66 5.66 0 11-11.32 0C6.34 6 12 2 12 2s5.66 4 5.66 8.34zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
];

const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  subject: yup.string().trim().required("Subject is required"),
  message: yup.string().trim().min(10, "Message must be at least 10 characters").required("Message is required"),
});

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { ref: detailsRef, isVisible } = useReveal();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    setSending(true);
    try {
      await contactApi.submitMessage(values);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="bg-navy-900 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="stamp bg-amber/15 text-amber ring-1 ring-inset ring-amber/30">Get in Touch</span>
          <h1 className="mt-5 animate-fadeUp font-display text-3xl font-bold text-white sm:text-4xl">We'd love to hear from you.</h1>
          <p className="mt-4 animate-fadeUp text-base leading-relaxed text-navy-200" style={{ animationDelay: "80ms" }}>
            Questions about an order, a DSP partnership, or bulk uniform requirements — reach out and our team will get back to you.
          </p>
        </div>
      </section>

      <section ref={detailsRef} className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="text-center grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CONTACT_DETAILS.map((detail, i) => {
            const content = (
              <>
                <div className="mb-3 flex h-11 w-auto items-center justify-center rounded-full bg-navy-50 text-navy-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d={detail.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{detail.label}</p>
                <p className="mt-1 font-display text-sm font-semibold text-navy-900">{detail.value}</p>
              </>
            );
            const className = `rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${isVisible ? "animate-fadeUp" : "opacity-0"}`;
            const style = { animationDelay: `${i * 70}ms` };
            return detail.href ? (
              <a key={detail.label} href={detail.href} className={className} style={style}>{content}</a>
            ) : (
              <div key={detail.label} className={className} style={style}>{content}</div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-navy-100 bg-white py-14">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="mb-6 text-center font-display text-2xl font-bold text-navy-900">Send us a message</h2>
          {sent ? (
            <div className="animate-scaleIn rounded-2xl border border-safety-green/20 bg-safety-greenLight p-6 text-center">
              <p className="font-display text-base font-semibold text-navy-900">Message sent!</p>
              <p className="mt-1 text-sm text-safety-green">Thanks for reaching out — our team will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Your name" error={errors.name?.message} {...register("name")} />
                <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
              </div>
              <Input label="Subject" error={errors.subject?.message} {...register("subject")} />
              <Textarea label="Message" rows={5} error={errors.message?.message} {...register("message")} />
              <Button type="submit" size="lg" loading={sending} className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;