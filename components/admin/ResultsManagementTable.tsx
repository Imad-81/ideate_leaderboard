"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResultRecord, ResultStatus } from "@/lib/types";
import { formatLapTime, parseTimeToMs } from "@/lib/time";
import { CarImageFallback } from "@/components/common/CarImageFallback";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  RotateCcw,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export function ResultsManagementTable() {
  const allResults = useQuery(api.results.getAllResults) as ResultRecord[] | undefined;
  const updateResult = useMutation(api.results.updateResult);
  const deleteResult = useMutation(api.results.deleteResult);
  const seedDemoData = useMutation(api.results.seedDemoData);
  const clearAllResults = useMutation(api.results.clearAllResults);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Edit Modal state
  const [editingItem, setEditingItem] = useState<ResultRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editTimeInput, setEditTimeInput] = useState("");
  const [editStatus, setEditStatus] = useState<ResultStatus>("FINISHED");
  const [editDriverUrl, setEditDriverUrl] = useState("");
  const [editCarUrl, setEditCarUrl] = useState("");
  const [editRunNumber, setEditRunNumber] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<ResultRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seed / Clear states
  const [isSeeding, setIsSeeding] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Open Edit Modal
  const handleOpenEdit = (item: ResultRecord) => {
    setEditingItem(item);
    setEditName(item.participantName);
    setEditTeam(item.teamName || "");
    setEditTimeInput(item.status === "FINISHED" ? formatLapTime(item.timeMs) : "");
    setEditStatus(item.status);
    setEditDriverUrl(item.driverImageUrl || "");
    setEditCarUrl(item.carImageUrl || "");
    setEditRunNumber(item.runNumber ? item.runNumber.toString() : "1");
    setEditNotes(item.notes || "");
    setEditError(null);
  };

  // Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setEditError("Driver name cannot be empty.");
      return;
    }

    let parsedMs = 0;
    if (editStatus === "FINISHED") {
      parsedMs = parseTimeToMs(editTimeInput) || 0;
      if (parsedMs <= 0) {
        setEditError("Lap time must be a valid positive number.");
        return;
      }
    }

    setIsUpdating(true);
    setEditError(null);

    try {
      await updateResult({
        id: editingItem._id,
        participantName: trimmedName,
        teamName: editTeam.trim() || undefined,
        timeMs: parsedMs,
        driverImageUrl: editDriverUrl.trim() || undefined,
        carImageUrl: editCarUrl.trim() || undefined,
        status: editStatus,
        notes: editNotes.trim() || undefined,
        runNumber: editRunNumber ? parseInt(editRunNumber, 10) : undefined,
      });

      setEditingItem(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update record.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteResult({ id: deletingId._id });
      setDeletingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed Demo Grid
  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Clear Grid
  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllResults();
      setShowClearConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClearing(false);
    }
  };

  // Filtered list
  const filteredList = (allResults || []).filter((item) => {
    const matchesSearch =
      item.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.teamName && item.teamName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-8 rounded-2xl border border-neutral-800 bg-gradient-to-b from-[#111116] to-[#0a0a0d] p-6 shadow-xl sm:p-8">
      {/* Top Header & Fast Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800/80 pb-5">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
            GRID MANAGEMENT
          </span>
          <h3
            className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl"
            style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
          >
            ALL LOGGED RESULTS ({allResults?.length || 0})
          </h3>
        </div>

        {/* Global Actions: Seed & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-3.5 py-2 font-mono text-xs font-bold text-purple-300 transition-all hover:bg-purple-900/60 active:scale-95 disabled:opacity-50"
          >
            {isSeeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-purple-400" />}
            <span>SEED DEMO GRID</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-3.5 py-2 font-mono text-xs font-bold text-red-400 transition-all hover:bg-red-900/50 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>RESET GRID</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search driver, team, or notes..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 pl-10 pr-4 py-2 font-mono text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900/90 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="FINISHED">FINISHED</option>
            <option value="DNF">DNF</option>
            <option value="DNS">DNS</option>
            <option value="DISQUALIFIED">DISQUALIFIED</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-neutral-800 bg-neutral-950/90 uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="py-3 px-4">DRIVER / CAR</th>
              <th className="py-3 px-4">TEAM</th>
              <th className="py-3 px-4">LAP TIME</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">RUN</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 bg-neutral-900/40 text-neutral-200">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">
                  No records match your criteria. Use the form above to add a participant or seed demo data.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item._id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <CarImageFallback
                        src={item.driverImageUrl}
                        alt={item.participantName}
                        type="driver"
                        containerClassName="h-8 w-8 rounded overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white uppercase block">
                          {item.participantName}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] text-neutral-500 line-clamp-1">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {item.teamName || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white text-sm">
                      {item.status === "FINISHED" ? formatLapTime(item.timeMs) : "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "FINISHED"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : item.status === "DNF"
                          ? "bg-red-950/60 text-red-400 border border-red-500/30"
                          : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {item.runNumber ? `#${item.runNumber}` : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(item)}
                        className="rounded p-1.5 text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full rounded-2xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h4 className="font-mono text-base font-bold uppercase text-white">
                EDIT ENTRY • {editingItem.participantName}
              </h4>
              <button
                onClick={() => setEditingItem(null)}
                className="text-neutral-500 hover:text-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-3 rounded border border-red-500/40 bg-red-950/40 p-2 font-mono text-xs text-red-400">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-neutral-300 mb-1">
                  DRIVER NAME
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-neutral-300 mb-1">
                    TEAM
                  </label>
                  <input
                    type="text"
                    value={editTeam}
                    onChange={(e) => setEditTeam(e.target.value)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-neutral-300 mb-1">
                    STATUS
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ResultStatus)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="FINISHED">FINISHED</option>
                    <option value="DNF">DNF</option>
                    <option value="DNS">DNS</option>
                    <option value="DISQUALIFIED">DISQUALIFIED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-neutral-300 mb-1">
                    LAP TIME (SS.mmm)
                  </label>
                  <input
                    type="text"
                    value={editTimeInput}
                    onChange={(e) => setEditTimeInput(e.target.value)}
                    disabled={editStatus !== "FINISHED"}
                    placeholder="18.427"
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-neutral-300 mb-1">
                    RUN #
                  </label>
                  <input
                    type="number"
                    value={editRunNumber}
                    onChange={(e) => setEditRunNumber(e.target.value)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ImageUploader
                  label="DRIVER PHOTO"
                  value={editDriverUrl}
                  onChange={(url) => setEditDriverUrl(url)}
                  type="driver"
                  aspectRatio="wide"
                />

                <ImageUploader
                  label="RACE CAR PHOTO"
                  value={editCarUrl}
                  onChange={(url) => setEditCarUrl(url)}
                  type="car"
                  aspectRatio="wide"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-neutral-300 mb-1">
                  NOTES
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded px-4 py-2 font-mono text-xs text-neutral-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded bg-red-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "SAVING..." : "UPDATE ENTRY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-500/40 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="font-mono text-base font-bold uppercase text-white">
                DELETE ENTRY CONFIRMATION
              </h4>
            </div>

            <p className="font-mono text-xs text-neutral-300 mb-6">
              Are you sure you want to remove{" "}
              <strong className="text-white">{deletingId.participantName}</strong> from the official leaderboard? This action is instantaneous and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded px-4 py-2 font-mono text-xs text-neutral-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded bg-red-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "DELETING..." : "CONFIRM DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Grid All Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-600 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="font-mono text-base font-bold uppercase text-white">
                RESET RACE GRID?
              </h4>
            </div>

            <p className="font-mono text-xs text-neutral-300 mb-6">
              This will wipe ALL logged race results from the live leaderboard. Only do this before starting a brand new race session!
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded px-4 py-2 font-mono text-xs text-neutral-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isClearing}
                className="rounded bg-red-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isClearing ? "CLEARING..." : "YES, RESET ENTIRE GRID"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
