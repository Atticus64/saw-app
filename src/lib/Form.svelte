<script lang="ts">
  import toast, { Toaster } from "svelte-5-french-toast";
    import MatrizDecision from "./MatrizDecision.svelte";
    import { evaluateEditorsSaw, evaluateEditorsTopsis } from "../api/service";
    import SawResult from "./SawResult.svelte";
    import TopsisResult from "./TopsisResult.svelte";
    import Comparative from "./Comparative.svelte";
    import type { EditorSaw, SawResponse, TopsisDatos, TopsisResponse } from "../api/types";

  let resultReady = $state(false)
  let tipo_metodo: "saw" | "topsis" | "comparativo" = $state("saw")
  let ranking: EditorSaw[] = $state([])
  let datos_normalizados: EditorSaw[] = $state([])
  let topsisDatos: TopsisDatos | null = $state(null)
  let sawResponse: SawResponse | null = $state(null)
  let topsisResponse: TopsisResponse | null = $state(null)

  const criterios = [
    {
      nombre: "Tiempo de inicio",
      id: "inicio",
      valorInicial: 15,
      optimizacion: "Minimizar",
      medida: "ms",
      valorMin: 1,
      valorMax: 10000,
    },
    {
      nombre: "Consumo de Ram",
      id: "ram",
      valorInicial: 20,
      optimizacion: "Minimizar",
      medida: "MB",
      valorMin: 1,
      valorMax: 10000,
    },
    {
      nombre: "Curva de aprendizaje",
      id: "aprendizaje",
      valorInicial: 10,
      medida: "1-10",
      optimizacion: "Minimizar",
      valorMin: 1,
      valorMax: 10,
    },
    {
      nombre: "Extensiones",
      id: "extensiones",
      valorInicial: 20,
      optimizacion: "Maximizar",
      medida: "1-10",
      valorMin: 1,
      valorMax: 10,
    },
    {
      nombre: "Integración con Terminal",
      id: "terminal",
      valorInicial: 20,
      optimizacion: "Maximizar",
      medida: "1-10",
      valorMin: 1,
      valorMax: 10,
    },
    {
      nombre: "Autocompletado",
      id: "autocompletado",
      valorInicial: 15,
      optimizacion: "Maximizar",
      medida: "1-10",
      valorMin: 1,
      valorMax: 10,
    },
  ];

  const criteriosNombres = criterios.map(c => c.nombre);

  type Criteria = {
    inicio?: number;
    ram?: number;
    aprendizaje?: number;
    extensiones?: number;
    terminal?: number;
    autocompletado?: number;
  };

  type Status = {
    msg?: string;
    valor: number;
    ok: boolean;
  };

  function validarCriterios(criterios: Criteria): Status {
    let sum = 0;
    for (const valor of Object.values(criterios)) {
      if (isNaN(valor)) continue;

      sum += valor;
    }

    const validacion = {
      valor: sum,
      ok: sum === 100,
      msg: "",
    };

    if (!validacion.ok) {
      validacion.msg = "Criterios no validos se esperaba que sumaran 100%";
    }

    return validacion;
  }

  function evaluarPorSaw(pesos: number[], tipos: string[]) {
    evaluateEditorsSaw(pesos, tipos)
      .then((result: SawResponse) => {
        ranking = result.ranking
        datos_normalizados = result.tablaNormalizada
        resultReady = true
        toast.success(`Se enviaron los datos con éxito!`);
      })
      .catch((err) => {
        console.error(err);
        resultReady = false;
        ranking = [];
        datos_normalizados = [];
        toast.error(err?.message ?? "Error al evaluar SAW");
      });
  }

  function evaluarPorTopsis(pesos: number[], tipos: string[]) {
    evaluateEditorsTopsis(pesos, tipos)
      .then((result: TopsisResponse) => {
        topsisDatos = result.datos
        resultReady = true
        toast.success(`Se enviaron los datos con éxito!`);
      })
      .catch((err) => {
        console.error(err);
        resultReady = false;
        topsisDatos = null;
        toast.error(err?.message ?? "Error al evaluar TOPSIS");
      });
  }

  function evaluarComparativo(pesos: number[], tipos: string[]) {
    Promise.all([
      evaluateEditorsSaw(pesos, tipos),
      evaluateEditorsTopsis(pesos, tipos),
    ])
      .then(([saw, topsis]: [SawResponse, TopsisResponse]) => {
        sawResponse = saw
        topsisResponse = topsis
        resultReady = true
        toast.success(`Se enviaron los datos con éxito!`);
      })
      .catch((err) => {
        console.error(err);
        resultReady = false;
        sawResponse = null;
        topsisResponse = null;
        toast.error(err?.message ?? "Error al evaluar comparativo");
      });
  }

  function sendData(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    console.info("Sending to David http API REST");
    if (!e.target) return;
    const rawValues = Object.fromEntries(
      new FormData(e.target as HTMLFormElement),
    );

    tipo_metodo = rawValues.tipo_metodo as "saw" | "topsis" | "comparativo";
    const pesos: number[] = [];
    const tipos: string[] = [];
    const data: Criteria = {};

    for (const criterio of criterios) {
      const peso = Number(rawValues[criterio.id]);
      const optimizacion = rawValues[criterio.id + "-opt"] as string;
      data[criterio.id as keyof Criteria] = peso;
      pesos.push(peso);
      tipos.push(optimizacion);
    }

    const { ok, msg, valor } = validarCriterios(data);
    if (!ok) {
      toast.error(msg ?? "Error al validar");
      toast.error(`Se recibio ${valor}%`);
      return;
    }

    switch(tipo_metodo) {
      case "saw":
        evaluarPorSaw(pesos, tipos)
        break;
      case "topsis":
        evaluarPorTopsis(pesos, tipos)
        break;
      case "comparativo":
        evaluarComparativo(pesos, tipos)
        break;
    }
  }
