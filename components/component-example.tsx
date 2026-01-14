"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  IconArrowsDiagonal,
  IconChartBar,
  IconCoin,
  IconRefresh,
  IconSparkles,
  IconTrendingUp,
} from "@tabler/icons-react";

const cardShell =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.65))] shadow-[0_30px_80px_rgba(0,0,0,0.65)]";

const tvlLine = [
  32, 30, 31, 33, 36, 39, 41, 44, 43, 42, 38, 36, 35, 34, 33, 34, 33, 34, 34,
  33, 34, 33, 35, 36, 38, 39, 38, 39, 39, 38, 39, 40, 39, 39, 38,
];

const performanceLine = [
  33.5, 33.7, 33.6, 33.1, 32.6, 32.2, 31.4, 30.9, 30.5, 30.3, 30.2, 30.15, 30.1,
  29.9, 29.4, 28.7, 29.4, 31.6, 32.9, 32.6, 32.2,
];

const sharePriceLine = [
  1.0, 1.0, 1.01, 1.01, 1.02, 1.03, 1.04, 1.05, 1.05, 1.06, 1.07, 1.07, 1.08,
  1.09, 1.1, 1.1, 1.11,
];

const tvlBars = [62, 66, 64, 67, 70, 74, 82];

const tvlLabelMarks = [
  "Oct 7",
  "Oct 19",
  "Nov 25",
  "Dec 17",
  "Dec 29",
  "Jan 14",
];
const performanceLabelMarks = [
  "Dec 16",
  "Dec 23",
  "Dec 26",
  "Dec 29",
  "Jan 2",
  "Jan 6",
  "Jan 13",
];
const shareLabelMarks = [
  "Oct 11",
  "Oct 29",
  "Nov 7",
  "Nov 16",
  "Nov 26",
  "Dec 5",
  "Dec 14",
  "Dec 24",
  "Jan 2",
  "Jan 14",
];
const tvlBarLabels = [
  "Jan 8",
  "Jan 9",
  "Jan 10",
  "Jan 11",
  "Jan 12",
  "Jan 13",
  "Jan 14",
];

const tvlData = tvlLine.map((value, index) => ({ index, value }));
const performanceData = performanceLine.map((value, index) => ({
  index,
  value,
}));
const sharePriceData = sharePriceLine.map((value, index) => ({ index, value }));
const tvlBarData = tvlBars.map((value, index) => ({
  index,
  label: tvlBarLabels[index] ?? `Day ${index + 1}`,
  value,
  isHighlight: index === tvlBars.length - 1,
}));

type ChartTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number }>;
  label?: number | string;
};

type TooltipConfig = {
  labels: string[];
  dataLength: number;
  valueFormatter: (value: number) => string;
};

const tooltipBoxClass =
  "rounded-full border border-white/10 bg-black/80 px-3 py-1 text-xs text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.35)]";

type TvlBarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: { isHighlight?: boolean };
  isActive?: boolean;
};

const renderTvlBar = (props: TvlBarShapeProps) => <TvlBarShape {...props} />;
const renderTvlBarActive = (props: TvlBarShapeProps) => (
  <TvlBarShape {...props} isActive />
);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getLabelForIndex = (
  label: number | string | undefined,
  labels: string[],
  dataLength: number
) => {
  if (typeof label === "string") {
    return label;
  }

  const index = typeof label === "number" ? label : Number(label);

  if (!Number.isFinite(index) || labels.length === 0 || dataLength < 2) {
    return "";
  }

  const ratio = clamp(index / (dataLength - 1), 0, 1);
  const labelIndex = Math.round(ratio * (labels.length - 1));
  return labels[labelIndex] ?? "";
};

const renderTooltip = (
  { active, payload, label }: ChartTooltipProps,
  config: TooltipConfig
) => {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value;

  if (typeof value !== "number") {
    return null;
  }

  const labelText = getLabelForIndex(label, config.labels, config.dataLength);

  return (
    <div className={tooltipBoxClass}>
      {labelText ? <span className="text-white/60">{labelText}</span> : null}
      <span className={labelText ? "ml-2 text-white" : "text-white"}>
        {config.valueFormatter(value)}
      </span>
    </div>
  );
};

function TvlBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  isActive = false,
}: TvlBarShapeProps) {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const radius = Math.min(12, width / 2, height / 2);
  const isHighlight = Boolean(payload?.isHighlight);
  const fill = isHighlight ? "url(#tvl-bar-highlight)" : "url(#tvl-bar-base)";
  const border = isHighlight
    ? "rgba(126,243,178,0.45)"
    : "rgba(255,255,255,0.1)";
  const activeBorder = isActive ? "rgba(255,255,255,0.35)" : border;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={fill}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="url(#tvl-bar-sheen)"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="url(#tvl-bar-shadow)"
      />
      {isHighlight ? (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="url(#tvl-bar-highlight-glow)"
        />
      ) : null}
      {isActive ? (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="rgba(255,255,255,0.08)"
        />
      ) : null}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="none"
        stroke={activeBorder}
        strokeWidth={1}
      />
    </g>
  );
}

