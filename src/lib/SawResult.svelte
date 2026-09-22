<script lang="ts">
  import type { EditorSaw } from "../api/types";
  import Chart from "./Chart.svelte";
  import { sawRankingBarConfig } from "./charts";

  interface Props {
    criterios: string[];
    datos_normalizados: EditorSaw[];
    ranking: EditorSaw[];
  }

  let { criterios, datos_normalizados, ranking }: Props = $props();

  const chartConfig = $derived(sawRankingBarConfig(ranking));
</script>

<h3>Matriz Ponderada</h3>
<div class="table-scroll">
   <table class="normalizada">
<thead>
        <tr>
          <th>Nombre</th>
          {#each criterios as criterio}
            <th>{criterio}</th>
          {/each}
        </tr>
      </thead>
     <tbody>
       {#each datos_normalizados as editor}
         <tr>
           <td>{editor.nombre}</td>
           {#each editor.valoresNormalizados as valor}
             <td>{valor}</td>
           {/each}
         </tr>
       {/each}
     </tbody>
   </table>
 </div>

 <section class="results">
    <h3>Ranking Final (SAW)</h3>
   <div class="table-scroll">
     <table>
       <thead>
         <tr>
           <th>Nombre</th>
           <th> Puntaje</th>
         </tr>
       </thead>
       <tbody>
         {#each ranking as puesto}
         <tr>
           <td>{puesto.nombre}</td>
           <td>{puesto.puntaje}</td>
         </tr>
         {/each}
       </tbody>
</table>
     </div>
   </section>

   <section class="results">
     <h3>Gráfica de ranking</h3>
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

       table.normalizada thead th {
         color: var(--oo-crystal);
       }

       table.normalizada tbody tr:hover td {
         background: rgba(159, 192, 216, 0.12);
       }


       .table-scroll {
         width: 100%;
         max-width: 100%;
         overflow-x: auto;
       }
 </style>
