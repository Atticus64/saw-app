<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import type { ChartConfiguration } from "chart.js";

  Chart.register(...registerables);

  interface Props {
    config: ChartConfiguration;
  }

  let { config }: Props = $props();

  let canvas: HTMLCanvasElement | null = $state(null);

  $effect(() => {
    if (!canvas) return;

    const chart = new Chart(canvas, config);
    return () => {
      chart.destroy();
    };
  });
</script>

<div class="chart-container">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    min-height: 380px;
    margin: 0 auto 2rem;
  }
</style>