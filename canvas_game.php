<?php
  $path_to_root = './';
  $title = "Canvas Game";
  include 'header.html';
?>


<style>
button {
  color:red;
  height:4em;
  text-align:center;
  padding: auto;
  margin:auto;
}
div#game{
  margin-left:auto;
  margin-right:auto;
  width:200px;
  display:block;
}
</style>
<div id="game">
<br>
<button onmousedown="moveleft()" onmouseup="stopMove()" ontouchstart="moveleft()">LEFT</button>
<button onmousedown="moveright()" onmouseup="stopMove()" ontouchstart="moveright()">RIGHT</button><br>
<button onmousedown="moveup()" onmouseup="stopMove()" ontouchstart="moveup()">UP</button>
<button onmousedown="movedown()" onmouseup="stopMove()" ontouchstart="movedown()">DOWN</button>
</div>

<?php include 'footer.html';?>

<script src="canvas_game_oo.js">
</script>

<!--<script src="canvas_game.js">
</script>-->
