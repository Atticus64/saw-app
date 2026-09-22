<script lang="ts">
  import { onMount } from "svelte";
  import { getDecisionMatrix, status } from "../api/service";
  import type { Editor } from "../api/types";

  const criterios = [
    "Tiempo de inicio",
    "Consumo de Ram",
    "Curva de aprendizaje",
    "Extensiones",
    "Integración con Terminal",
    "Autocompletado",
  ];

  let datos: Editor[] = $state([]);
  let estado = $state(status.loading);

  onMount(async () => {
    const result = await getDecisionMatrix();

    datos = result.datos
    estado = result.estado

  });
</script>

{#if estado === status.loading}
  <p class="msg">Cargando matriz de decisión…</p>
{:else if estado === status.error}
  <p class="msg">Error al cargar la matriz de decisión</p>
{:else}
  <h4>Matriz de Decisión</h4>
  <section class="table-scroll">
    <table class="matriz">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          {#each criterios as criterio}
            <th>{criterio}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each datos as editor}
          <tr>
            <td>{editor.id}</td>
            <td>{editor.nombre}</td>
            {#each editor.valores as valor}
              <td>{valor}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{/if}

<style>
  /* .msg {
    margin: 1rem 0;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--color-text-muted);
  } */

.table-scroll {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  table.matriz {
    margin: 0 auto 2rem;
    border-collapse: collapse;
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border-strong);
    color: var(--color-text-heading);
    font-size: 0.95rem;
  }

  table.matriz thead th {
    font-family: var(--font-display);
    font-size: 0.65rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 0.6rem 1.25rem;
    border-bottom: var(--border-width) solid var(--color-border);
    color: var(--oo-crystal);
  }

  table.matriz tbody td {
    padding: 0.5rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  table.matriz tbody tr:last-child td {
    border-bottom: none;
  }

  table.matriz tbody tr:hover td {
    background: rgba(159, 192, 216, 0.12);
  }
</style>
