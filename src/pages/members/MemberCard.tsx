import type { MemberCardProps } from "./memberType";

const COUNCIL_ROLES = new Set([
  "Presidente", "Vicepresidente", "Secretario", "Tesorero",
  "Electronic Lead", "Mechanical Lead", "Software Lead",
]);

export default function MemberCard({ member, isAdmin, onApproved }: MemberCardProps) {
  const isCouncil = member.isInCouncil || (member.role ? COUNCIL_ROLES.has(member.role) : false);
  const photoSrc = member.photo ?? null;

  return (
    <article className="member-card reveal">
      <div className="avatar">
        {photoSrc
          ? <img src={photoSrc} alt={member.name} loading="lazy" />
          : <span className="initials">{member.name.charAt(0).toUpperCase()}</span>
        }
      </div>

      <h3>{member.name}</h3>
      <p className="member-major">
        {member.major}
        {member.doubleMajor ? ` · ${member.doubleMajor}` : ''}
      </p>

      {member.role && (
        <p className={`member-role${isCouncil ? ' council' : ''}`}>
          {member.role}
        </p>
      )}

      {member.skills && member.skills.length > 0 && (
        <div className="member-tags">
          {member.skills.slice(0, 4).map(s => (
            <span key={s} className="tag">{s}</span>
          ))}
        </div>
      )}

      <p className="member-date">
        {new Date(member.joinDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
      </p>

      {isAdmin && (
        <button className="approve-btn" onClick={() => onApproved?.(member.id)}>
          Aprobar miembro <span style={{ marginLeft: 4 }}>→</span>
        </button>
      )}
    </article>
  );
}
