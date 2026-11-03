import { useState } from "react";
import { Briefcase, GraduationCap, MapPin, Sparkles, Terminal } from "lucide-react";
import { profile } from "../data/portfolio";
import Reveal from "../components/Reveal";

const TIMELINE_ICONS = {
  briefcase: Briefcase,
  graduation: GraduationCap,
  sparkles: Sparkles,
};

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
            {paragraph}
          </Reveal>
        ))}

        <Reveal className="about-meta" delay={0.28}>
          <span>
            <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
            {profile.location}
          </span>
          <span>
            <Terminal size={14} strokeWidth={1.8} aria-hidden="true" />
            {profile.role}
          </span>
        </Reveal>

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

        <Reveal className="side-card" delay={0.3}>
          <h3 className="section-heading">Stack</h3>

          {profile.stack.map((group) => (
            <div className="stack-group" key={group.group}>
              <span className="stack-group-label">{group.group}</span>
              <div className="chip-row">
                {group.items.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </aside>
    </div>
  );
}
