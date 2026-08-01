import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, ExternalLink } from "lucide-react";
import readmeRaw from "../../../scripts/ROS2InstallerReadme.md?raw";

const GIST_PAGE_URL = "https://gist.github.com/RAS-UAndes/cd26b4dc5b9b89aac80dac31067557e7";
// Unhashed raw URL: always resolves to the gist's latest revision, per the
// guide's own recommendation (see "Para el equipo que mantiene el script").
// A hash-pinned raw URL would silently go stale the next time the script is updated.
const RAW_SCRIPT_BASE = "https://gist.githubusercontent.com/RAS-UAndes/cd26b4dc5b9b89aac80dac31067557e7/raw";
const QUICK_INSTALL_CMD = `curl -fsSL ${RAW_SCRIPT_BASE}/ros2-install.sh | bash`;

// The source doc uses a <RAS-URL> placeholder (it's written to be portable
// across however RAS ends up hosting the script). Substitute the real gist
// URL so every command shown on this page is copy-pasteable as-is.
const readmeContent = readmeRaw.replaceAll("https://<RAS-URL>", RAW_SCRIPT_BASE);

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) -- text stays selectable.
    }
  };

  return (
    <button type="button" className="installer-copy-btn" onClick={handleCopy}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copiado" : label}
    </button>
  );
}

export default function ROS2Installer() {
  return (
    <section className="block">
      <div className="wrap">

        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <Link to="/tools">Herramientas</Link>
            <span className="sep">/</span>
            <span>ROS 2 Installer</span>
          </nav>
          <span className="eyebrow">Software · Linux · Robots</span>
          <div className="sec-head">
            <h2>Instalador de ROS 2</h2>
            <p>
              Script único y mantenido por RAS Uniandes para dejar un equipo
              con ROS 2 listo para trabajar: repositorio apt, paquetes,
              workspace y entorno de shell configurado.
            </p>
          </div>
        </div>

        <div className="installer-hero reveal">
          <span className="installer-hero-label">Instalación rápida</span>
          <div className="installer-cmd">
            <code>{QUICK_INSTALL_CMD}</code>
            <CopyButton text={QUICK_INSTALL_CMD} />
          </div>
          <a
            href={GIST_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="installer-source-link"
          >
            Revisar el script en GitHub antes de ejecutarlo <ExternalLink size={14} />
          </a>
        </div>

        <div className="wiki reveal">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {readmeContent}
          </ReactMarkdown>
        </div>

      </div>
    </section>
  );
}
