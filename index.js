#!/usr/bin/env node

'use strict';

var fs = require('fs');
var EE = require('events').EventEmitter;
var myEE = new EE();
var metadata = require('./lib/metadata.js')();
var transforms = require('./lib/transforms.js')();
var palette = require('./lib/palette.js')();

// Open file using fs and read it into a buffer
//file to read is 1st command line arg
fs.readFile(__dirname + '/img/' + process.argv[2], function(err, firstbuf){
  if (err) return console.log(err);
  metadata.printHeaderMetaData(firstbuf);

  if (metadata.fileType(firstbuf) === 'BM') {
    metadata.printMetaDataBM(firstbuf);
    myEE.emit('bufToObj', firstbuf); //data is a buffer after being read from file
  }

  if (metadata.fileType(firstbuf) !== 'BM') {
    console.log("THE FILE TYPE IS NOT BM!");
  }
});


// Convert buffer into a Javascript Object
myEE.on('bufToObj', function(firstbuf){
  var obj =  firstbuf.toJSON(); // turn buffer into an object
  //{type: 'Buffer',  data : [decimal equivalents of the hex numbers]}

  if (metadata.paletteSize(firstbuf) === 0) { //if this has NO color palette data (no color table)
    myEE.emit('transformNonPal', obj.data, firstbuf);
  }

  if (metadata.paletteSize(firstbuf) !== 0){ // if there IS color palette data in the bmp
    myEE.emit('transformPal', obj.data, firstbuf);
  }
});

// // Run a transform on the pixel data for  a non-palette object
myEE.on('transformNonPal', function(data, firstbuf){//here data refers to obj.data array
  transforms.invertNonPal(data, firstbuf);
  myEE.emit('toBuffer', data, firstbuf); // data is now  inverted
});

// Run a transform on the color palette data for a paletted object
myEE.on('transformPal', function(data, firstbuf){ // data refers to obj.data array
  var paletteArray = [];

  palette.getPal(paletteArray, data, firstbuf); // puts just the palette data in paletteArray

  transforms.blueScalePal(paletteArray); // do a bluescale transformation on data in paletteArray

  data = data.slice(0, 54).concat(paletteArray).concat(data.slice(metadata.pixelArrayOffset(firstbuf))); // insert the altered palette data back into the data array
  myEE.emit("toBuffer", data, firstbuf);
});

// Turn the transformed object back into a buffer.
myEE.on('toBuffer', function(newData, firstbuf){  //this data is an array of the inverted data
  for (var i = 0; i < firstbuf.length; i++){
    firstbuf[i] = newData[i];
  }
  myEE.emit('write', firstbuf); //now data should be a buffer again
});

// Write that buffer to a new file.
// file to write to is 2nd command line arg
myEE.on('write', function(firstbuf){
  fs.writeFile(__dirname + '/img/' + process.argv[3], firstbuf, function(){
    console.log("Transformed image has been saved");
  });
});

