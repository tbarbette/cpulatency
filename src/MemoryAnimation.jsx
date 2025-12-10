import React, { useState } from 'react';
import { CpuCore } from './CpuCore';
import './MemoryAnimation.css';


const CORES = 4;
const CORE_SIZE = 200;
const CPU_WIDTH = 800;
const CPU_HEIGHT = 800;
const CPU_MARGIN = 20;
const LLC_RADIUS = 50;
const RAM_WIDTH = 80;
const RAM_HEIGHT = CPU_HEIGHT - 2 * CPU_MARGIN;
const DOTS_PER_LEVEL = 1;

const COLORS = {
  L1: '#4caf50',
  L2: '#2196f3',
  L3: '#ff9800',
  RAM: '#e91e63',
  REGISTER: '#9c27b0',
  ALU: '#607d8b',
  CORE: '#bdbdbd',
  CPU: '#e0e0e0',
};

const DEFAULT_LATENCIES = {
  L1: 2,
  L2: 6,
  L3: 18,
  RAM: 100,
};

function getCorePositions() {
  // Arrange cores at the corners of a square inside the CPU
  const cx = CPU_WIDTH / 2;
  const cy = CPU_HEIGHT / 2;
  const offset = 180;
  return [
    { x: cx - offset, y: cy - offset }, // top-left
    { x: cx + offset, y: cy - offset }, // top-right
    { x: cx - offset, y: cy + offset }, // bottom-left
    { x: cx + offset, y: cy + offset }, // bottom-right
  ];
}


