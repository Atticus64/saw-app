<script lang="ts">
  import type { SawResponse, TopsisResponse } from "../api/types";
  import Chart from "./Chart.svelte";
  import { comparativeBarConfig } from "./charts";

  interface Props {
    criterios: string[];
    saw: SawResponse;
    topsis: TopsisResponse;
  }

  let { criterios, saw, topsis }: Props = $props();

  const chartConfig = $derived(comparativeBarConfig(saw, topsis));

  const topsisByNombre = $derived(
    new Map(topsis.datos.rankingFinal.map((r) => [r.nombre, r.puntajeFinal])),
  );
</script>

<section class="perspective p-saw" aria-label="Perspectiva SAW">
  <header>
    <h3><span class="dot saw-dot" aria-hidden="true"></span> Perspectiva SAW</h3>
  </header>

  <h4>Matriz Ponderada</h4>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          {#each criterios as criterio}
            <th>{criterio}</th>
          {/each}
          <th>Puntaje</th>
        </tr>
      </thead>
      <tbody>
        {#each saw.tablaNormalizada as editor}
          <tr>
            <td>{editor.nombre}</td>
            {#each editor.valoresNormalizados as valor}
              <td>{valor}</td>
            {/each}
            <td>{editor.puntaje}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h4>Ranking SAW</h4>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Nombre</th>
          <th>Puntaje</th>
        </tr>
      </thead>
      <tbody>
        {#each saw.ranking as editor, i}
          <tr>
            <td>{i + 1}</td>
            <td>{editor.nombre}</td>
            <td>{editor.puntaje}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<div class="divider" aria-hidden="true">
  <span class="badge"><span class="dot saw-dot"></span>&nbsp;—&nbsp;medir&nbsp;vs&nbsp;—&nbsp;<span class="dot topsis-dot"></span></span>
</div>

<section class="perspective p-topsis" aria-label="Perspectiva TOPSIS">
  <header>
    <h3><span class="dot topsis-dot" aria-hidden="true"></span> Perspectiva TOPSIS</h3>
  </header>

  <h4>Matriz Normalizada</h4>
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
        {#each topsis.datos.matrizNormalizada as editor}
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

  <h4>Matriz Ponderada</h4>
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
        {#each topsis.datos.matrizPonderada as editor}
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

  <h4>Ranking Final TOPSIS</h4>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Nombre</th>
          <th>Distancia +</th>
          <th>Distancia -</th>
          <th>Puntaje Final</th>
        </tr>
      </thead>
      <tbody>
        {#each topsis.datos.rankingFinal as detalle, i}
          <tr>
            <td>{i + 1}</td>
            <td>{detalle.nombre}</td>
            <td>{detalle.distanciaPositiva}</td>
            <td>{detalle.distanciaNegativa}</td>
            <td>{detalle.puntajeFinal}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="results">
  <h3>Comparativa de puntajes SAW vs TOPSIS</h3>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>SAW</th>
          <th>TOPSIS</th>
        </tr>
      </thead>
      <tbody>
        {#each saw.ranking as editor}
          <tr>
            <td>{editor.nombre}</td>
            <td>{editor.puntaje.toFixed(3)}</td>
            <td>{topsisByNombre.get(editor.nombre)?.toFixed(3)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="results">
  <h3>Gráfica comparativa SAW vs TOPSIS</h3>
  <Chart config={chartConfig} />
</section>

<style>
  .perspective {
    width: 100%;
    padding: 1rem 1.25rem;
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border);
    border-top: 3px solid transparent;
    border-radius: var(--radius-arcade);
    margin: 0 0 1rem;
  }

  .p-saw {
    border-top-color: #d96f6b;
  }

  .p-topsis {
    border-top-color: #5f9bc4;
  }

  header h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-text-heading);
    margin: 0 0 1rem;
  }

  .dot {
    display: inline-block;
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
  }

  .saw-dot {
    background: #d96f6b;
  }

  .topsis-dot {
    background: #5f9bc4;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 2.5rem 0;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    border-bottom: var(--border-width) solid var(--color-border-strong);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-text-heading);
    background: var(--color-bg);
    border: var(--border-width) solid var(--color-border-strong);
    border-radius: var(--radius-arcade);
    padding: 0.35rem 0.9rem;
  }

  h4 {
    font-family: var(--font-display);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-text-muted);
    margin: 0 0 0.75rem;
  }

  table {
    margin: 0 auto 2rem;
    border-collapse: collapse;
    background: var(--color-bg);
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

  .p-saw table thead th {
    color: #d96f6b;
  }

  .p-topsis table thead th {
    color: #5f9bc4;
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