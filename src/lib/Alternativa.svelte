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
        gap: 1.25rem;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 20rem;
        box-sizing: border-box;
        padding: 0.9rem 1.1rem;
        background: var(--color-surface);
        border: var(--border-width) solid var(--color-border);
        border-radius: var(--radius-arcade);
        transition: border-color 0.2s, background-color 0.2s;
    }

    .editor_layout:hover {
        border-color: var(--color-border-strong);
        background-color: var(--color-accent-bg);
    }

    .editor_layout p {
        width: 10rem;
        font-size: 0.95rem;
        color: var(--color-text-muted);
    }

    .editor_layout h3 {
        color: var(--color-text-heading);
        margin: 0 0 0.4rem;
        font-size: 1.05rem;
    }

    .editor_layout img {
        width: 3rem;
        padding: auto;
    }
</style>
