import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Mail, Send } from "lucide-react";
import PulseHeart from "../components/PulseHeart";
import { InstagramIcon, LinkedinIcon } from "../components/BrandIcons";
import { profile, socials } from "../data/portfolio";
import {
  likesAreLive,
  loadLikes,
  persistLike,
  refreshLikeCount,
} from "../lib/likes";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  email: Mail,
};

const EMPTY_FORM = { name: "", email: "", message: "" };

const KNOB_SIZE = 52;
const TRACK_PADDING = 5;

function SlideToSend({ sent, onComplete }) {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({ startX: 0, max: 0 });
  const completedRef = useRef(false);

  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return undefined;

    setTrackWidth(element.clientWidth);

    const observer = new ResizeObserver(() => {
      setTrackWidth(element.clientWidth);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getMax = () => Math.max(0, trackWidth - KNOB_SIZE - TRACK_PADDING * 2);

  const moveTo = (value) => {
    offsetRef.current = value;
    setOffset(value);
  };

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setDragging(false);

    const accepted = onComplete();

    if (!accepted) {
      completedRef.current = false;
      moveTo(0);
      return;
    }

    moveTo(getMax());
  };

  const onPointerDown = (event) => {
    if (sent) return;
    dragRef.current = {
      startX: event.clientX - offsetRef.current,
      max: getMax(),
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    event.preventDefault();
    event.currentTarget.focus?.({ preventScroll: true });
  };

  const onPointerMove = (event) => {
    if (!dragging || sent) return;
    const { startX, max } = dragRef.current;
    moveTo(Math.min(max, Math.max(0, event.clientX - startX)));
  };

  const onPointerUp = (event) => {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(false);

    if (offsetRef.current >= dragRef.current.max * 0.85) {
      finish();
    } else {
      moveTo(0);
    }
  };

  const onKeyDown = (event) => {
    if (sent) return;
    const max = getMax();

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      finish();
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(Math.min(max, offsetRef.current + max * 0.18));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(Math.max(0, offsetRef.current - max * 0.18));
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      finish();
    }
  };

  const max = getMax();
  const progress = max ? offset / max : 0;
  const label = sent
    ? "Message ready"
    : progress >= 0.8
      ? "Release to send"
      : "Slide to send";

  return (
    <div
      ref={trackRef}
      className={`slide-send${dragging ? " is-dragging" : ""}${sent ? " is-done" : ""}`}
      role="slider"
      tabIndex={sent ? -1 : 0}
      aria-label="Slide to send message"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuetext={label}
      aria-disabled={sent}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <span
        className="slide-send-fill"
        style={{ width: `${offset + KNOB_SIZE + TRACK_PADDING}px` }}
        aria-hidden="true"
      />

      <span className="slide-send-label" aria-hidden="true">
        {label}
      </span>

      <span
        className="slide-send-knob"
        style={{ transform: `translateX(${offset}px)` }}
        aria-hidden="true"
      >
        {sent ? (
          <Check size={18} strokeWidth={2.4} />
        ) : (
          <Send size={17} strokeWidth={2} />
        )}
      </span>
    </div>
  );
}

function LikeBar() {
  const [state, setState] = useState({ count: 0, liked: false, ready: false });
  const [live, setLive] = useState(likesAreLive);

  useEffect(() => {
    let alive = true;

    loadLikes().then((loaded) => {
      if (!alive) return;
      setState({ count: loaded.count, liked: loaded.liked, ready: true });
      setLive(loaded.live);
    });

    return () => {
      alive = false;
    };
  }, []);

  /* keep the number fresh when the site has a real backend */
  useEffect(() => {
    if (!live) return undefined;

    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      refreshLikeCount().then((count) => {
        if (count === null) return;
        setState((current) => ({ ...current, count }));
      });
    }, 20000);

    return () => window.clearInterval(id);
  }, [live]);

  const handleChange = (liked, count) => {
    setState((current) => ({ ...current, liked, count }));
    persistLike(liked, count);
  };

  return (
    <section className="like-bar">
      <div className="like-copy">
        <span className="like-kicker">Appreciate the work?</span>
        <p className="like-text">Leave a like — it genuinely makes my day.</p>
      </div>

      <div className="like-action">
        <PulseHeart
          liked={state.liked}
          count={state.count}
          onChange={handleChange}
          disabled={!state.ready}
          label="Leave a like"
          size={32}
          corner={999}
          likedColor="#ff4d6d"
          idleColor="#a78bfa"
          pillColor="rgba(10, 0, 20, 0.55)"
          textColor="#e9d5ff"
          className="like-heart"
        />
        {live && <span className="like-meta">live count</span>}
      </div>
    </section>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);

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

  const handleSlideComplete = () => {
    const formElement = formRef.current;
    if (!formElement) return false;

    if (!formElement.reportValidity()) return false;

    formElement.requestSubmit();
    return true;
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

      <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
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

        <SlideToSend sent={sent} onComplete={handleSlideComplete} />

        {sent && (
          <p className="form-note" role="status">
            Your mail client should open with the message ready to send. If it
            doesn&apos;t, write to {profile.email} directly.
          </p>
        )}
      </form>

      <LikeBar />
    </div>
  );
}
