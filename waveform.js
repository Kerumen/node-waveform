var fs = require('fs');
var wav = require('wav');

var file = fs.createReadStream('test/test.wav');
var reader = new wav.Reader();

var data;
var svg;

svg = "<?xml version=\"1.0\"?>" +
  "<style>rect { fill: rgb(255,0,0); } line { stroke: rgb(0,0,0); stroke-width: 1px; }</style>" +
  "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">" +
  "<svg width=\"100%\" height=\"100%\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
  "<rect width=\"100%\" height=\"100%\" />" +
  "<svg y=\"0%\" width=\"100%\" height=\"100%\">";

reader.on('format', function (format) {
  //console.log(format);

  reader
    .on('data', function (buffer) {
      data += buffer;
    })
    .on('end', function () {

      var byte = 2;
      var ratio = 80;
      var details = 5;

      var dataSize = Math.floor(data.length / (ratio + byte) + 1);
      var dataPoint = 0;

      console.log(dataSize);

      for (var i = 0; i < data.length && dataPoint < dataSize; ++i) {
        if (dataPoint++ % details == 0) {
          var bytes = [];
          bytes[0] = data[i];
          i++;
          bytes[1] = data[i];
          var tmp;
          if (bytes[1].charCodeAt(0) & 128) {
            tmp = 0;
          } else {
            tmp = 128;
          }
          tmp = String.fromCharCode(((bytes[1].charCodeAt(0)) & 127) + tmp);
          console.log(tmp);
          var number = Math.floor(findValues(bytes[0], tmp) / 256);

          //console.log(number);

          i += ratio;

          var x1, x2;
          x1 = x2 = dataPoint / dataSize * 100;
          var y1 = number / 255 * 100;
          var y2 = 100 - y1;
          if (y1 != y2) {
            svg += "<line x1=\"" + x1.toFixed(2) + "%\" y1=\"" + y1.toFixed(2) + "%\" x2=\"" + x2.toFixed(2) + "%\" y2=\"" + y2.toFixed(2) + "%\" />";
          }
        } else {
          i += ratio + byte;
        }
      }
      svg += "</svg>" +
        "</svg>";
      //console.log(svg);
    });
});

file.pipe(reader);

function findValues (byte1, byte2) {
  byte1 = hexdec(bin2hex(byte1));
  byte2 = hexdec(bin2hex(byte2));
  return (byte1 + (byte2 * 256));
}

function bin2hex (s) {
  var i, l, o = '',
    n;
  s += '';
  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i)
      .toString(16);
    o += n.length < 2 ? '0' + n : n;
  }
  return o;
}

function hexdec(hex_string) {
  hex_string = (hex_string + '')
    .replace(/[^a-f0-9]/gi, '');
  return parseInt(hex_string, 16);
}
