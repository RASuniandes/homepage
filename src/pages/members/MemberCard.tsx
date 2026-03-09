import { motion } from "framer-motion";
import { Mail, Phone, Calendar, Award, Code, CheckCircle } from "lucide-react";
import type { MemberCardProps } from "./memberType";
import { API_URL } from "../../utils/config";

const importantRoleMappers: Record<string, string> = {
  "Presidente": "border-rose-500/40 bg-rose-500/10 text-rose-400",
  "Vicepresidente": "border-green-500/30 bg-green-500/10 text-green-400",
  "Secretario": "border-sky-500/30 bg-sky-500/10 text-sky-400",
  "Tesorero": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "Electronic Lead": "border-violet-500/30 bg-violet-500/10 text-violet-400",
  "Mechanical Lead": "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  "Software Lead": "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400",
};

export default function MemberCard({ member, isAdmin, onApproved }: MemberCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative h-fit rounded-2xl p-px bg-linear-to-br from-amber-500/40 via-transparent to-amber-600/40 group"
    >
      <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-7 overflow-hidden transition-all duration-300 group-hover:border-amber-500/40">

        {/* subtle glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
        </div>

        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40 group-hover:opacity-80 transition" />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between mb-6">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {member.photo ? (
              <img
                src={member.photo.startsWith("http") ? member.photo : `${API_URL}/${member.photo}`}
                alt={member.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-500/30 group-hover:ring-amber-400 transition"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center ring-2 ring-amber-500/30">
                <span className="text-xl font-bold text-black">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white tracking-tight">
                {member.name}
              </h3>
              <p className="text-sm text-zinc-400">{member.major}</p>
              {member.doubleMajor && (
                <p className="text-sm text-zinc-500">
                  {member.doubleMajor}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {member.role && importantRoleMappers[member.role] ? (
          <div className={`bg-amber-500/10 mb-4 border border-amber-500/40 flex justify-center px-3 py-1 rounded-full backdrop-blur-md ${importantRoleMappers[member.role] || ''}`}>
            <span className="text-xs text-center font-semibold tracking-wider">
              {member.role.toUpperCase()}
            </span>
          </div>
        ) :
          member.role && (
            <div className={`bg-zinc-800/50 mb-4 border border-zinc-700 flex justify-center px-3 py-1 rounded-full backdrop-blur-md`}>
              <span className="text-xs text-center font-semibold tracking-wider text-zinc-400">
                {member.role.toUpperCase()}
              </span>
            </div>
          )
        }

        {/* Admin Approval Field */}
        {isAdmin && (
          <div className="mb-6 pb-4 border-b border-zinc-800">
            <button
              onClick={() => onApproved?.(member.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 transition text-green-400 text-sm font-semibold"
            >
              <CheckCircle className="w-4 h-4" />
              Aprobar Miembro
            </button>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-center gap-2 text-zinc-300">
            <Mail className="w-4 h-4 text-amber-500" />
            <a
              href={`mailto:${member.email}`}
              className="text-zinc-400 hover:text-amber-400 transition truncate"
            >
              {member.email}
            </a>
          </div>

          {member.phoneNumber && (
            <div className="flex items-center gap-2 text-zinc-300">
              <Phone className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-400">
                {member.phoneNumber}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-zinc-300">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-zinc-400">
              {new Date(member.joinDate).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>

        {/* Project + Code */}
        {(member.project || member.uCode) && (
          <div className="mb-6 pt-4 border-t border-zinc-800 space-y-2">
            {member.project && (
              <p className="text-sm text-zinc-300">
                <span className="text-amber-400 font-semibold">
                  Proyecto:
                </span>{" "}
                {member.project}
              </p>
            )}

            {member.uCode && (
              <p className="text-sm text-zinc-300">
                <span className="text-amber-400 font-semibold">
                  Código:
                </span>{" "}
                {member.uCode}
              </p>
            )}
          </div>
        )}

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-zinc-300">
                Habilidades
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 group-hover:border-amber-500/30 transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contributions */}
        {member.contributions && member.contributions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-zinc-300">
                Contribuciones
              </span>
            </div>

            <ul className="space-y-2">
              {member.contributions.map((contrib, idx) => (
                <li
                  key={idx}
                  className="text-zinc-400 text-xs flex items-start gap-2"
                >
                  <span className="text-amber-500">•</span>
                  <span className="line-clamp-1">{contrib}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}