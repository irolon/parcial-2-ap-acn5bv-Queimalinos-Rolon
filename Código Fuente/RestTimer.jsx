// Código Fuente/RestTimer.jsx
// HU-13 — Timer de descanso entre series
// Como alumno, quiero un timer de descanso entre series, para respetar
// los tiempos pautados en la rutina.

import { useState, useEffect, useRef } from "react";

export default function RestTimer({ segundos = 90, onFin }) {
  const [restante, setRestante] = useState(segundos);
  const [activo, setActivo] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!activo) return;
    intervalRef.current = setInterval(() => {
      setRestante((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setActivo(false);
          onFin?.(); // notifica cuando termina el descanso
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [activo, onFin]);

  const mmss =
    `${String(Math.floor(restante / 60)).padStart(2, "0")}:` +
    `${String(restante % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800 text-white">
      <span className="text-4xl font-mono tabular-nums">{mmss}</span>
      <div className="flex gap-2">
        <button onClick={() => setActivo(true)} disabled={activo}>
          Iniciar
        </button>
        <button onClick={() => { setActivo(false); setRestante(segundos); }}>
          Reiniciar
        </button>
        <button onClick={() => { setActivo(false); setRestante(0); onFin?.(); }}>
          Saltar
        </button>
      </div>
    </div>
  );
}
