
// Build metadata Function that buils the metadata panel

function buildMetadata(sample) {



  // fetching the metadata for a sample
    d3.json(`/metadata/${sample}`).then((data) => {


    // selecting the panel with id of `#sample-metadata`
    var panel_body = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel_body.html("");
    // adding each key and value pair to the panel using `Object.entries`
    Object.entries(data).forEach(([key, value])=> {
      panel_body.append("h6").text(`${key}:${value}`);
    });


    // Building the Gauge Chart
    buildGauge(data.WFREQ);
  });
}

// creating function to buildCharts

function buildCharts(sample) {

  // fetching the sample data for the plots
  d3.json(`/samples/${sample}`).then((data)=> {
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;


    // Building a Bubble Chart using the sample data

    var bubbleLayout= {
      margin:{t: 0},
      hovermode:"closest",
      xaxis: { title: "OTU ID"}
    };

    var bubbleData = [
     {
       x: otu_ids,
       y: sample_values,
       text: otu_labels,
       mode: "markers",
       marker: {
         size: sample_values,
         color: otu_ids,
         colorscale: "Earth"
       }
     }
   ];

  // d3.select("#bubble").html("")

  Plotly.plot("bubble", bubbleData, bubbleLayout);


    // Building a Pie Chart

    var pieData = [
     {
       values: sample_values.slice(0, 10),
       labels: otu_ids.slice(0, 10),
       hovertext: otu_labels.slice(0, 10),
       hoverinfo: "hovertext",
       type: "pie"
     }
   ];

   var pieLayout = {
     margin: { t: 0, l: 0 }
   };

   Plotly.plot("pie", pieData, pieLayout);

  });
}

function init() {
  // Grabing a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Using the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Using the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetching new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initializing the dashboard
init();
