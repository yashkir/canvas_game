<?php
  $path_to_root = './';
  $title = "Canvas Game";
  include 'header.html';
?>

<div id="game">
</div>

<script src="canvas_game.js">
</script>
<style>
button {
  color:red;
  height:4em;
  text-align:center;
  margin:auto;
}
</style>
<table id="controls">
  <tr>
    <td><button onmousedown="moveleft()" onmouseup="stopMove()" ontouchstart="moveleft()">LEFT</button></td>
    <td><button onmousedown="moveup()" onmouseup="stopMove()" ontouchstart="moveup()">UP</button></td>
    <td><button onmousedown="moveright()" onmouseup="stopMove()" ontouchstart="moveright()">RIGHT</button></td>
  <tr>
    <td></td>
    <td><button onmousedown="movedown()" onmouseup="stopMove()" ontouchstart="movedown()">DOWN</button></td>
</table>

<?php include 'footer.html';?>
