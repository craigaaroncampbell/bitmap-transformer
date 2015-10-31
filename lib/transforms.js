module.exports = exports = function(){

  var metadata = require('./metadata.js')()

  function invertNonPal(data, firstbuf){
      for (var i = metadata.pixelArrayOffset(firstbuf); i < data.length; i++){
        data[i] = 255 - data[i];  //invert the colors
      }
    }




   function blueScalePal(paletteArray){
      for (var i = 0; i < paletteArray.length; i +=4){
        paletteArray[i] = 255 - paletteArray[i] // invert every 4th pallete data value
      }
    }
     function greenScalePal(paletteArray){
      for (var i = 1; i < paletteArray.length; i +=4){
        paletteArray[i] = 255 - paletteArray[i] // invert every 4th pallete data value
      }
    }
     function redScalePal(paletteArray){
      for (var i = 2; i < paletteArray.length; i +=4){
        paletteArray[i] = 255 - paletteArray[i] // invert every 4th pallete data value
      }
    }

   return {
      invertNonPal : invertNonPal,
      blueScalePal : blueScalePal,
      greenScalePal : greenScalePal,
      redScalePal : redScalePal
    }
}

