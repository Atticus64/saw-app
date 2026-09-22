<script lang="ts">
  import type { TopsisDatos } from "../api/types";
  import Chart from "./Chart.svelte";
  import { topsisDistancesConfig } from "./charts";

  interface Props {
    criterios: string[];
    datos: TopsisDatos;
  }

  let { criterios, datos }: Props = $props();

  const chartConfig = $derived(topsisDistancesConfig(datos.detallesYResultados));
</script>

<h3>Matriz Normalizada</h3>
<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        {#each criterios as criterio}
          <th>{criterio}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each datos.matrizNormalizada as editor}
        <tr>
          <td>{editor.nombre}</td>
          {#each editor.valores as valor}
            <td>{valor}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<h3>Matriz Ponderada</h3>
<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        {#each criterios as criterio}
          <th>{criterio}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each datos.matrizPonderada as editor}
        <tr>
          <td>{editor.nombre}</td>
          {#each editor.valores as valor}
            <td>{valor}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<section class="results">
  <h3>Ranking Final (TOPSIS)</h3>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Distancia +</th>
          <th>Distancia -</th>
          <th>Puntaje Final</th>
        </tr>
      </thead>
      <tbody>
        {#each datos.rankingFinal as puesto}
          <tr>
            <td>{puesto.nombre}</td>
            <td>{puesto.distanciaPositiva}</td>
            <td>{puesto.distanciaNegativa}</td>
            <td>{puesto.puntajeFinal}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="results">
  <h3>Distancias por editor</h3>
  <Chart config={chartConfig} />
</section>

<style>
  table {
    margin: 0 auto 2rem;
    border-collapse: collapse;
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border-strong);
    color: var(--color-text-heading);
    font-size: 0.95rem;
  }

  table thead th {
    font-family: var(--font-display);
    font-size: 0.65rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 0.6rem 1.25rem;
    border-bottom: var(--border-width) solid var(--color-border);
    color: var(--color-accent);
  }

  table tbody td {
    padding: 0.5rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  table tbody tr:last-child td {
    border-bottom: none;
  }

  table tbody tr:hover td {
    background: var(--color-accent-bg);
  }

  .table-scroll {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  .results {
    width: 100%;
  }
</style>