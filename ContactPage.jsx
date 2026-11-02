import { useState } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "../components/BrandIcons";
import { profile, socials } from "../data/portfolio";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  email: Mail,
};

const EMPTY_FORM = { name: "", email: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Portfolio enquiry${form.name ? ` from ${form.name}` : ""}`,
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name || "Name"}${form.email ? ` (${form.email})` : ""}`,
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="contact-grid">
      <div className="contact-intro">
        <p className="page-lede">
          Have a project, an idea, or just a question? My inbox is always open.
        </p>

        <a className="contact-mail" href={`mailto:${profile.email}`}>
          {profile.email}
          <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
        </a>

        <div className="social-list">
          {socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.id] ?? Mail;

            return (
              <a
                className="social-link"
                key={social.id}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <span className="social-icon">
                  <Icon size={17} aria-hidden="true" />
                </span>

                <span>
                  <span className="social-label">{social.label}</span>
                  <span className="social-handle">{social.handle}</span>
                </span>

                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="contact-name">
            Your name
          </label>
          <input
            className="field-input"
            id="contact-name"
            name="name"
            type="text"
            placeholder="Ada Lovelace"
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="contact-email">
            Email
          </label>
          <input
            className="field-input"
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="contact-message">
            Message
          </label>
          <textarea
            className="field-textarea"
            id="contact-message"
            name="message"
            placeholder="Tell me what you're building…"
            rows={4}
            value={form.message}
            onChange={updateField}
            required
          />
        </div>

        <button className="contact-submit" type="submit">
          Send message
          <Send size={14} strokeWidth={2} aria-hidden="true" />
        </button>

        {sent && (
          <p className="form-note" role="status">
            Your mail client should open with the message ready to send. If it
            doesn&apos;t, write to {profile.email} directly.
          </p>
        )}
      </form>
    </div>
  );
}
