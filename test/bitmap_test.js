var expect = require('chai').expect;
var transforms = require(__dirname + '/../lib/transforms.js')();
var metadata = require(__dirname + '/../lib/metadata.js')();
var palette = require(__dirname + '/../lib/palette.js')();

describe('fileType', function(){
  before(function(){
  buf = new Buffer("BM");
  });
  it('should print out a string of characters', function(){
    expect(metadata.fileType(buf)).to.eql("BM");
  });
});

describe('pixelArrayOffSet', function(){
  var  firstbuf;
  before(function(){
    firstbuf = new Buffer(100);
    for (var i = 0; i < 100; i++){
      firstbuf[i] = 0x00;
    }
      firstbuf[10] = 0x36; // 0x36 = 54
 //<Buffer 00 00  00  00  00  00  00  00  00  00  36  00  00  00  00  00>
  });
  it('should  tell where the pixel data starts', function(){
    expect(metadata.pixelArrayOffset(firstbuf)).to.eql(54);
  });
  it('should give the number of bytes of the pallete when used in paletteSize function', function(){
    expect(metadata.paletteSize(firstbuf)).to.eql(0);  // this should not have a palette, so size shoudl be zero
  });
});

// I don't need to test my printMetaData functions because they jsut console.log strings and use the buf.ReadUInt32LE() method that is built into Node - so they are already tested

describe('getPal', function(){
  var paletteArray = [];
   var  firstbuf;
   var data = [];
  before(function(){
    firstbuf = new Buffer(100);
    for (var i = 0; i < 100; i++){
      firstbuf[i] = 0x00;
      data[i] = 1;
    }
      firstbuf[10] = 0x37; // 0x39 = offset of 55  (so one only time through the loop!)
 //<Buffer 00 00  00  00  00  00  00  00  00  00  36  00  00  00  00  00>
  palette.getPal(paletteArray, data ,firstbuf);
  });
  it('it should turn an empty array into an array of numbers', function(){
    expect(paletteArray).to.eql([1, 1, 1, 1]);
  });

});


describe('blueScalePal', function(){
  var paletteArray = [];
  var  firstbuf;
  var data = [];
  before(function(){
    firstbuf = new Buffer(100);
    for (var i = 0; i < 100; i++){
      firstbuf[i] = 0x00;
      data[i] = 1;
    }
      firstbuf[10] = 0x37; // 0x39 = offset of 55  (so one only time through the loop!)
 //<Buffer 00 00  00  00  00  00  00  00  00  00  36  00  00  00  00  00>
  palette.getPal(paletteArray, data ,firstbuf);
  transforms.blueScalePal(paletteArray);
  });

  it('should invert ONLY the blue color data for images with a palette', function() {
    expect(paletteArray).to.eql([254, 1, 1, 1]);
  });

});

/// redscale and greenscale functions are identical to bluescale, just shifted by 1 number. So they don't need special tests.


describe('invertNonPal', function(){
  var  firstbuf;
  var data = [];
  before(function(){
    firstbuf = new Buffer(100);
    for (var i = 0; i < 100; i++){
      firstbuf[i] = 0x  00;
      data[i] = 1;
    }
      firstbuf[10] = 0x37; // 0x39 = offset of 55  (so one only time through the loop!)
 //<Buffer 00 00  00  00  00  00  00  00  00  00  36  00  00  00  00  00>
    transforms.invertNonPal(data, firstbuf);
  });
  it('should invert color data for non-palette images', function(){
    expect(data[98]).to.eql(254);
  });
});
