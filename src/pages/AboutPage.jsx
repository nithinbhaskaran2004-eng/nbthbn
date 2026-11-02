import { useState } from "react";
import { Briefcase, GraduationCap, MapPin, Sparkles, Terminal } from "lucide-react";
import { profile } from "../data/portfolio";

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
        <p className="profile-role">{profile.role}</p>

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
        <p className="page-lede">{profile.bio[0]}</p>
        <p className="page-text">{profile.bio[1]}</p>

        <div className="about-meta">
          <span>
            <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
            {profile.location}
          </span>
          <span>
            <Terminal size={14} strokeWidth={1.8} aria-hidden="true" />
            {profile.role}
          </span>
        </div>

        <div className="stat-row">
          {profile.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <h3 className="section-heading">Journey</h3>

        <ol className="timeline">
          {profile.timeline.map((entry) => {
            const Icon = TIMELINE_ICONS[entry.icon] ?? Sparkles;

            return (
              <li key={`${entry.period}-${entry.title}`}>
                <span className="timeline-marker">
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                </span>

                <div>
                  <span className="timeline-period">{entry.period}</span>
                  <h4 className="timeline-title">{entry.title}</h4>
                  <span className="timeline-place">{entry.place}</span>
                  <p className="timeline-desc">{entry.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <aside className="about-side">
        <ProfileCard />

        <div className="side-card">
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
        </div>
      </aside>
    </div>
  );
}
