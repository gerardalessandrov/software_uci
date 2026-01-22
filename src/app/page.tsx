"use client";

import { useState } from "react";

/* =======================
   TIPOS
======================= */
type Evaluation = {
  id: number;
  name: string;
  bed: string;
  dni: string;
  age: number;
  // Escala de Braden (6 dimensiones)
  sensoryPerception: number;  // 1-4
  moisture: number;            // 1-4
  activity: number;            // 1-4
  mobility: number;            // 1-4
  nutrition: number;           // 1-4
  frictionShear: number;       // 1-3
  score: number;
  risk: "green" | "yellow" | "red" | "none";
};

/* =======================
   CÁLCULO ESCALA DE BRADEN
======================= */
function calculateBradenScore(v: Omit<Evaluation, "id" | "score" | "risk">) {
  const score = v.sensoryPerception + v.moisture + v.activity + v.mobility + v.nutrition + v.frictionShear;
  return score;
}

function getRisk(score: number): Evaluation["risk"] {
  if (score <= 12) return "red";      // Alto riesgo
  if (score >= 13 && score <= 14) return "yellow";  // Riesgo moderado
  if (score >= 15 && score <= 18) return "green";   // Riesgo bajo
  return "none";  // > 18 = Sin riesgo
}

/* =======================
   CRITERIOS DE BRADEN
======================= */
const bradenCriteria = {
  sensoryPerception: {
    title: "1. Percepción Sensorial",
    description: "Capacidad para responder al dolor o molestias",
    options: [
      { value: 1, label: "Completamente limitada", desc: "No responde a estímulos dolorosos" },
      { value: 2, label: "Muy limitada", desc: "Responde solo a estímulos dolorosos" },
      { value: 3, label: "Ligeramente limitada", desc: "Responde a órdenes verbales" },
      { value: 4, label: "Sin limitación", desc: "Responde normalmente, sin déficit sensorial" },
    ],
  },
  moisture: {
    title: "2. Humedad",
    description: "Grado de exposición de la piel a la humedad",
    options: [
      { value: 1, label: "Constantemente húmeda", desc: "Siempre húmeda por sudor, orina, etc." },
      { value: 2, label: "Muy húmeda", desc: "Húmeda frecuentemente" },
      { value: 3, label: "Ocasionalmente húmeda", desc: "Requiere cambio ropa/sábanas 1 vez al día" },
      { value: 4, label: "Raramente húmeda", desc: "Piel generalmente seca" },
    ],
  },
  activity: {
    title: "3. Actividad",
    description: "Grado de actividad física",
    options: [
      { value: 1, label: "Encamado", desc: "Confinado a la cama" },
      { value: 2, label: "En silla", desc: "Capacidad de caminar muy limitada" },
      { value: 3, label: "Deambula ocasionalmente", desc: "Camina ocasionalmente durante el día" },
      { value: 4, label: "Deambula frecuentemente", desc: "Camina fuera de la habitación 2+ veces/día" },
    ],
  },
  mobility: {
    title: "4. Movilidad",
    description: "Capacidad para cambiar y controlar posición del cuerpo",
    options: [
      { value: 1, label: "Completamente inmóvil", desc: "No realiza cambios de posición" },
      { value: 2, label: "Muy limitada", desc: "Realiza cambios ocasionales" },
      { value: 3, label: "Ligeramente limitada", desc: "Realiza cambios frecuentes leves" },
      { value: 4, label: "Sin limitación", desc: "Realiza cambios frecuentes sin ayuda" },
    ],
  },
  nutrition: {
    title: "5. Nutrición",
    description: "Patrón usual de ingesta alimentaria",
    options: [
      { value: 1, label: "Muy pobre", desc: "Nunca come una comida completa" },
      { value: 2, label: "Probablemente inadecuada", desc: "Raramente come una comida completa" },
      { value: 3, label: "Adecuada", desc: "Come más de la mitad de las comidas" },
      { value: 4, label: "Excelente", desc: "Come la mayor parte de cada comida" },
    ],
  },
  frictionShear: {
    title: "6. Fricción y Cizallamiento",
    description: "Rozaduras o deslizamientos sobre cama/silla",
    options: [
      { value: 1, label: "Problema", desc: "Requiere asistencia moderada a máxima para moverse" },
      { value: 2, label: "Problema potencial", desc: "Se mueve débilmente, requiere mínima asistencia" },
      { value: 3, label: "Sin problema aparente", desc: "Se mueve independientemente en cama/silla" },
    ],
  },
};

