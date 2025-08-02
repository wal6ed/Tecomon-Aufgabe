"use client";

import { useEffect, useState } from "react";
import {
  SunIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

interface Widget {
  _id: string;
  location: string;
  createdAt: string;
  weather?: WeatherData;
}

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
  time: string;
  interval: number;
}

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const loadWidgets = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/widgets");
        if (!res.ok) throw new Error("Widgets konnten nicht geladen werden");
        const data: Widget[] = await res.json();

        const widgetsWithWeather = await Promise.all(
          data.map(async (w) => {
            const weatherRes = await fetch(
              `http://localhost:5000/widgets/${w.location}/weather`
            );
            if (!weatherRes.ok)
              throw new Error(`Wetterdaten für ${w.location} konnten nicht geladen werden`);
            const weather = await weatherRes.json();
            return { ...w, weather };
          })
        );

        setWidgets(widgetsWithWeather);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler beim Laden der Widgets");
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, []);

  useEffect(() => {
    if (widgets.length === 0) return;

    const intervalId = setInterval(async () => {
      try {
        const updatedWidgets = await Promise.all(
          widgets.map(async (w) => {
            const weatherRes = await fetch(
              `http://localhost:5000/widgets/${w.location}/weather`
            );
            if (!weatherRes.ok)
              throw new Error(`Wetterdaten für ${w.location} konnten nicht aktualisiert werden`);
            const weather = await weatherRes.json();
            return { ...w, weather };
          })
        );
        setWidgets(updatedWidgets);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler beim Aktualisieren der Wetterdaten");
      }
    }, 300000);

    return () => clearInterval(intervalId);
  }, [widgets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation.trim() }),
      });
      if (!res.ok) throw new Error("Fehler beim Erstellen des Widgets");

      const widget: Widget = await res.json();

      const weatherRes = await fetch(
        `http://localhost:5000/widgets/${widget.location}/weather`
      );
      if (!weatherRes.ok)
        throw new Error(`Wetterdaten für ${widget.location} konnten nicht geladen werden`);
      const weather = await weatherRes.json();

      setWidgets((prev) => [...prev, { ...widget, weather }]);
      setNewLocation("");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler beim Hinzufügen des Widgets");
    }
  };

  const deleteWidget = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/widgets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Fehler beim Löschen des Widgets");

      setWidgets((prev) => prev.filter((w) => w._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler beim Löschen des Widgets");
    }
  };

  // Wählt Icon basierend auf weathercode
  const weatherIcon = (code: number, isDay: number) => {
    if ([0, 1, 2, 3].includes(code)) return <SunIcon className="w-8 h-8 text-yellow-400" />;
    if ([45, 48].includes(code)) return <CloudIcon className="w-8 h-8 text-gray-400" />;
    return <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />;
  };

  const describeWeather = (code: number) => {
    const codes: Record<number, string> = {
      0: "Klarer Himmel",
      1: "Leicht bewölkt",
      2: "Teilweise bewölkt",
      3: "Bewölkt",
      45: "Nebel",
      48: "Reif",
      51: "Leichter Nieselregen",
      53: "Mäßiger Nieselregen",
      55: "Starker Nieselregen",
      61: "Leichter Regen",
      63: "Mäßiger Regen",
      65: "Starker Regen",
      71: "Leichter Schneefall",
      73: "Mäßiger Schneefall",
      75: "Starker Schneefall",
      80: "Regenschauer",
      81: "Starke Regenschauer",
      82: "Sehr starke Regenschauer",
      95: "Gewitter",
      96: "Leichtes Gewitter mit Hagel",
      99: "Starkes Gewitter mit Hagel",
    };
    return codes[code] || "Unbekannt";
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-gradient-to-b from-sky-100 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-sky-700">
        🌤️ Wetter-Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-center font-semibold">
          Fehler: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 flex gap-3 justify-center">
        <input
          type="text"
          placeholder="Stadt eingeben..."
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          required
          className="flex-grow max-w-xs border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-400 shadow-sm text-black"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-semibold shadow-md transition"
          aria-label="Widget hinzufügen"
        >
          <PlusIcon className="w-5 h-5" />
          Hinzufügen
        </button>
      </form>

      {loading && (
        <p className="text-center text-sky-600 font-medium">Widgets und Wetterdaten werden geladen...</p>
      )}

      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {widgets.map((widget) => (
          <li
            key={widget._id}
            className="border border-gray-300 rounded p-4 relative"
          >
            <div>{widget.weather && weatherIcon(widget.weather.weathercode, widget.weather.is_day)}</div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-sky-700">{widget.location}</h2>
              {widget.weather ? (
                <div className="mt-2 text-gray-700 space-y-1">
                  <p>
                    🌡 <span className="font-semibold">{widget.weather.temperature}°C</span> —{" "}
                    {describeWeather(widget.weather.weathercode)}
                  </p>
                  <p>
                    💨 Wind: <span className="font-semibold">{widget.weather.windspeed} km/h</span> (
                    {widget.weather.winddirection}°)
                  </p>
                  <p>{widget.weather.is_day ? "🌞 Tag" : "🌙 Nacht"}</p>
                </div>
              ) : (
                <p className="italic text-gray-400">⏳ Wetterdaten werden geladen...</p>
              )}
            </div>

            <button
              onClick={() => deleteWidget(widget._id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
              aria-label={`Widget für ${widget.location} löschen`}
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
