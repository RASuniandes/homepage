import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function LipoEstimator() {
  const [voltage, setVoltage] = useState<number>(11.1);
  const [capacity, setCapacity] = useState<number>(2200);
  const [cRating, setCRating] = useState<number>(25);
  const [currentDraw, setCurrentDraw] = useState<number>(15);

  const results = useMemo(() => {
    const capacityAh = capacity / 1000;
    const energyWh = voltage * capacityAh;
    const maxContinuousCurrent = capacityAh * cRating;
    const runtimeHours = currentDraw > 0 ? capacityAh / currentDraw : 0;
    const runtimeMinutes = runtimeHours * 60;
    const powerDraw = voltage * currentDraw;
    const isOverdraw = currentDraw > maxContinuousCurrent;
    return {
      energyWh: energyWh.toFixed(2),
      maxContinuousCurrent: maxContinuousCurrent.toFixed(2),
      runtimeMinutes: runtimeMinutes.toFixed(1),
      powerDraw: powerDraw.toFixed(2),
      isOverdraw,
    };
  }, [voltage, capacity, cRating, currentDraw]);

  return (
    <section className="block">
      <div className="wrap">

        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <Link to="/tools">Herramientas</Link>
            <span className="sep">/</span>
            <span>LiPo Estimator</span>
          </nav>
          <span className="eyebrow">Análisis de energía</span>
          <div className="sec-head">
            <h2>Estimador de Batería LiPo</h2>
            <p>Tiempo de ejecución · Seguridad de descarga · Análisis de energía</p>
          </div>
        </div>

        <div className="tool-layout reveal">

          {/* ── Inputs ── */}
          <div className="tool-inputs">
            <div className="field">
              <label>Voltaje de batería (V)</label>
              <input
                type="number"
                value={voltage}
                step={0.1}
                min={0}
                onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
              />
              <span className="hint">3.7 V por celda · 3S = 11.1 V, 4S = 14.8 V</span>
            </div>
            <div className="field">
              <label>Capacidad (mAh)</label>
              <input
                type="number"
                value={capacity}
                step={100}
                min={0}
                onChange={(e) => setCapacity(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label>Clasificación C</label>
              <input
                type="number"
                value={cRating}
                step={1}
                min={1}
                onChange={(e) => setCRating(parseFloat(e.target.value) || 1)}
              />
              <span className="hint">Descarga continua máxima = Capacidad (Ah) × C</span>
            </div>
            <div className="field">
              <label>Corriente de consumo (A)</label>
              <input
                type="number"
                value={currentDraw}
                step={0.5}
                min={0}
                onChange={(e) => setCurrentDraw(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="tool-formula">
              <p>Energía (Wh) = Voltaje × Capacidad (Ah)</p>
              <p>Corriente máxima = Capacidad (Ah) × C-rating</p>
              <p>Tiempo = Capacidad (Ah) ÷ Corriente</p>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="result-panel">
            <span className="eyebrow">Resultados</span>
            <div className="result-number">
              {results.runtimeMinutes}
              <small>min</small>
            </div>
            <p className="result-meta">
              {voltage} V · {capacity} mAh · {cRating}C · {currentDraw} A
            </p>

            <div className="result-row">
              <span className="result-label">Tiempo estimado</span>
              <span className="result-value">{results.runtimeMinutes} min</span>
            </div>
            <div className="result-row">
              <span className="result-label">Capacidad energética</span>
              <span className="result-value">{results.energyWh} Wh</span>
            </div>
            <div className="result-row">
              <span className="result-label">Consumo de potencia</span>
              <span className="result-value">{results.powerDraw} W</span>
            </div>
            <div className="result-row">
              <span className="result-label">Corriente continua máxima</span>
              <span className="result-value">{results.maxContinuousCurrent} A</span>
            </div>

            {results.isOverdraw && (
              <div className="warning-banner">
                El consumo ({currentDraw} A) excede la descarga continua segura ({results.maxContinuousCurrent} A). Riesgo de daño a la batería.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
