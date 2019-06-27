/* Affichage du graphique */
drawChart("example1", 0);
drawChart("example2", 0.25);
drawChart("example3", 0.5);
drawChart("example4", 0.75);
drawChart("example5", 0.9);
drawChart("example6", 1);

function drawChart(div, trueR) {

  nv.addGraph(function () {
    chart = nv.models.scatterChart()
      .showLegend(false)
      .pointShape("circle")
      .pointRange([50, 50]);

    chart.xAxis.ticks(0).tickFormat(d3.format('.01f'));
    chart.yAxis.ticks(0).tickFormat(d3.format('.01f'));
    chart.tooltip.enabled(false);
    chart.interactive(false);

    chartSVG = d3.select('#' + div + ' svg')
      .datum(generateCorrelatedSample(trueR));

    chartSVG
      .transition()
      .duration(500)
      .call(chart)

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

/* Calcul du graphique */
var trueR;

function generateCorrelatedSample(trueR) {
  // Calcul de la série de données
  var meanVector = [0, 0];
  var covarianceMatrix = [
    [1.0, trueR],
    [trueR, 1.0],
  ];
  var distribution = window.MultivariateNormal.default(meanVector, covarianceMatrix);

  // Récupération des coordonnées
  var coordinates = [];
  coordinates.push({
    color: "#8F3433",
    values: []
  });

  for (var i = 0; i < 50; i++) {
    var currentSample = distribution.sample();
    coordinates[0].values.push({
      x: currentSample[0],
      y: currentSample[1]
    });
  }

  return coordinates;
}