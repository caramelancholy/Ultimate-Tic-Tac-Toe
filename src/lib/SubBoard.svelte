<script>
    import Tile from "$lib/Tile.svelte"
    export let turn;
    
    let rows = new Array(3).fill(new Array(3).fill(0));
</script>

<div class="board">
    {#each rows as row, x}
        <div class="row">
            {#each row as tile, y}
                <Tile state={tile}/>
            {/each}
        </div>
    {/each}
</div>

<style>
    .board {
        display: flex;
        flex-direction: column;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
</style>