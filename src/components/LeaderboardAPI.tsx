"use client";

import { useEffect, useRef, useState } from "react";
import { FiActivity } from "react-icons/fi";

export default function LeaderboardAPI() {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([
    "GET /api/v1/leaderboard/global 200 OK - 12.4ms",
    "POST /api/v1/score/update 201 CREATED - 8.1ms",
    "GET /api/v1/users/rank/OP_DELTA 200 OK - 15.2ms"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const endpoints = ["/api/v1/leaderboard/global", "/api/v1/score/update", "/api/v1/health"];
      const methods = ["GET", "POST"];
      const statuses = ["200 OK", "201 CREATED", "200 OK"];

      const method = methods[Math.floor(Math.random() * methods.length)];
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const latency = (Math.random() * 20 + 5).toFixed(1);

      const newLog = `${method} ${endpoint} ${status} - ${latency}ms`;

      setLogs(prev => {
        const newLogs = [...prev, newLog];
        if (newLogs.length > 8) return newLogs.slice(newLogs.length - 8);
        return newLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full py-24 px-8 border-t border-white/10 flex flex-col justify-center">

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">

        <div className="md:col-span-8 glass-panel p-10 relative rounded-md">
           <h3 className="font-mono text-sm text-white/60 mb-10 tracking-widest flex items-center gap-3">
             <FiActivity size={18} className="text-[#8B864E]" />
             SYSTEM_ARCHITECTURE
           </h3>

           <div className="relative h-80 border border-white/5 bg-black/20 flex items-center justify-between px-10 font-mono text-base">
              <div className="absolute inset-0 technical-grid opacity-30"></div>

              <div className="z-10 p-5 border border-white/20 bg-[#111111] text-center font-medium">API Gateway</div>

              <div className="h-[2px] bg-[#8B864E] flex-1 mx-6 relative opacity-70">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B864E] text-xs bg-[#111111] px-3 py-1 font-semibold tracking-wide">req/sec: 4,021</div>
              </div>

              <div className="z-10 flex flex-col gap-6">
                 <div className="p-5 border border-white/20 bg-[#111111] text-center font-medium">Redis Cache</div>
                 <div className="p-5 border border-white/20 bg-[#111111] text-center font-medium">Distributed DB</div>
              </div>
           </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-10">
          <div className="glass-panel p-8 border-l-4 border-l-[#8B864E] rounded-md">
             <div className="font-mono text-sm text-white/60 mb-4 tracking-wider">GLOBAL LATENCY (p99)</div>
             <div className="text-6xl font-bold text-[#8B864E] font-mono tracking-tighter">12.4<span className="text-3xl ml-2">ms</span></div>
          </div>

          <div className="glass-panel p-8 flex-1 flex flex-col rounded-md">
             <div className="font-mono text-sm text-white/60 mb-6 border-b border-white/10 pb-4 tracking-wider">LIVE_TRAFFIC_LOG</div>
             <div className="font-mono text-xs md:text-sm space-y-3 text-white/40 overflow-hidden flex-1 relative" ref={logContainerRef}>
                {logs.map((log, i) => (
                  <div key={i} className={`${i === logs.length - 1 ? 'text-white font-medium' : ''} transition-colors duration-300 break-all`}>
                    &gt; {log}
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
