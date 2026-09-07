import { Id } from "../convex/_generated/dataModel";

export type ResultStatus = "FINISHED" | "DNF" | "DNS" | "DISQUALIFIED";

export interface ResultRecord {
  _id: Id<"results">;
  _creationTime: number;
  participantName: string;
  teamName?: string;
  timeMs: number;
  driverImageUrl?: string;
  carImageUrl?: string;
  status: ResultStatus;
  notes?: string;
  runNumber?: number;
  createdAt: number;
  updatedAt: number;
}

export interface LeaderboardEntry extends ResultRecord {
  rank: number | null;
  gapMs: number | null;
  isLeader: boolean;
  previousRank?: number | null;
}

export interface GridStats {
  totalRuns: number;
  finishedRuns: number;
  dnfRuns: number;
  disqualifiedRuns: number;
  dnsRuns: number;
  fastestTimeMs: number | null;
  fastestDriver: string | null;
  fastestTeam: string | null;
  averageTimeMs: number;
}
