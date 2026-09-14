<script lang="ts">
    import Alternativa from "./Alternativa.svelte";

    const alternativas = [
        {
            nombre: "Neovim",
            descripcion: "Editor personalizable para la terminal",
            imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neovim/neovim-original.svg"
        },
        {
            nombre: "Emacs",
            descripcion: "Editor personalizable para gurus de informatica",
            imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/emacs/emacs-original.svg"
        },
        {
            nombre: "Visual Studio Code",
            descripcion: "Editor para los frontends",
            imagen: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
        },
        {
            nombre: "Intellij Idea",
            descripcion: "Editor para los Java lovers",
            imagen: "https://imgs.search.brave.com/1D-EZPB-eeHg1QoJ9zyZSFDE3TC-SXryjdM-mgtHpdM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQ4MDkxMGNlZjEw/MTRjMGI1ZTQ4Zjcu/cG5n"
        },
        {
            nombre: "Sublime Text",
            descripcion: "Editor para los old school",
            imagen: "https://imgs.search.brave.com/RVgfaNV3Q4KDeE4O8eOFRLClrtF09DnTS8aohOHgHHQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS9l/eHRlcm5hbC10YWwt/cmV2aXZvLWNvbG9y/LXRhbC1yZXZpdm8v/MTIwMC9leHRlcm5h/bC1zdWJsaW1lLXRl/eHQtYS1zb3BoaXN0/aWNhdGVkLXRleHQt/ZWRpdG9yLWZvci1j/b2RlLW1hcmt1cC1s/YW5ndWFnZS1sb2dv/LWNvbG9yLXRhbC1y/ZXZpdm8uanBn"
        },
        {
            nombre: "VsCodium",
            descripcion: "Editor para los open source fans",
            imagen: "https://imgs.search.brave.com/Ahcg8MAQIsNzCAJJBuFgPNPpj942RZR2UznZhlzh0C8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy81/LzU2L1ZTQ29kaXVt/X0xvZ28ucG5n"
        },
        {
            nombre: "Zed",
            descripcion: "Editor para los Rust lovers",
            imagen: "https://imgs.search.brave.com/ajFOvSYpgqBjwFoQtBWYnRnuXSDGx1B5173rpEg7D-8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly96b25h/bG9nby5jb20vYXNz/ZXRzL3plZC1sb2dv/LXBuZy1zdmcud2Vi/cA"
        },
        {
            nombre: "JetBrains Fleet",
            descripcion: "Editor para Js and Java fans",
            imagen: "https://imgs.search.brave.com/xCXAha4KZPYGi-XyabqZsJy2ycPExmqigMOOOb8KHnI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/d2lrLmNvbS9jb250/ZW50L3VwbG9hZHMv/aW1hZ2VzL2pldGJy/YWlucy1mbGVldDE3/MjEwNDM5OTUubG9n/b3dpay5jb20ud2Vi/cA"
        },
 
    ]

</script>


<section class="showcase_layout">
    {#each alternativas as editor}
        <Alternativa nombre={editor.nombre} descripcion={editor.descripcion} imagen={editor.imagen}/>

    {/each}
</section>


<style>
    .showcase_layout {
        width: 35rem;
        display: grid;

        grid-template-columns: 1fr auto;
        align-items: center;
    }
</style>
