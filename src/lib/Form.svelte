<script lang="ts">
  import toast, { Toaster } from "svelte-5-french-toast";

  let resultReady = $state(false)
  let ranking: { nombre: string, puntaje: number }[] = $state([])
  let datos_normalizados: {
    nombre: string;
    puntaje: number;
    valoresNormalizados: number[];
  }[] = $state([])

  const criterios = [
    {
      nombre: "Tiempo de inicio",
      id: "inicio",
      valorInicial: 10,
      optimizacion: "Minimizar",
      medida: "ms",
      valorMin: 1,
      valorMax: 10000,
    },
    {
      nombre: "Consumo de Ram",
      id: "ram",
      valorInicial: 10,
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
      valorInicial: 10,
      optimizacion: "Maximizar",
      medida: "1-10",
      valorMin: 1,
      valorMax: 10,
    },
    {
      nombre: "Integración con Terminal",
      id: "terminal",
      valorInicial: 80,
      optimizacion: "Maximizar",
      medida: "1-10",
      valorMin: 1,
      valorMax: 10,
    },
    {
      nombre: "Autocompletado",
      id: "autocompletado",
      valorInicial: 10,
      optimizacion: "Maximizar",
      medida: "1-10",
      valorMin: 1,
      valorMax: 10,
    },
  ];

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
    let data: Criteria = {};
    const pesos: number[] = [];
    const tipos: string[] = [];

    for (const [key, value] of Object.entries(rawValues)) {
      if (isNaN(Number(value))) {
        tipos.push(value as string);
        continue;
      }
      data[key as keyof Criteria] = Number(value);
      pesos.push(Number(value));
    }

    console.log(pesos);
    console.log(tipos);

    const { ok, msg, valor } = validarCriterios(data);
    if (!ok) {
      toast.error(msg ?? "Error al validar");
      toast.error(`Se recibio ${valor}%`);
      return;
    }

    // const API = "http://localhost:3000/api";
    const API = "https://saw-service.onrender.com/api";
    const response = fetch(`${API}/evaluar-editores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pesos,
        tipos,
      }),
    });

    response
      .then(async (r) => {
        const json = await r.json();
        console.log(json);
        ranking = json["ranking"]
        datos_normalizados = json["tablaNormalizada"]
        resultReady = true
      })
      .catch(console.log)
      .finally();

    toast.success(`Se enviaron los datos con éxito!`);
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
            <label for="">Optimización</label>
            <select id={criterio.id + "-optid"} name={criterio.id + "-opt"}>
              <option value="min">Minimizar</option>
              <option value="max">Maximizar</option>
            </select>
          </span>
        </li>
      {/each}
    </ol>

    <button type="submit" class="btn_send">Enviar</button>
  </section>
</form>

{#if resultReady} 
<section class="results">
  <div class="table-scroll">
    <table class="normalizada">
      <thead>
        <tr>
          <td>Nombre</td>
          {#each criterios as criterio}
            <td>{criterio.nombre}</td>
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
</section>
<section class="results">
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <td>Nombre</td>
          <td> Puntaje</td>
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

{/if}


<style>
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
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

  .table-scroll {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  table {
    margin: 0 auto 2rem;
    border-collapse: collapse;
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border-strong);
    color: var(--color-text-heading);
    font-size: 0.95rem;
  }

  table thead td {
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

  table.normalizada thead td {
    color: var(--oo-crystal);
  }

  table.normalizada tbody tr:hover td {
    background: rgba(159, 192, 216, 0.12);
  }
</style>
