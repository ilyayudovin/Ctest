document.getElementById('input').addEventListener('change', function() {
    let fr = new FileReader();
    fr.onload=function(){
      processFunc(fr.result);
    };
    fr.readAsText(this.files[0]);
  });

const processFunc = (input) => {
  const content = input.split('\n');
  const step = content[0].split(' ');
  content.shift();
  if(step[0] === 'C'){
    const canvasWidth = Number(step[1]);
    const canvasHeight = Number(step[2]);
    const canvas = Array.from(Array(canvasHeight + 2), () => new Array(canvasWidth + 2).fill(' '));
    drawField(canvas);
    while(content.length > 0){
      const step = content[0].split(' ');
      content.shift();
      switch (step[0]) {
        case 'L': drawLine(canvas,Number(step[1]),Number(step[2]),Number(step[3]),Number(step[4]));
        break;
        case 'R': drawRectangle(canvas,Number(step[1]),Number(step[2]),Number(step[3]),Number(step[4]));
        break;
        case 'B': fill(canvas, Number(step[1]), Number(step[2]), step[3]);
      }
    }
    canvas.forEach(arr => arr.push('\n'));
    const text = canvas.toString().split(',').join(' ');
    writeRes(text);
  }
  else {
    writeRes('No canvas size provided')
  }
};

const drawField = (canvas) => {
  for(let i = 0;i < canvas.length;i+=canvas.length-1){
    for(let j = 0;j < canvas[i].length;j++){
      canvas[i][j] = '-';
    }
  }
  for(let i = 1;i < canvas.length - 1;i++){
    for(let j = 0;j < canvas[i].length;j += canvas[i].length - 1){
      canvas[i][j] = '|';
    }
  }
};

const drawLine = (canvas,x1,y1,x2,y2) => {
  if(y1 === y2) {
    for(let i = x1;i <= x2;i++){
      canvas[y1][i] = 'x';
    }
  }
  if(x1 === x2){
    for(let i = y1;i<=y2;i++){
      canvas[i][x1] = 'x';
    }
  }
};

const drawRectangle = (canvas,x1,y1,x2,y2) => {
  for(let i = y1;i <= y2;i+= y2-y1){
    for(let j = x1;j <= x2;j++){
      canvas[i][j] = 'x';
    }
  }
  for(let i = y1;i < y2;i++){
    for(let j = x1;j <= x2;j += x2-x1){
      canvas[i][j] = 'x';
    }
  }
};

const fill = (canvas,y,x,c) => {

  let queue = [];
  queue.push({x: x, y:y});
  canvas[x][y] = c;
  while(queue.length > 0) {
    let v = queue.shift();
    let adj = [{x: v.x+1, y: v.y},{x:v.x-1, y:v.y},{x:v.x, y:v.y+1},{x:v.x, y:v.y-1}];
    for(let n of adj) {
      if(canvas[n.x][n.y] !== c) {
        if(canvas[n.x][n.y] !== 'x' && canvas[n.x][n.y] !== '-' && canvas[n.x][n.y] !== '|'){
          queue.push({x: n.x, y: n.y});
          canvas[n.x][n.y] = c;
        }
      }
    }
  }
};

const writeRes = (text) => {
  const type = 'data:application/octet-stream;base64, ';
  const base = btoa(text);
  const res = type + base;
  document.getElementById('output').href = res;
};
