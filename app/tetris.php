<?php 
  $path_to_root = "../";
  $title = "Page Title";
  include '../header.html';
?>

<style>
.tetris {
  background-color:black;
  width:100%;
  margin:auto;
  font-family:monospace;
  color:white;
  text-align:center;
  font-size:16px;
}

</style>

<script>
const height= 40;
const width = 20;
const block = 
  "..X."+
  "..X."+
  ".XX."+
  "....";

var x_pos = 10;
var y_pos = 4;

var field1 = new Array;
var i,j,push;

//TODO finish this shit
for(row = 0; i < height; i++) {
  for(j = 0; j < width; j++) {
    if (ji == 0) { push = ' ' };
    field1[i * width + j] = ' ';
  }
}
//TODO finish this too

var field =
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"X                    X\n" +
"XXXXXXXXXXXXXXXXXXXXXX\n"

function printField() {
  var buffer ="";
  for(i = 0; i < field.length; i++) {
    if (field[i] == 'X') {
      buffer += 'y';
    } else {
      buffer += field[i];
    }
    buffer[i] = field[i];
  }
  document.getElementById('tetris_screen').innerHTML = buffer;
}

function onKeyDown(k) {
  console.log(k.code);
}


document.addEventListener("keydown", onKeyDown);
</script>

<div>
<button type="button" onclick="printField()">
Test</button>

<pre id=tetris_screen class=tetris>
</pre>
</div>

<?php include '../footer.html';?>
