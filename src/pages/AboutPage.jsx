import { useState } from "react";
import { Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { profile } from "../data/portfolio";
import Reveal from "../components/Reveal";

const TIMELINE_ICONS = {
  briefcase: Briefcase,
  graduation: GraduationCap,
  sparkles: Sparkles,
};

/** Turns **bold** markers in the bio into <strong> elements. */
function renderRichText(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function ProfileCard() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <article className="profile-card">
      <div className="profile-photo">
        {photoFailed ? (
          <div className="profile-photo-fallback" aria-hidden="true">
            <span className="profile-monogram">{profile.initials}</span>
            <span className="profile-photo-hint">Add {profile.photo}</span>
          </div>
        ) : (
          <img
            src={profile.photo}
            alt={`${profile.name} portrait`}
            onError={() => setPhotoFailed(true)}
          />
        )}

        <span className="profile-photo-fade" aria-hidden="true" />

        <span className="profile-badge">
          <span className="profile-badge-dot" aria-hidden="true" />
          {profile.availability}
        </span>
      </div>

      <div className="profile-info">
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-role">{profile.cardRole ?? profile.role}</p>

        <span className="profile-location">
          <MapPin size={12} strokeWidth={1.9} aria-hidden="true" />
          {profile.location}
        </span>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <div className="about-grid">
      <div className="about-main">
        {profile.bio.map((paragraph, index) => (
          <Reveal
            key={paragraph}
            as="p"
            delay={0.05 + index * 0.07}
            className={index === 0 ? "page-lede" : "page-text"}
          >
            {renderRichText(paragraph)}
          </Reveal>
        ))}

        <div className="stat-row">
          {profile.stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              className="stat"
              delay={0.36 + index * 0.07}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </Reveal>
          ))}
        </div>

        <Reveal as="h3" className="section-heading" delay={0.5}>
          Journey
        </Reveal>

        <ol className="timeline">
          {profile.timeline.map((entry, index) => {
            const Icon = TIMELINE_ICONS[entry.icon] ?? Sparkles;

            return (
              <Reveal
                key={`${entry.period}-${entry.title}`}
                as="li"
                delay={0.56 + index * 0.08}
              >
                <span className="timeline-marker">
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                </span>

                <div>
                  <span className="timeline-period">{entry.period}</span>
                  <h4 className="timeline-title">{entry.title}</h4>
                  <span className="timeline-place">{entry.place}</span>
                  <p className="timeline-desc">{entry.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <aside className="about-side">
        <Reveal delay={0.14}>
          <ProfileCard />
        </Reveal>

        <Reveal className="stack-board" delay={0.3}>
          <div className="stack-board-head">
            <h3 className="stack-board-title">Stack</h3>
            <span className="stack-board-meta">
              {String(profile.stack.length).padStart(2, "0")} core tools
            </span>
          </div>

          <ul className="stack-list">
            {profile.stack.map((item, index) => (
              <li className="stack-list-item" key={item}>
                <span className="stack-list-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="stack-list-name">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </aside>
    </div>
  );
}