/* =======================
   SEMÁFORO DIGITAL
======================= */
function SemaforoDigital({
  score,
  risk,
}: {
  score: number;
  risk: "green" | "yellow" | "red" | "none";
}) {
  const config = {
    none: {
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-700",
      label: "SIN RIESGO",
      icon: "★",
    },
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
        className={`relative w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center border-4 ${config.border} ${config.bg} ${risk === "red" ? "animate-pulse" : ""}`}
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

      <div className="text-center text-sm text-gray-600 mt-2">
        <p className="font-semibold">Puntuación Total: {score} / 23</p>
        <p className="text-xs mt-1">
          {score <= 12 && "⚠️ Requiere intervención inmediata"}
          {score >= 13 && score <= 14 && "⚡ Implementar medidas preventivas"}
          {score >= 15 && score <= 18 && "✅ Vigilancia periódica"}
          {score > 18 && "🎉 Estado óptimo"}
        </p>
      </div>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto">
        💾 Guardar Evaluación
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
    dni: "",
    age: "",
    sensoryPerception: "4",
    moisture: "4",
    activity: "4",
    mobility: "4",
    nutrition: "4",
    frictionShear: "3",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.bed) {
      alert("⚠️ Por favor complete el nombre del paciente y número de cama");
      return;
    }

    const clinicalData = {
      name: form.name,
      bed: form.bed,
      dni: form.dni || "Sin DNI",
      age: Number(form.age) || 0,
      sensoryPerception: Number(form.sensoryPerception),
      moisture: Number(form.moisture),
      activity: Number(form.activity),
      mobility: Number(form.mobility),
      nutrition: Number(form.nutrition),
      frictionShear: Number(form.frictionShear),
    };

    const score = calculateBradenScore(clinicalData);
    const risk = getRisk(score);

    if (editingId) {
      setPatients(
        patients.map((p) =>
          p.id === editingId ? { ...p, ...clinicalData, score, risk } : p
        )
      );
      setEditingId(null);
      alert("✅ Paciente actualizado correctamente");
    } else {
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
      dni: "",
      age: "",
      sensoryPerception: "4",
      moisture: "4",
      activity: "4",
      mobility: "4",
      nutrition: "4",
      frictionShear: "3",
    });
  };

  const handleEdit = (patient: Evaluation) => {
    setForm({
      name: patient.name,
      bed: patient.bed,
      dni: patient.dni,
      age: String(patient.age),
      sensoryPerception: String(patient.sensoryPerception),
      moisture: String(patient.moisture),
      activity: String(patient.activity),
      mobility: String(patient.mobility),
      nutrition: String(patient.nutrition),
      frictionShear: String(patient.frictionShear),
    });
    setEditingId(patient.id);
    setCurrent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (confirm("⚠️ ¿Está seguro de eliminar este paciente?")) {
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
      dni: "",
      age: "",
      sensoryPerception: "4",
      moisture: "4",
      activity: "4",
      mobility: "4",
      nutrition: "4",
      frictionShear: "3",
    });
  };

  const colorMap = {
    none: "border-blue-600 bg-blue-50 text-blue-700",
    green: "border-green-600 bg-green-50 text-green-700",
    yellow: "border-yellow-500 bg-yellow-50 text-yellow-700",
    red: "border-red-600 bg-red-50 text-red-700",
  };

  const labelMap = {
    none: "SIN RIESGO",
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
                  Semáforo Digital UCI - Escala de Braden
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

        {/* INFO BRADEN */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
          <h3 className="font-bold text-sm sm:text-base text-blue-900 mb-2">ℹ️ Escala de Braden para Úlceras por Presión</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
            <div className="bg-red-100 border border-red-300 px-2 py-1 rounded">≤12: <strong>Alto riesgo</strong></div>
            <div className="bg-yellow-100 border border-yellow-300 px-2 py-1 rounded">13-14: <strong>Moderado</strong></div>
            <div className="bg-green-100 border border-green-300 px-2 py-1 rounded">15-18: <strong>Bajo</strong></div>
            <div className="bg-blue-100 border border-blue-300 px-2 py-1 rounded">&gt;18: <strong>Sin riesgo</strong></div>
          </div>
        </div>

        {/* FORMULARIO RESPONSIVE */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              📋 {editingId ? "Editar" : "Nueva"} Evaluación de Braden
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

          {/* Datos del Paciente */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">👤 Datos del Paciente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 block">Nombre Completo *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: María García López"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 block">Cama *</label>
                <input
                  name="bed"
                  value={form.bed}
                  onChange={handleChange}
                  placeholder="Ej: UCI-01"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 block">DNI</label>
                <input
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  placeholder="12345678"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 block">Edad</label>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="0-120"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Criterios de Braden */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">🏥 Criterios de Evaluación</h3>
            {Object.entries(bradenCriteria).map(([key, criterion]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{criterion.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{criterion.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {criterion.options.map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition ${
                        form[key as keyof typeof form] === String(option.value)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={key}
                        value={option.value}
                        checked={form[key as keyof typeof form] === String(option.value)}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-2">
                        <span className="text-lg font-bold text-blue-600">{option.value}</span>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm text-gray-800">{option.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span className="text-xl">🚦</span>
            {editingId ? "Actualizar Evaluación" : "Calcular Riesgo de Úlceras"}
          </button>
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
                      <p className="text-xs text-gray-600">🛏️ {p.bed} • {p.age} años</p>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold ml-2">{p.score}</span>
                  </div>

                  <div className="grid grid-cols-3 text-xs gap-2 mb-4 bg-white bg-opacity-50 p-2 sm:p-3 rounded-lg">
                    <div><span className="text-gray-500">Sensorial:</span> <strong>{p.sensoryPerception}</strong></div>
                    <div><span className="text-gray-500">Humedad:</span> <strong>{p.moisture}</strong></div>
                    <div><span className="text-gray-500">Actividad:</span> <strong>{p.activity}</strong></div>
                    <div><span className="text-gray-500">Movilidad:</span> <strong>{p.mobility}</strong></div>
                    <div><span className="text-gray-500">Nutrición:</span> <strong>{p.nutrition}</strong></div>
                    <div><span className="text-gray-500">Fricción:</span> <strong>{p.frictionShear}</strong></div>
                  </div>

                  <div
                    className={`text-center py-2 rounded-lg font-bold text-xs sm:text-sm mb-3 ${colorMap[p.risk]}`}
                  >
                    {labelMap[p.risk]}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold transition text-xs sm:text-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-semibold transition text-xs sm:text-sm"
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
            <p className="text-sm sm:text-base mt-2">Complete el formulario de Braden para realizar una evaluación</p>
          </div>
        )}
      </main>
    </div>
  );
}