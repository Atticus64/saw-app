<script>
  import Form from './lib/Form.svelte';
  import ShowCase from './lib/ShowCase.svelte';
</script>

<section class="app_layout" id="center">
  <div>
    <h1>SAW app para elegir Editor de Código </h1>
    <p>La mejor <code>codificación</code> que preserva tiempo y costos </p>
  </div>
  <ShowCase />

  <Form />
</section>

<section id="spacer"></section>


<style>
  .app_layout {
    display: flex;
    flex-direction: column;
    /* max-width: 80rem; */
    gap: .5rem;
    justify-content: center;
  }
</style>