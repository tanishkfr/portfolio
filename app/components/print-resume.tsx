"use client";

export function PrintResume() {
  return (
    <button type="button" className="resume-print" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
