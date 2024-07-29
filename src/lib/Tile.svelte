<script>
    export let state = -1; //Tile state. -1: empty, 0: naught, 1: cross
    $: background = state == -1 ? "" : state == 0 ? "green" : "red"
    $: displayChar = state == -1 ? "" : state == 0 ? "o" : "x"
</script>
<div class="tile" style="background-color: {background};">
    {displayChar}
</div>
<style>
    .tile {
        display: flex;
        justify-content: center;
        align-items:center;
        width: 40px;
        height: 40px;
    }
</style>