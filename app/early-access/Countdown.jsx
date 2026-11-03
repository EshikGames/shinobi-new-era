"use client";

import { useEffect, useState } from "react";

function remaining(unlockAt) {
  const milliseconds = new Date(unlockAt).getTime() - Date.now();
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return null;
  const seconds = Math.floor(milliseconds / 1000);
  return [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
}

export default function Countdown({ unlockAt }) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    if (!unlockAt) return;
    const update = () => setTime(remaining(unlockAt));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [unlockAt]);

  if (!unlockAt || !time) return null;
  return (
    <div className="ea-countdown" aria-label="Time until the configured release">
      {time.map((value, index) => (
        <div key={index} className="ea-countdown__unit">
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{["days", "hours", "minutes", "seconds"][index]}</span>
        </div>
      ))}
    </div>
  );
}
