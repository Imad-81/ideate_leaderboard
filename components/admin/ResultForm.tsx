"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResultStatus } from "@/lib/types";
import { parseTimeToMs, formatLapTime } from "@/lib/time";
import { PRESET_RACE_CARS, PresetCar } from "@/lib/seedData";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";

interface ResultFormProps {
  onSuccess?: () => void;
}

export function ResultForm({ onSuccess }: ResultFormProps) {
  const createResult = useMutation(api.results.createResult);

  // Form states
  const [participantName, setParticipantName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [driverImageUrl, setDriverImageUrl] = useState("");
  const [carImageUrl, setCarImageUrl] = useState("");
  const [status, setStatus] = useState<ResultStatus>("FINISHED");
  const [runNumber, setRunNumber] = useState<string>("1");
  const [notes, setNotes] = useState("");

  // UI status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parsed time feedback
  const parsedMs = parseTimeToMs(timeInput);

  // Handle Preset selection
  const handleSelectPreset = (preset: PresetCar) => {
    setParticipantName(preset.name);
    setTeamName(preset.team);
    setCarImageUrl(preset.carImageUrl);
    setDriverImageUrl(preset.driverImageUrl);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    const trimmedName = participantName.trim();
    if (!trimmedName) {
      setErrorMsg("Driver / Participant name is required.");
      return;
    }

    let finalTimeMs = 0;
    if (status === "FINISHED") {
      if (!timeInput.trim()) {
        setErrorMsg("Lap time is required for FINISHED status.");
        return;
      }
      if (!parsedMs || parsedMs <= 0) {
        setErrorMsg("Invalid lap time. Please enter seconds (e.g. 18.427) or MM:SS.mmm.");
        return;
      }
      finalTimeMs = parsedMs;
    }

    setIsSubmitting(true);

    try {
      await createResult({
        participantName: trimmedName,
        teamName: teamName.trim() || undefined,
        timeMs: finalTimeMs,
        driverImageUrl: driverImageUrl.trim() || undefined,
        carImageUrl: carImageUrl.trim() || undefined,
        status,
        notes: notes.trim() || undefined,
        runNumber: runNumber ? parseInt(runNumber, 10) : undefined,
      });

      // Show success notification
      setSuccessMsg(`RESULT LOGGED FOR ${trimmedName.toUpperCase()} (${formatLapTime(finalTimeMs)})`);

      // Reset form fields immediately for next competitor
      setParticipantName("");
      setTeamName("");
      setTimeInput("");
      setDriverImageUrl("");
      setCarImageUrl("");
      setStatus("FINISHED");
      setRunNumber("1");
      setNotes("");

      if (onSuccess) onSuccess();

      // Clear success notification after 5 seconds
      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to log result into Convex.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-b from-[#111116] to-[#0a0a0d] p-6 shadow-xl sm:p-8">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-5">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
            TELEMETRY INPUT
          </span>
          <h2
            className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl"
            style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
          >
            LOG RACE RESULT
          </h2>
        </div>

        {/* Quick Presets Picker */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-400 hidden sm:inline">
            Quick Fill:
          </span>
          <div className="flex flex-wrap gap-1">
            {PRESET_RACE_CARS.slice(0, 3).map((car, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(car)}
                className="rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 font-mono text-[11px] text-neutral-300 hover:border-red-500 hover:text-white transition-colors"
              >
                {car.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/50 p-3 font-mono text-xs font-bold text-emerald-400 shadow-lg">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/50 p-3 font-mono text-xs font-bold text-red-400 shadow-lg">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Participant / Driver Name */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              DRIVER / PARTICIPANT <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g. Arjun Nair"
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3.5 py-2.5 font-mono text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              TEAM NAME <span className="text-neutral-500">(OPTIONAL)</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Scuderia Corsa"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3.5 py-2.5 font-mono text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Time Input */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
                LAP TIME <span className="text-red-500">*</span>
              </label>
              {parsedMs ? (
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  Valid: {formatLapTime(parsedMs)} ({parsedMs} ms)
                </span>
              ) : (
                <span className="font-mono text-[11px] text-neutral-500">
                  Format: 18.427 or 00:18.427
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="00:18.427"
                disabled={status !== "FINISHED"}
                className={`w-full rounded-lg border px-3.5 py-2.5 font-mono text-base font-bold text-white placeholder-neutral-600 focus:outline-none focus:ring-1 ${
                  status !== "FINISHED"
                    ? "border-neutral-800 bg-neutral-950 text-neutral-600 cursor-not-allowed"
                    : parsedMs
                    ? "border-emerald-600/60 bg-neutral-900/90 focus:border-emerald-500 focus:ring-emerald-500"
                    : "border-neutral-700 bg-neutral-900/90 focus:border-red-500 focus:ring-red-500"
                }`}
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              STATUS
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ResultStatus)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3.5 py-2.5 font-mono text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="FINISHED">FINISHED</option>
              <option value="DNF">DNF (DID NOT FINISH)</option>
              <option value="DNS">DNS (DID NOT START)</option>
              <option value="DISQUALIFIED">DISQUALIFIED</option>
            </select>
          </div>
        </div>

        {/* Device Image Uploaders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploader
            label="DRIVER PHOTO (UPLOAD FROM DEVICE)"
            value={driverImageUrl}
            onChange={(url) => setDriverImageUrl(url)}
            type="driver"
            aspectRatio="wide"
          />

          <ImageUploader
            label="RACE CAR PHOTO (UPLOAD FROM DEVICE)"
            value={carImageUrl}
            onChange={(url) => setCarImageUrl(url)}
            type="car"
            aspectRatio="wide"
          />
        </div>

        {/* Run # and Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              RUN NUMBER
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={runNumber}
              onChange={(e) => setRunNumber(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3.5 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              MARSHAL NOTES <span className="text-neutral-500">(OPTIONAL)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Apex clip on Turn 2, strong straight line speed"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3.5 py-2 font-mono text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 px-6 font-mono text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/40 transition-all hover:bg-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
          >
            <PlusCircle className="h-5 w-5" />
            <span>{isSubmitting ? "TRANSMITTING TELEMETRY..." : "LOG OFFICIAL RESULT"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
