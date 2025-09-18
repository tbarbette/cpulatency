import React from 'react';

interface CoreProps {
  x: number;
  y: number;
  size: number;
  coreIndex: number;
}

const COLORS = {
  L1: '#4caf50',
  L2: '#2196f3',
  REGISTER: '#9c27b0',
  ALU: '#607d8b',
  CORE: '#bdbdbd',
};

export function CpuCore({ x, y, size, coreIndex }: CoreProps) {
  // Positions inside the core
  const padding = size * 0.12;
  const innerW = size - 2 * padding;
  const innerH = size - 2 * padding;
  const l1X = x - innerW / 4;
  const l1Y = y - innerH / 4;
  const l2X = x + innerW / 4;
  const l2Y = y - innerH / 4;
  const aluX = x + innerW / 4;
  const aluY = y + innerH / 4;
  const regX = x - innerW / 4;
  const regY = y + innerH / 4;
  const blockW = innerW * 0.22;
  const blockH = innerH * 0.18;

  return (
    <g>
      {/* Core rectangle */}
      <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        rx={size * 0.18}
        fill={COLORS.CORE}
        stroke="#888"
        strokeWidth={2}
      />
      <text x={x} y={y - size / 2 - 8} textAnchor="middle" fontSize="16" fill="#333">
        Core {coreIndex + 1}
      </text>
      {/* L1 */}
      <rect x={l1X - blockW / 2} y={l1Y - blockH / 2} width={blockW} height={blockH} rx={6} fill={COLORS.L1} />
      <text x={l1X} y={l1Y - blockH / 2 - 4} textAnchor="middle" fontSize="12" fill="#333">L1</text>
      {/* L2 */}
      <rect x={l2X - blockW / 2} y={l2Y - blockH / 2} width={blockW} height={blockH} rx={6} fill={COLORS.L2} />
      <text x={l2X} y={l2Y - blockH / 2 - 4} textAnchor="middle" fontSize="12" fill="#333">L2</text>
      {/* Register */}
      <rect x={regX - blockW / 2} y={regY - blockH / 2} width={blockW} height={blockH} rx={6} fill={COLORS.REGISTER} />
      <text x={regX} y={regY + blockH / 2 + 14} textAnchor="middle" fontSize="12" fill="#333">Register</text>
      {/* ALU */}
      <rect x={aluX - blockW / 2} y={aluY - blockH / 2} width={blockW} height={blockH} rx={6} fill={COLORS.ALU} />
      <text x={aluX} y={aluY + blockH / 2 + 14} textAnchor="middle" fontSize="12" fill="#333">ALU</text>
    </g>
  );
}
