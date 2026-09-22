import type { ChartConfiguration, Plugin } from "chart.js";
import type { DetalleTopsis, EditorSaw, SawResponse, TopsisResponse } from "../api/types";

const CRYSTAL = "#9fc0d8";
const SAPPHIRE = "#3f6d8a";
const INK = "#171a21";
const BONE = "#e6e0d1";
const SAW_RED = "#d96f6b";
const TOPSIS_BLUE = "#5f9bc4";
const TEXT = "#9aa5b1";
const BORDER = "rgba(154, 165, 177, 0.18)";

const pointLabelPlugin: Plugin<"scatter"> = {
  id: "pointLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.font = "12px ui-monospace, Consolas, monospace";
    ctx.fillStyle = BONE;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di);
      meta.data.forEach((point, i) => {
        const nombre = chart.data.labels?.[i];
        if (nombre != null) {
          ctx.fillText(String(nombre), point.x + 6, point.y);
        }
      });
    });

    ctx.restore();
  },
};

export function sawRankingBarConfig(ranking: EditorSaw[]): ChartConfiguration<"bar"> {
  return {
    type: "bar",
    data: {
      labels: ranking.map((r) => r.nombre),
      datasets: [
        {
          label: "Puntaje",
          data: ranking.map((r) => r.puntaje),
          backgroundColor: CRYSTAL,
          borderColor: SAPPHIRE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` Puntaje: ${(ctx.raw as number).toFixed(3)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: BORDER },
          ticks: { color: TEXT },
          title: { display: true, text: "Puntaje", color: TEXT },
        },
        y: {
          grid: { display: false },
          ticks: { color: TEXT },
        },
      },
    },
  };
}

export function topsisDistancesConfig(detalles: DetalleTopsis[]): ChartConfiguration<"scatter"> {
  return {
    type: "scatter",
    data: {
      labels: detalles.map((d) => d.nombre),
      datasets: [
        {
          label: "Editores",
          data: detalles.map((d) => ({
            x: d.distanciaPositiva,
            y: d.distanciaNegativa,
          })),
          backgroundColor: detalles.map((_, i) => (i % 2 === 0 ? CRYSTAL : SAPPHIRE)),
          borderColor: INK,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const detalle = detalles[ctx.dataIndex];
              return ` ${detalle?.nombre ?? ""}`;
            },
            afterLabel: (ctx) => {
              const detalle = detalles[ctx.dataIndex];
              if (!detalle) return;
              return [
                ` S+: ${detalle.distanciaPositiva.toFixed(4)}`,
                ` S-: ${detalle.distanciaNegativa.toFixed(4)}`,
                ` Puntaje: ${detalle.puntajeFinal.toFixed(4)}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Distancia Positiva (S⁺)", color: TEXT },
          grid: { color: BORDER },
          ticks: { color: TEXT },
        },
        y: {
          title: { display: true, text: "Distancia Negativa (S⁻)", color: TEXT },
          grid: { color: BORDER },
          ticks: { color: TEXT },
        },
      },
    },
    plugins: [pointLabelPlugin],
  };
}

export function comparativeBarConfig(
  saw: SawResponse,
  topsis: TopsisResponse,
): ChartConfiguration<"bar"> {
  const nombres = [
    ...new Set([
      ...saw.ranking.map((r) => r.nombre),
      ...topsis.datos.rankingFinal.map((r) => r.nombre),
    ]),
  ];

  const sawByNombre = new Map(saw.ranking.map((r) => [r.nombre, r.puntaje]));
  const topsisByNombre = new Map(
    topsis.datos.rankingFinal.map((r) => [r.nombre, r.puntajeFinal]),
  );

  return {
    type: "bar",
    data: {
      labels: nombres,
      datasets: [
        {
          label: "SAW",
          data: nombres.map((n) => sawByNombre.get(n) ?? 0),
          backgroundColor: SAW_RED,
          borderColor: SAW_RED,
          borderWidth: 1,
        },
        {
          label: "TOPSIS",
          data: nombres.map((n) => topsisByNombre.get(n) ?? 0),
          backgroundColor: TOPSIS_BLUE,
          borderColor: TOPSIS_BLUE,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: TEXT },
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ` ${ctx.dataset.label}: ${(ctx.raw as number).toFixed(3)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: BORDER },
          ticks: { color: TEXT },
          title: { display: true, text: "Puntaje (0-1)", color: TEXT },
        },
        y: {
          grid: { display: false },
          ticks: { color: TEXT },
        },
      },
    },
  };
}