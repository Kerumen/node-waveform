var lame = require('lame');
var wav = require('wav');
var fs = require('fs');

var input = fs.createReadStream('sound.mp3');
var output = fs.createWriteStream('sound.wav');

var decoder = new lame.Decoder();

// we have to wait for the "format" event before we can start encoding
decoder.on('format', onFormat);

// and start transferring the data
input.pipe(decoder);

function onFormat (format) {
    // write the decoded MP3 data into a WAV file
    var writer = new wav.Writer(format);
    decoder.pipe(writer).pipe(output);
}