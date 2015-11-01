module.exports = exports =  {
    printMetaDataBM: printMetaDataBM,
    printHeaderMetaData : printHeaderMetaData,
    fileType: fileType,
    pixelArrayOffset: pixelArrayOffset,
    paletteSize : paletteSize
  };

var os = require('os');

function readUInt32(buf, offset) {
  if (os.endianness() === 'BE') {
    return buf.readUInt32BE(offset);
  }
  return buf.readUInt32LE(offset);
}

function readUInt16(buf, offset) {
  if (os.endianness() === 'BE') {
    return buf.readUInt16BE(offset);
  }
  return buf.readUInt16LE(offset);
}

function fileType(data){
  return data.toString('utf8', 0 ,2);  // check for bmp type (BM, BA, CI, CP, IC, PT)
}

function pixelArrayOffset(data){
  return readUInt32(data, 10);
}

function paletteSize(data){
  return pixelArrayOffset(data) - 54;
}


/// prints  header metadata for all file types
function printHeaderMetaData(data) {
  console.log("first 2 bytes tell me this bitmap file type is " , data.toString('utf8', 0 ,2));

  console.log("bytes 2 - 5 tell me that this file is ", readUInt32(data, 2), " bytes in size");

  console.log("bytes 10 - 13 tell me that the offset of the pixel array is " , readUInt32(data, 10));

  if (paletteSize(data) !== 0) {
    console.log("the palette data  (color table) is ", paletteSize(data) , "bytes");
  }
  else {
    console.log("this file has no palette data (color table)");
  }
}

/////// prints metadata for BM files
function printMetaDataBM(data){
  console.log("The size of the file header is ", readUInt32(data, 14) , " bytes");

  console.log("The width of the image is ", readUInt32(data, 18) , " pixels");

  console.log("The height of the image is ", readUInt32(data, 22) , " pixels");

  console.log("The number of color panes is ", readUInt16(data, 26));

  console.log("The color depth (number of bits per pixel) is", readUInt16(data, 28));

  console.log("The image size is of the raw bitmap file is ", readUInt32(data, 34), " bytes");

  console.log("The horizontal resolution ", readUInt32(data, 38), " pixels/meter");

  console.log("The veritcal resolution ", readUInt32(data, 42), " pixels/meter");
}

