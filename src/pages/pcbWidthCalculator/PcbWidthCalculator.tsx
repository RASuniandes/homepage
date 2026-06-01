import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

type Unit = "mil" | "mm";
type LayerType = "external" | "internal";

export default function PcbWidthCalculator() {
  const [current, setCurrent] = useState<number>(2);
  const [tempRise, setTempRise] = useState<number>(10);
  const [thickness, setThickness] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>("mil");
  const [layerType, setLayerType] = useState<LayerType>("external");

  // IPC-2221 constants
  const constants = {
    external: { k: 0.048, b: 0.44, c: 0.725 },
    internal: { k: 0.024, b: 0.44, c: 0.725 },
  };

  const result = useMemo(() => {
    const { k, b, c } = constants[layerType];
    const widthMil = current / (k * Math.pow(tempRise, b) * Math.pow(thickness, c));
    const widthMm = widthMil * 0.0254;
    const areaMil2 = widthMil * (thickness * 1.378);
    return {
      widthMil: parseFloat(widthMil.toFixed(3)),
      widthMm: parseFloat(widthMm.toFixed(3)),
      areaMil2: parseFloat(areaMil2.toFixed(3)),
    };
  }, [current, tempRise, thickness, layerType]);

  return (
    <section className="block">
      <div className="wrap">

        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <Link to="/tools">Herramientas</Link>
            <span className="sep">/</span>
            <span>PCB Calculator</span>
          </nav>
          <span className="eyebrow">Diseño de hardware</span>
          <div className="sec-head">
            <h2>Calculadora de Ancho de Traza PCB</h2>
            <p>Basado en estándar IPC-2221 para diseño de circuitos impresos.</p>
          </div>
        </div>

        <div className="tool-layout reveal">

          {/* ── Inputs ── */}
          <div className="tool-inputs">
            <div className="field">
              <label>Corriente (A)</label>
              <input
                type="number"
                value={current}
                step={0.1}
                min={0}
                onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label>Aumento de temperatura (°C)</label>
              <input
                type="number"
                value={tempRise}
                step={1}
                min={1}
                onChange={(e) => setTempRise(parseFloat(e.target.value) || 1)}
              />
              <span className="hint">ΔT por encima de la temperatura ambiente</span>
            </div>
            <div className="field">
              <label>Espesor de cobre (oz)</label>
              <input
                type="number"
                value={thickness}
                step={0.5}
                min={0.5}
                onChange={(e) => setThickness(parseFloat(e.target.value) || 0.5)}
              />
              <span className="hint">1 oz ≈ 35 µm · Estándar = 1 oz</span>
            </div>
            <div className="field">
              <label>Tipo de capa</label>
              <select
                value={layerType}
                onChange={(e) => setLayerType(e.target.value as LayerType)}
              >
                <option value="external">Capa externa</option>
                <option value="internal">Capa interna</option>
              </select>
            </div>

            <div className="unit-switch">
              <button
                className={`unit-btn${unit === 'mil' ? ' active' : ''}`}
                onClick={() => setUnit('mil')}
                type="button"
              >
                mil
              </button>
              <button
                className={`unit-btn${unit === 'mm' ? ' active' : ''}`}
                onClick={() => setUnit('mm')}
                type="button"
              >
                mm
              </button>
            </div>

            <div className="tool-formula">
              <p>W = I / (k × ΔT^b × t^c)</p>
              <p>k = {constants[layerType].k} ({layerType === 'external' ? 'capa externa' : 'capa interna'})</p>
              <p>b = {constants[layerType].b}, c = {constants[layerType].c}</p>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="result-panel">
            <span className="eyebrow">Ancho de traza requerido</span>
            <div className="result-number">
              {unit === 'mil' ? result.widthMil : result.widthMm}
              <small>{unit}</small>
            </div>
            <p className="result-meta">
              {current} A · ΔT {tempRise} °C · {thickness} oz · {layerType === 'external' ? 'externa' : 'interna'}
            </p>

            <div className="result-row">
              <span className="result-label">Ancho en mil</span>
              <span className="result-value">{result.widthMil} mil</span>
            </div>
            <div className="result-row">
              <span className="result-label">Ancho en mm</span>
              <span className="result-value">{result.widthMm} mm</span>
            </div>
            <div className="result-row">
              <span className="result-label">Área transversal</span>
              <span className="result-value">{result.areaMil2} mil²</span>
            </div>
            <div className="result-row">
              <span className="result-label">Corriente</span>
              <span className="result-value">{current} A</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
