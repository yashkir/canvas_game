<?php 
  $path_to_root = './';
  $title = "Canvas Game";
  include 'header.html';
?>

<div id="game">
</div>

<script src="canvas_game.js">
</script>

<button onmousedown="moveup()" onmouseup="stopMove()" ontouchstart="moveup()">UP</button>
<button onmousedown="movedown()" onmouseup="stopMove()" ontouchstart="movedown()">DOWN</button>
<button onmousedown="moveleft()" onmouseup="stopMove()" ontouchstart="moveleft()">LEFT</button>
<button onmousedown="moveright()" onmouseup="stopMove()" ontouchstart="moveright()">RIGHT</button>

<?php include 'footer.html';?>
