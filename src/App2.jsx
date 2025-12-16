import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Game Hukum Newton + Animasi Orang Mendorong Balok
// F = m * a
function App() {
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(5);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [running, setRunning] = useState(false);
  const requestRef = useRef(null);

  const acceleration = force / mass; // Hukum Newton II
  const delta = 0.016; // ~60fps

  const loop = () => {
    setVelocity((v) => v + acceleration * delta);
    setPosition((p) => p + velocity * delta);
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (running) {
      requestRef.current = requestAnimationFrame(loop);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => requestRef.current && cancelAnimationFrame(requestRef.current);
  }, [running]);

  const reset = () => {
    setVelocity(0);
    setPosition(0);
    setRunning(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Simulasi Dorongan (Hukum Newton)</h1>

      {/* INPUT */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-lg">
        <div className="flex flex-col">
          <label className="font-semibold">Gaya (N)</label>
          <input
            type="number"
            className="p-2 border rounded-xl"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Massa Balok (kg)</label>
          <input
            type="number"
            className="p-2 border rounded-xl"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setRunning(!running)}
          className="bg-blue-600 text-white px-4 py-2 rounded-2xl shadow"
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={reset}
          className="bg-red-600 text-white px-4 py-2 rounded-2xl shadow"
        >
          Reset
        </button>
      </div>

      {/* AREA ANIMASI */}
      <div className="relative w-full max-w-3xl h-40 bg-white rounded-2xl shadow overflow-hidden mb-6">
        {/* Lantai */}
        <div className="absolute bottom-6 left-0 w-full h-2 bg-gray-300" />

        {/* Orang */}
        <motion.div
          className="absolute bottom-8 left-10 w-12 h-20 bg-blue-500 rounded-lg"
          animate={{ x: Math.min(position * 8, 220) }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <div className="w-6 h-6 bg-yellow-300 rounded-full mx-auto mt-1" />
        </motion.div>

        {/* Balok */}
        <motion.div
          className="absolute bottom-8 left-28 w-24 h-16 bg-gray-700 rounded-lg"
          animate={{ x: Math.min(position * 10, 300) }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </div>

      {/* INFO */}
      <div className="mt-4 p-4 bg-white rounded-xl shadow w-full max-w-lg">
        <p><strong>Percepatan (a):</strong> {acceleration.toFixed(2)} m/s²</p>
        <p><strong>Kecepatan (v):</strong> {velocity.toFixed(2)} m/s</p>
        <p><strong>Posisi (x):</strong> {position.toFixed(2)} meter</p>
      </div>
    </div>
  );
}

export default App;