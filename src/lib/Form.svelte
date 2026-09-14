<script lang="ts">
  import toast, { Toaster } from "svelte-5-french-toast";

  let resultReady = $state(false)
  let ranking: { nombre: string, puntaje: number }[] = $state([])

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

    const API = "http://localhost:3000/api";
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
        ranking = json["top3"]
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
            <span>{criterio.medida}</span>
            <input
              type="number"
              name={criterio.id}
              min="1"
              max="100"
              step="1"
              id="percentInput"
              value={criterio.valorInicial}
            />
            <span>%</span>
            <label for="">Optimización</label>
            <select id={criterio.id} name={criterio.id + "-opt"}>
              <option value="min">Minimizar</option>
              <option value="max">Maximizar</option>
            </select>
          </span>
        </li>
      {/each}
    </ol>

    <button class="btn_send">Enviar</button>
  </section>
</form>

{#if resultReady} 
<section>
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
</section>
{/if}


<style>
  .params {
    display: flex;
    flex-direction: column;
  }

  /* .alternativa_img {
    width: 5rem;
  } */

  .criteria {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin: 1rem;
  }

  .alternativa_layout {
    display: flex;
    flex-direction: column;
    place-items: start;
  }

  .btn_send {
    display: block;
    margin: 2rem;
    width: 5rem;
    font-size: large;
    /* border-radius: 30%; */
    background-color: #ffa;
    color: black;
    transition: 0.5s scale;
  }

  .btn_send:hover {
    scale: 1.2;
  }
</style>
