<script lang="ts">
    type PropsAlternativa = {
        nombre: string
        descripcion: string
        imagen: string
    }
    let { nombre, descripcion, imagen }: PropsAlternativa = $props();   
</script>

<section class="editor_layout">
    <img class="alternativa_img" src={imagen} alt={`${nombre} logo`} />
    <span>
        <h3>{nombre}</h3>
        <p>{descripcion}</p>

    </span>
</section>


<style>
    .editor_layout {

        display: flex;
        flex-direction: row;
        gap: 2rem;
        justify-content: center;
        align-items: center;
        width: 20rem;
    }

    .editor_layout p {
        width: 10rem;
    }

    .editor_layout img {
        width: 3rem;
        padding: auto;
    }
</style>
