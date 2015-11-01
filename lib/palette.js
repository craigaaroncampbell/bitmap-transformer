module.exports = exports =  {
    getPal : getPal
  };


var metadata = require('./metadata.js');

function getPal(paletteArray, data, firstbuf){
  for (var i = 54; i < metadata.pixelArrayOffset(firstbuf); i+=4){
    var blue = data[i];
    var green = data[i + 1];
    var red = data[i + 2];
    var alpha = data[i + 3];

    paletteArray.push(blue);
    paletteArray.push(green);
    paletteArray.push(red);
    paletteArray.push(alpha);
  }
}


