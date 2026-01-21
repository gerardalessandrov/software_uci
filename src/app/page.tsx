"use client";

import { useState } from "react";

/* =======================
   TIPOS
======================= */
type Evaluation = {
  id: number;
  name: string;
  bed: string;
  heartRate: number;
  oxygen: number;
  pressure: number;
  glasgow: number;
  score: number;
  risk: "green" | "yellow" | "red";
};

/* =======================
   CÁLCULO CLÍNICO
======================= */
function calculateScore(v: Omit<Evaluation, "id" | "score" | "risk">) {
  let score = 0;

  if (v.heartRate > 120) score += 3;
  if (v.oxygen < 90) score += 4;
  if (v.pressure < 90) score += 3;
  if (v.glasgow <= 8) score += 4;

  return score;
}

function getRisk(score: number): Evaluation["risk"] {
  if (score >= 10) return "red";
  if (score >= 5) return "yellow";
  return "green";
}

/* =======================
   SEMÁFORO DIGITAL
======================= */
function SemaforoDigital({
  score,
  risk,
}: {
  score: number;
  risk: "green" | "yellow" | "red";
}) {
  const config = {
    green: {
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-700",
      label: "RIESGO BAJO",
      icon: "✔",
    },
    yellow: {
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-700",
      label: "RIESGO MODERADO",
      icon: "⚠",
    },
    red: {
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-700",
      label: "ALTO RIESGO",
      icon: "✖",
    },
  }[risk];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center gap-4">
      <div
        className={`relative w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center border-4 ${config.border} ${config.bg}`}
      >
        <span className={`text-5xl sm:text-6xl font-bold ${config.text}`}>
          {config.icon}
        </span>

        <div
          className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-base sm:text-lg border ${config.border} ${config.bg} ${config.text}`}
        >
          {score}
        </div>
      </div>

      <div
        className={`px-4 py-2 rounded-lg font-bold text-sm sm:text-base border ${config.border} ${config.bg} ${config.text}`}
      >
        {config.label}
      </div>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto">
        Guardar Evaluación
      </button>
    </div>
  );
}

/* =======================
   COMPONENTE PRINCIPAL
======================= */
export default function Page() {
  const [patients, setPatients] = useState<Evaluation[]>([]);
  const [current, setCurrent] = useState<Evaluation | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    bed: "",
    heartRate: "",
    oxygen: "",
    pressure: "",
    glasgow: "",
  });

  // Etiquetas en español para los campos
  const fieldLabels: Record<keyof typeof form, string> = {
    name: "Nombre del Paciente",
    bed: "Número de Cama (Ej: UCI-01)",
    heartRate: "Frecuencia Cardíaca (FC)",
    oxygen: "Saturación de Oxígeno (%)",
    pressure: "Presión Arterial (mmHg)",
    glasgow: "Escala de Glasgow (3-15)",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.bed) {
      alert("Por favor complete el nombre del paciente y número de cama");
      return;
    }

    const clinicalData = {
      name: form.name,
      bed: form.bed,
      heartRate: Number(form.heartRate) || 0,
      oxygen: Number(form.oxygen) || 0,
      pressure: Number(form.pressure) || 0,
      glasgow: Number(form.glasgow) || 0,
    };

    const score = calculateScore(clinicalData);
    const risk = getRisk(score);

    if (editingId) {
      // Modo edición
      setPatients(
        patients.map((p) =>
          p.id === editingId
            ? { ...p, ...clinicalData, score, risk }
            : p
        )
      );
      setEditingId(null);
      alert("Paciente actualizado correctamente");
    } else {
      // Modo crear nuevo
      const newPatient: Evaluation = {
        id: Date.now(),
        ...clinicalData,
        score,
        risk,
      };
      setPatients([newPatient, ...patients]);
      setCurrent(newPatient);
    }

    setForm({
      name: "",
      bed: "",
      heartRate: "",
      oxygen: "",
      pressure: "",
      glasgow: "",
    });
  };

  const handleEdit = (patient: Evaluation) => {
    setForm({
      name: patient.name,
      bed: patient.bed,
      heartRate: String(patient.heartRate),
      oxygen: String(patient.oxygen),
      pressure: String(patient.pressure),
      glasgow: String(patient.glasgow),
    });
    setEditingId(patient.id);
    setCurrent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este paciente?")) {
      setPatients(patients.filter((p) => p.id !== id));
      if (current?.id === id) {
        setCurrent(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      bed: "",
      heartRate: "",
      oxygen: "",
      pressure: "",
      glasgow: "",
    });
  };

  const colorMap = {
    green: "border-green-600 bg-green-50 text-green-700",
    yellow: "border-yellow-500 bg-yellow-50 text-yellow-700",
    red: "border-red-600 bg-red-50 text-red-700",
  };

  const labelMap = {
    green: "RIESGO BAJO",
    yellow: "RIESGO MODERADO",
    red: "ALTO RIESGO",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER RESPONSIVE */}
      <header className="bg-white shadow-md border-b-2 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl">🚦</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Semáforo Digital UCI
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Hospital Regional Docente de Trujillo
                </p>
              </div>
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm sm:text-base text-center">
              👩‍⚕️ Enfermería UCI
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10">

        {/* FORMULARIO RESPONSIVE */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              📋 {editingId ? "Editar" : "Evaluación"} Clínica del Paciente
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                ✖ Cancelar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  {fieldLabels[key as keyof typeof form]}
                </label>
                <input
                  name={key}
                  value={value}
                  type={key === "name" || key === "bed" ? "text" : "number"}
                  onChange={handleChange}
                  placeholder={
                    key === "name"
                      ? "Ej: María García López"
                      : key === "bed"
                      ? "Ej: UCI-01"
                      : key === "heartRate"
                      ? "60-180"
                      : key === "oxygen"
                      ? "0-100"
                      : key === "pressure"
                      ? "60-180"
                      : "3-15"
                  }
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="sm:col-span-2 lg:col-span-3 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="text-xl">🚦</span>
              {editingId ? "Actualizar Paciente" : "Calcular Semáforo de Riesgo"}
            </button>
          </div>
        </section>

        {/* SEMÁFORO RESPONSIVE */}
        {current && !editingId && (
          <section className="flex justify-center">
            <div className="text-center w-full max-w-md">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-4 px-4">
                Resultado para: <span className="text-blue-600">{current.name}</span>
              </h3>
              <SemaforoDigital score={current.score} risk={current.risk} />
            </div>
          </section>
        )}

        {/* LISTA RESPONSIVE */}
        {patients.length > 0 && (
          <>
            <div className="border-t-2 border-gray-200 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                👥 Pacientes Evaluados ({patients.length})
              </h2>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {patients.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-8 ${colorMap[p.risk]} hover:shadow-xl transition`}
                >
                  <div className="flex justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base sm:text-lg truncate">{p.name}</p>
                      <p className="text-xs text-gray-600">🛏️ {p.bed}</p>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold ml-2">{p.score}</span>
                  </div>

                  <div className="grid grid-cols-2 text-xs sm:text-sm gap-2 mb-4 bg-white bg-opacity-50 p-2 sm:p-3 rounded-lg">
                    <p>💓 FC: <strong>{p.heartRate}</strong></p>
                    <p>🫁 O₂: <strong>{p.oxygen}%</strong></p>
                    <p>🩸 PA: <strong>{p.pressure}</strong></p>
                    <p>🧠 Glasgow: <strong>{p.glasgow}</strong></p>
                  </div>

                  <div
                    className={`text-center py-2 rounded-lg font-bold text-xs sm:text-sm mb-3 ${colorMap[p.risk]}`}
                  >
                    {labelMap[p.risk]}
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold transition text-xs sm:text-sm flex items-center justify-center gap-1"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-semibold transition text-xs sm:text-sm flex items-center justify-center gap-1"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {patients.length === 0 && (
          <div className="text-center py-12 px-4 text-gray-400">
            <div className="text-5xl sm:text-6xl mb-4">📋</div>
            <p className="text-base sm:text-lg font-semibold">No hay pacientes evaluados aún</p>
            <p className="text-sm sm:text-base mt-2">Complete el formulario para realizar una evaluación</p>
          </div>
        )}
      </main>
    </div>
  );
}