export function ComponentExample() {
  return (
    <div className="min-h-screen w-full bg-[#050507] text-white [background-image:radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_35%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
        <section className={`${cardShell} p-6`}>
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-white/60">
                  All Time TVL
                </div>
                <div className="mt-2 text-3xl font-semibold">$70.96M</div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70">
                <IconArrowsDiagonal className="h-5 w-5" />
              </div>
            </div>

            <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 pb-10">
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.5))]" />
              <div className="relative z-10 h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={tvlData}
                    margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
                    accessibilityLayer={false}
                  >
                    <defs>
                      <linearGradient id="tvl-line" x1="0" y1="0" x2="1" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#7ef3b2"
                          stopOpacity="0.9"
                        />
                        <stop
                          offset="100%"
                          stopColor="#7ef3b2"
                          stopOpacity="0.5"
                        />
                      </linearGradient>
                      <linearGradient id="tvl-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#7ef3b2"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#7ef3b2"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="index"
                      type="number"
                      hide
                      domain={[0, tvlData.length - 1]}
                    />
                    <YAxis hide domain={[(min) => min - 6, (max) => max + 6]} />
                    <Tooltip
                      cursor={{
                        stroke: "rgba(255,255,255,0.25)",
                        strokeWidth: 1,
                      }}
                      content={(props) =>
                        renderTooltip(props, {
                          labels: tvlLabelMarks,
                          dataLength: tvlData.length,
                          valueFormatter: (value) => `$${value.toFixed(2)}M`,
                        })
                      }
                    />
                    <Area
                      dataKey="value"
                      type="monotone"
                      stroke="url(#tvl-line)"
                      strokeWidth={1.6}
                      fill="url(#tvl-fill)"
                      fillOpacity={1}
                      dot={false}
                      activeDot={{
                        r: 3,
                        fill: "#7ef3b2",
                        stroke: "rgba(255,255,255,0.45)",
                        strokeWidth: 1,
                      }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 flex justify-between text-xs text-white/40">
              <span>Oct 7</span>
              <span>Oct 19</span>
              <span>Nov 25</span>
              <span>Dec 17</span>
              <span>Dec 29</span>
              <span>Jan 14</span>
            </div>
          </div>
        </section>

        <section className={`${cardShell} p-6`}>
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                  <IconTrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">Performance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>30 days</span>
                  <IconRefresh className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold text-emerald-300">
                  APY
                </div>
                <div className="mt-2 flex items-center gap-2 text-3xl font-semibold text-emerald-200">
                  32.57%
                  <IconSparkles className="h-5 w-5 text-emerald-300" />
                </div>
              </div>

              <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 pb-8">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.55))]" />
                <div className="absolute left-4 top-1/2 h-px w-[calc(100%-2rem)] -translate-y-1/2 border-t border-dashed border-white/25" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs text-white/60">
                  Avg. 32.30%
                </div>
                <div className="relative z-10 h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={performanceData}
                      margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
                      accessibilityLayer={false}
                    >
                      <defs>
                        <linearGradient
                          id="performance-line"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7ef3b2"
                            stopOpacity="0.9"
                          />
                          <stop
                            offset="100%"
                            stopColor="#7ef3b2"
                            stopOpacity="0.6"
                          />
                        </linearGradient>
                        <linearGradient
                          id="performance-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7ef3b2"
                            stopOpacity="0.18"
                          />
                          <stop
                            offset="100%"
                            stopColor="#7ef3b2"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="index"
                        type="number"
                        hide
                        domain={[0, performanceData.length - 1]}
                      />
                      <YAxis
                        hide
                        domain={[(min) => min - 4, (max) => max + 4]}
                      />
                      <ReferenceLine
                        y={32.3}
                        stroke="rgba(255,255,255,0.35)"
                        strokeDasharray="4 4"
                      />
                      <Tooltip
                        cursor={{
                          stroke: "rgba(255,255,255,0.25)",
                          strokeWidth: 1,
                        }}
                        content={(props) =>
                          renderTooltip(props, {
                            labels: performanceLabelMarks,
                            dataLength: performanceData.length,
                            valueFormatter: (value) => `${value.toFixed(2)}%`,
                          })
                        }
                      />
                      <Area
                        dataKey="value"
                        type="monotone"
                        stroke="url(#performance-line)"
                        strokeWidth={1.6}
                        fill="url(#performance-fill)"
                        fillOpacity={1}
                        dot={false}
                        activeDot={{
                          r: 3,
                          fill: "#7ef3b2",
                          stroke: "rgba(255,255,255,0.45)",
                          strokeWidth: 1,
                        }}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-xs text-white/40">
                <span>Dec 16</span>
                <span>Dec 23</span>
                <span>Dec 26</span>
                <span>Dec 29</span>
                <span>Jan 2</span>
                <span>Jan 6</span>
                <span>Jan 13</span>
              </div>
            </div>

            <div className="flex h-full flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">APY</span>
                  <span className="text-emerald-300">32.57%</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                        <IconChartBar className="h-4 w-4" />
                      </span>
                      Deposit APY
                    </div>
                    <span className="text-white">30.96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                        <IconCoin className="h-4 w-4" />
                      </span>
                      Lending APY
                    </div>
                    <span className="text-emerald-300">+1.61%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                        <IconChartBar className="h-4 w-4" />
                      </span>
                      Performance Fee (10%)
                    </div>
                    <span className="text-white">-3.10%</span>
                  </div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-white/40">
                Deposit APY is calculated based on the share price change since
                the last two updates. Fees are applied to deposit APY only.
              </p>

              <div className="mt-auto flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <span>APY after fees</span>
                <span className="text-white">29.47%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
          <div className={`${cardShell} p-6`}>
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="relative z-10">
              <div className="flex items-center justify-between text-white/70">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <IconChartBar className="h-4 w-4" />
                  </span>
                  TVL
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>7 days</span>
                  <IconRefresh className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 text-3xl font-semibold">$732.11K</div>

              <div className="mt-6 h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tvlBarData}
                    margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      type="category"
                      hide
                      padding={{ left: 6, right: 6 }}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      content={(props) =>
                        renderTooltip(props, {
                          labels: tvlBarLabels,
                          dataLength: tvlBarData.length,
                          valueFormatter: (value) => `${value.toFixed(0)}K`,
                        })
                      }
                    />
                    <Bar
                      dataKey="value"
                      radius={4}
                      fill="#7ef3b2"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-between text-xs text-white/40">
                <span>Jan 8</span>
                <span>Jan 11</span>
                <span>Jan 14</span>
              </div>
            </div>
          </div>

          <div className={`${cardShell} p-6`}>
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold">
                  Share Price
                </span>
                <span className="text-sm font-semibold text-white/40">
                  Yield Earned
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-semibold">1.0700</span>
                <span className="text-sm font-semibold text-emerald-300">
                  +0.3053%
                </span>
                <span className="text-xs text-white/40">Since Last Update</span>
              </div>

              <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 pb-8">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.55))]" />
                <div className="relative z-10 h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sharePriceData}
                      margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
                      accessibilityLayer={false}
                    >
                      <defs>
                        <linearGradient
                          id="share-line"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7ef3b2"
                            stopOpacity="0.9"
                          />
                          <stop
                            offset="100%"
                            stopColor="#7ef3b2"
                            stopOpacity="0.6"
                          />
                        </linearGradient>
                        <linearGradient
                          id="share-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7ef3b2"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor="#7ef3b2"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="index"
                        type="number"
                        hide
                        domain={[0, sharePriceData.length - 1]}
                      />
                      <YAxis
                        hide
                        domain={[(min) => min - 0.01, (max) => max + 0.01]}
                      />
                      <Tooltip
                        cursor={{
                          stroke: "rgba(255,255,255,0.25)",
                          strokeWidth: 1,
                        }}
                        content={(props) =>
                          renderTooltip(props, {
                            labels: shareLabelMarks,
                            dataLength: sharePriceData.length,
                            valueFormatter: (value) => value.toFixed(4),
                          })
                        }
                      />
                      <Area
                        dataKey="value"
                        type="stepAfter"
                        stroke="url(#share-line)"
                        strokeWidth={1.6}
                        fill="url(#share-fill)"
                        fillOpacity={1}
                        dot={false}
                        activeDot={{
                          r: 3,
                          fill: "#7ef3b2",
                          stroke: "rgba(255,255,255,0.45)",
                          strokeWidth: 1,
                        }}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-xs text-white/40">
                <span>Oct 11</span>
                <span>Oct 29</span>
                <span>Nov 7</span>
                <span>Nov 16</span>
                <span>Nov 26</span>
                <span>Dec 5</span>
                <span>Dec 14</span>
                <span>Dec 24</span>
                <span>Jan 2</span>
                <span>Jan 14</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  7d Growth <span className="text-emerald-300">+0.54%</span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  30d Growth <span className="text-emerald-300">+2.46%</span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  90d Growth <span className="text-emerald-300">+7.00%</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
