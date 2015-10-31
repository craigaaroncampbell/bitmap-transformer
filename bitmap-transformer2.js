#!/usr/bin/env node

'use strict';

  var fs = require('fs');
  var EE = require('events').EventEmitter;
  var myEE = new EE();
  var metadata = require('./lib/metadata.js')()
  var transforms = require('./lib/transforms.js')()
  var palette = require('./lib/palette.js')()

  // Open file using fs and read it into a buffer
  //file to read is 1st command line arg

  myEE.on('open', function(){
    fs.readFile(__dirname + '/img/' + process.argv[2], function(err, firstbuf){
      if (err) return console.log(err);
      metadata.printHeaderMetaData(firstbuf)

      if (metadata.fileType(firstbuf) === 'BM') {
        metadata.printMetaDataBM(firstbuf)
        myEE.emit('bufToObj', firstbuf); //data is a buffer
      } else {
        console.log("THE FILE TYPE IS NOT BM! ");
      }
    });
  });

  myEE.emit('open')

  // Convert buffer into a Javascript Object
  myEE.on('bufToObj', function(firstbuf){
    var obj =  firstbuf.toJSON() // {type: 'Buffer',  data : [decimal equivalents of the hex numbers]}
    if (metadata.paletteSize(firstbuf) === 0) { //if this has no color palette data (no color table)
      myEE.emit('transformNonPal', obj.data, firstbuf) // pass on the array of data
    }else {
      myEE.emit('transformPal', obj.data, firstbuf) // pass on the array of data
    }

  });

  // // Run a transform on that Javascript Object.
  myEE.on('transformNonPal', function(data, firstbuf){//here data refers to obj.data array

    transforms.invertNonPal(data, firstbuf)

    myEE.emit('toBuffer', data) // data should NOW be inverted

  });

  myEE.on('transformPal', function(data, firstbuf){ // data refers to obj.data array


    var paletteArray = [];
    palette.getPal(paletteArray, data, firstbuf)

    transforms.blueScalePal(paletteArray)

    var newData = data.slice(0, 54).concat(paletteArray).concat(data.slice(metadata.pixelArrayOffset(firstbuf)))

 console.log("changed: ", paletteArray[0], paletteArray[1], paletteArray[2], paletteArray[3] )

    myEE.emit("toBuffer", newData)

  });


  // Turn the transformed object back into a buffer.
  myEE.on('toBuffer', function(data){  //this data is an array of the inverted data
    var finalbuf = new Buffer(data.length);
    for (var i = 0; i < finalbuf.length; i++){
      finalbuf[i] = data[i]
    }

    myEE.emit('write', finalbuf) //now data should be a buffer again
  })

  // Write that buffer to a new file.
  // file to write to is 2nd command line arg
  myEE.on('write', function(data){
    fs.writeFile(__dirname + '/img/' + process.argv[3], data, function(){
      console.log("Transformed image has been saved")
    });
  });