</script>

<Toaster />
<form method="post" onsubmit={sendData} class="form_layout">
  <section class="alternativa_layout">
    <!-- <img class="alternativa_img" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neovim/neovim-original.svg" alt="neovim logo" /> -->
    <ol>
      <!-- <p>Editor de terminal</p> -->
      {#each criterios as criterio}
        <li class="params">
          <span class="criteria">
            <label for={criterio.id}>{criterio.nombre} </label>
            <span class="medida">{criterio.medida}</span>
            <input
              type="number"
              id={criterio.id}
              name={criterio.id}
              min="1"
              max="100"
              step="1"
              value={criterio.valorInicial}
            />
            <span class="percent">%</span>
            <label for={criterio.id + "-opt"}>Optimización</label>
            <select id={criterio.id + "-opt"} name={criterio.id + "-opt"}>
              <option value="min" selected={criterio.optimizacion === "Minimizar"}>Minimizar</option>
              <option value="max" selected={criterio.optimizacion === "Maximizar"}>Maximizar</option>
            </select>
          </span>
        </li>
      {/each}
    </ol>

    <div class="buttons">
        <button type="submit" class="btn_send">Enviar</button>
        <select name="tipo_metodo" id="">
            <option value="saw">Saw</option>
            <option value="topsis">Topsis</option>
            <option value="comparativo">Comparativo</option>
        </select>

    </div>

  </section>
</form>
<MatrizDecision/>

{#if resultReady}
<section class="results">

    {#if tipo_metodo === "saw"}
        <SawResult criterios={criteriosNombres} ranking={ranking} datos_normalizados={datos_normalizados}></SawResult>
    {:else if tipo_metodo === "topsis" && topsisDatos}
        <TopsisResult criterios={criteriosNombres} datos={topsisDatos}></TopsisResult>
    {:else if tipo_metodo === "comparativo" && sawResponse && topsisResponse}
        <Comparative criterios={criteriosNombres} saw={sawResponse} topsis={topsisResponse}></Comparative>
    {/if}
</section>
{/if}


<style>
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  .params {
    display: flex;
    flex-direction: column;
    margin: 0 0 1rem;
  }

  .criteria {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--radius-arcade);
    transition:
      border-color 0.2s,
      background-color 0.2s;
  }

  .criteria:hover,
  .criteria:focus-within {
    border-color: var(--color-border-strong);
    background-color: var(--color-accent-bg);
  }

  .criteria label {
    color: var(--color-text-heading);
    cursor: pointer;
  }

  .criteria .medida,
  .criteria .percent {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    background: var(--color-bg);
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--radius-arcade);
    padding: 0.2rem 0.45rem;
  }

  .alternativa_layout {
    display: flex;
    flex-direction: column;
    place-items: start;
  }

  input[type="number"],
  select {
    height: 2.2rem;
    padding: 0.35rem 0.6rem;
    font: inherit;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--color-text-heading);
    background: var(--color-bg);
    border: var(--border-width) solid var(--color-border-strong);
    border-radius: var(--radius-arcade);
    transition:
      border-color 0.2s,
      background-color 0.2s,
      box-shadow 0.2s;
  }

  input[type="number"] {
    width: 5rem;
    text-align: center;
  }

  select {
    min-width: 8.5rem;
    padding-right: 2rem;
    cursor: pointer;
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, var(--color-accent) 50%),
      linear-gradient(135deg, var(--color-accent) 50%, transparent 50%);
    background-position:
      calc(100% - 14px) 50%,
      calc(100% - 9px) 50%;
    background-size: 5px 5px;
    background-repeat: no-repeat;
  }

  input[type="number"]:hover,
  select:hover {
    border-color: var(--color-accent-border);
    background-color: var(--color-accent-bg);
  }

  input[type="number"]:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
    border-color: var(--color-accent-border);
  }

  .btn_send {
    display: block;
    margin: 1.5rem 2rem;
    padding: 0.9rem 1.2rem;
    font-family: var(--font-display);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: var(--border-width) solid var(--color-border-strong);
    border-radius: var(--radius-arcade);
    background-color: var(--color-accent-alt);
    color: #171a21;
    box-shadow: var(--shadow-arcade);
    cursor: pointer;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }

  .btn_send:hover {
    transform: translateY(-12px);
    box-shadow: 0 4px 0 var(--oo-ink-shadow);
  }

  .btn_send:active {
    transform: translateY(3px);
    box-shadow: none;
  }

  .btn_send:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  .results {
    width: 100%;
  }

</style>
