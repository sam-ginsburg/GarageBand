canvas = document.getElementById("fft");
canvas_context = canvas.getContext("2d");

function update() {
  // This graph has 30 bars.
  var num_bars = 30;

  // Get the frequency-domain data
  var data = new Uint8Array(2048);
  analyzer.getByteFrequencyData(data);

  // Clear the canvas
  canvas_context.clearRect(0, 0, this.width, this.height);

  // Break the samples up into bins
  var bin_size = Math.floor(length / num_bars);
  for (var i=0; i < num_bars; ++i) {
    var sum = 0;
    for (var j=0; j < bin_size; ++j) {
      sum += data[(i * bin_size) + j];
    }

    // Calculate the average frequency of the samples in the bin
    var average = sum / bin_size;

    // Draw the bars on the canvas
    var bar_width = canvas.width / num_bars;
    var scaled_average = (average / 256) * canvas.height;

    canvas_context.fillRect(i * bar_width, canvas.height, bar_width - 2,
                         -scaled_average);
}

// Render every 50ms
window.setInterval(update, 50);