function MemoryAnimation() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );
  const [latencies, setLatencies] = useState(DEFAULT_LATENCIES);
  // scale: 1 = real speed, 1_000_000_000 = 1ns = 1s
  const MAX_SCALE = 1_000_000_000;
  const MIN_SCALE = 1_000;
  const [speedScale, setSpeedScale] = useState(MAX_SCALE/10);
  // Dots: each dot goes from a source (RAM, LLC, L2, L1) to the register of a core
  const corePositions = getCorePositions();
  const [dots, setDots] = useState(() => {
    // For each core, create dots for each memory level
    let arr = [];
    corePositions.forEach((core, coreIdx) => {
      ['RAM', 'L3', 'L2', 'L1'].forEach((level) => {
        for (let j = 0; j < DOTS_PER_LEVEL; j++) {
          arr.push({
            id: `${level}-core${coreIdx}-dot${j}`,
            core: coreIdx,
            from: level,
            to: 'REGISTER',
            progress: Math.random(),
            direction: 1,
          });
        }
      });
    });
    return arr;
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) =>
        prevDots.map((dot) => {
          const latency = latencies[dot.from] || 40;
          // slowdown: 1ns = speedScale ns in real time (default 1_000_000_000)
          // Each dot should take latency * speedScale nanoseconds for a full trip
          // 1 second = 1000ms, so for 60fps, each frame is ~16.67ms
          // progress increment = frameTime / (latency * speedScale * 1e-9)
          const frameTime = 16.67; // ms per frame
          const totalTimeMs = latency * speedScale * 1e-6; // ns to ms
          const baseSpeed = totalTimeMs > 0 ? frameTime / totalTimeMs : 0.001;
          let progress = dot.progress + dot.direction * baseSpeed;
          let direction = dot.direction;
          if (progress >= 1) {
            progress = 1;
            direction = -1;
          } else if (progress <= 0) {
            progress = 0;
            direction = 1;
          }
          return { ...dot, progress, direction };
        })
      );
    }, 16);
    return () => clearInterval(interval);
  }, [speedScale, latencies.L1, latencies.L2, latencies.L3, latencies.RAM]);

  // Positions
  const cpuCx = CPU_WIDTH / 2;
  const cpuCy = CPU_HEIGHT / 2;
  // LLC (L3) in the center
  const llcX = cpuCx;
  const llcY = cpuCy;
  // RAM to the right of the CPU, same height as CPU, no overlap
  const ramX = CPU_WIDTH - CPU_MARGIN + RAM_WIDTH / 2 + 10;
  const ramY = cpuCy;

  const textColor = isDark ? '#f5f5f5' : '#333';

  return (
    <div className={`memory-animation-container ${isDark ? 'dark' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h2 style={{ margin: 0 }}>CPU Memory Access Latency Animation</h2>
        <button
          className="theme-toggle"
          aria-label="Toggle theme"
          onClick={() => setIsDark((d) => !d)}
        >
          {isDark ? '☾' : '☀︎'}
        </button>
      </div>
      <div className="slider-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span>Towards real speed (/1000)</span>
          <span>
            <label htmlFor="speed">Slowdown (/{speedScale})</label>
            <br />
            <input
              id="speed"
              type="range"
              min={Math.log10(MIN_SCALE)}
              max={Math.log10(MAX_SCALE)}
              step={1}
              value={Math.log10(speedScale)}
              onChange={(e) => setSpeedScale(Math.pow(10, Number(e.target.value)))}
            />
          </span>
          <span>Max slowdown (1ns = 1s)</span>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${CPU_WIDTH + RAM_WIDTH + 10} ${CPU_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* CPU group rectangle */}
          <rect
            x={CPU_MARGIN}
            y={CPU_MARGIN}
            width={CPU_WIDTH - 2 * CPU_MARGIN}
            height={CPU_HEIGHT - 2 * CPU_MARGIN}
            rx={40}
            fill={COLORS.CPU}
            stroke="#bbb"
            strokeWidth={3}
            opacity={0.5}
          />
          <text
            x={CPU_WIDTH / 2}
            y={CPU_MARGIN + 32}
            textAnchor="middle"
            fontSize="32"
            fill={textColor}
            fontWeight="bold"
          >
            CPU
          </text>
          {/* RAM */}
          <rect
            x={CPU_WIDTH - CPU_MARGIN + 10}
            y={CPU_MARGIN}
            width={RAM_WIDTH}
            height={RAM_HEIGHT}
            rx={12}
            fill={COLORS.RAM}
          />
          <text
            x={CPU_WIDTH - CPU_MARGIN + 10 + RAM_WIDTH / 2}
            y={cpuCy}
            textAnchor="middle"
            fontSize="18"
            fill={textColor}
          >
            RAM
          </text>
          {/* LLC (L3) center */}
          <rect
            x={llcX - LLC_RADIUS}
            y={llcY - LLC_RADIUS}
            width={LLC_RADIUS * 2}
            height={LLC_RADIUS * 2}
            rx={12}
            fill={COLORS.L3}
          />
          <text
            x={llcX}
            y={llcY + LLC_RADIUS + 18}
            textAnchor="middle"
            fontSize="18"
            fill={textColor}
          >
            LLC (L3)
          </text>
          {/* Cores */}
          {corePositions.map((core, i) => (
            <CpuCore key={i} x={core.x} y={core.y} size={CORE_SIZE} coreIndex={i} />
          ))}
          {/* Animated dots */}
          {dots.map((dot) => {
            const core = corePositions[dot.core];
            const padding = CORE_SIZE * 0.12;
            const innerW = CORE_SIZE - 2 * padding;
            const innerH = CORE_SIZE - 2 * padding;
            let fromX, fromY, toX, toY;

            if (dot.from === 'RAM') {
              const midProgress = latencies.L3 / latencies.RAM;
              if (dot.progress >= midProgress) {
                fromX = ramX;
                fromY = ramY;
                toX = llcX;
                toY = llcY;

                const x =
                  fromX +
                  (toX - fromX) * (1 - (dot.progress - midProgress) / (1 - midProgress));
                const y =
                  fromY +
                  (toY - fromY) * (1 - (dot.progress - midProgress) / (1 - midProgress));
                return (
                  <circle
                    key={dot.id}
                    cx={x}
                    cy={y}
                    r={10}
                    fill={COLORS.RAM}
                    opacity={0.85}
                  />
                );
              } else {
                fromX = llcX;
                fromY = llcY;
                const l1X = core.x - innerW / 4;
                const l1Y = core.y - innerH / 4;
                toX = l1X;
                toY = l1Y + innerH * 0.5;
                const x = fromX + (toX - fromX) * (1 - dot.progress / midProgress);
                const y = fromY + (toY - fromY) * (1 - dot.progress / midProgress);
                return (
                  <circle
                    key={dot.id}
                    cx={x}
                    cy={y}
                    r={10}
                    fill={COLORS.RAM}
                    opacity={0.85}
                  />
                );
              }
            } else if (dot.from === 'L3') {
              fromX = llcX;
              fromY = llcY;
            } else if (dot.from === 'L2') {
              fromX = core.x + innerW / 4;
              fromY = core.y - innerH / 4;
            } else if (dot.from === 'L1') {
              fromX = core.x - innerW / 4;
              fromY = core.y - innerH / 4;
            }
            // Register aligned below L1
            const l1X = core.x - innerW / 4;
            const l1Y = core.y - innerH / 4;
            toX = l1X;
            toY = l1Y + innerH * 0.5;
            const x = fromX + (toX - fromX) * dot.progress;
            const y = fromY + (toY - fromY) * dot.progress;
            return (
              <circle
                key={dot.id}
                cx={x}
                cy={y}
                r={10}
                fill={COLORS[dot.from] || '#333'}
                opacity={0.85}
              />
            );
          })}
        </svg>
      </div>
      <div className="legend">
        <div style={{ marginTop: 16 }}>
          <strong>Latencies (ns):</strong>
          {Object.keys(latencies).map((key) => (
            <div
              key={key}
              style={{ margin: 4, display: 'inline-block', marginRight: 12 }}
            >
              <label htmlFor={`latency-${key}`}>{key}: </label>
              <input
                id={`latency-${key}`}
                type="number"
                min={1}
                value={latencies[key]}
                style={{ width: 60 }}
                onChange={(e) =>
                  setLatencies((l) => ({
                    ...l,
                    [key]: parseInt(e.target.value, 10) || 1,
                  }))
                }
              />
              ns
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: '1rem',
            color: '#555',
            background: '#f8f8f8',
            borderRadius: 8,
            padding: 16,
          }}
        >
          This animation is an approximation and does not strictly respect the real memory
          hierarchy.<br />
          For example, L1 is often included in L2 so the trajectory should go through L2, and
          the relationships between caches and RAM can vary depending on the architecture.<br />
          Inspired by{' '}
          <a
            href="https://x.com/BenjDicken/status/1847310000735330344"
            target="_blank"
            rel="noopener noreferrer"
          >
            BenjDicken's animation
          </a>
          .<br />
          Author: Tom Barbette (
          <a href="https://www.tombarbette.be" target="_blank" rel="noopener noreferrer">
            tombarbette.be
          </a>
          )
        </div>
      </div>
    </div>
  );
}

export default MemoryAnimation;
