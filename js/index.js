var context = new AudioContext();
var audio = document.getElementById('audio');
var processor = context.createScriptProcessor(2048, 1, 1);
var factor = 300;

var circle = document.getElementById('circle');
var ring = document.getElementById('ring');
var text = document.getElementById('text');
var size = circle.clientHeight;

var colors = ["#E91E63", "#03A9F4", "#009688", "#f44336", "#3F51B5", "#4CAF50", "#FF5722"];
var c = 0;

var oldSize = size;

function circleChange(x) {
    var newSize = size + x * factor;
    circle.style.height = newSize + 'px';
    circle.style.width = newSize + 'px';
    ring.style.height = (newSize/2 + size/2) + 'px';
    ring.style.width = (newSize/2 + size/2) + 'px';
    if (newSize - oldSize > factor/6) {
        circle.style.background = colors[(++c) % colors.length];
        text.style.color = colors[c % colors.length];
    }
    oldSize = newSize;
}

audio.addEventListener('canplaythrough', function() {
    var source = context.createMediaElementSource(audio);
    source.connect(processor);
    source.connect(context.destination);
    processor.connect(context.destination);
    audio.play();
}, false);

processor.onaudioprocess = function(e) {
    var input = e.inputBuffer.getChannelData(0);
    var total = 0;
    for (var i = 0; i < input.length; i++) {
        total += Math.abs(input[i]);
    }
    var rootMeanSquared = Math.sqrt(total/input.length);
    circleChange(rootMeanSquared);
}

window.onload = audio.load();
