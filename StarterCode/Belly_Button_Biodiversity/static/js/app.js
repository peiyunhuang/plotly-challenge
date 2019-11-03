// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
     
    // Use `d3.json` to fetch the metadata for a sample
    var defaultURL = `/metadata/${sample}`;
    d3.json(defaultURL).then(function(alldata) {
  
        // Use d3 to select the panel with id of `#sample-metadata`
        var table = d3.select("#sample-metadata");
        
        table.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
        Object.entries(alldata).forEach(([key, value]) => {
            table.append("h4").text(`${key}:${value}`); 
        });
    });
};

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var defaultURL = `/samples/${sample}`;
    d3.json(defaultURL).then(function(alldata) {
 
        // @TODO: Build a Pie Chart 
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).   
        var trace1 = {
          labels: alldata.otu_ids.slice(0, 10),
          values: alldata.sample_values.slice(0,10),
          hovertext: alldata.otu_labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: 'pie'
        };
  
        var data = [trace1];
  
        var layout = {
            margin: { t: 0, l: 0 }
        };
    
        Plotly.plot("pie", data, layout);

        // @TODO: Build a Bubble Chart using the sample data
        var bubbleData = {
          x: alldata.otu_ids,
          y: alldata.sample_values,
          text: alldata.otu_labels,        
          mode:'markers',
          marker: { 
            size: alldata.sample_values,
            color: alldata.otu_ids,
            colorscale: "Blues"
          }
        };

        var bubbleLayout = {
          margin: { t: 0 },
          hovermode: "closests",
          xaxis: { title: "OTU ID"}
        }
    
        var data = [bubbleData];
        var layout = [bubbleLayout];
        Plotly.plot("bubble", data, layout); 
 
    })
}

function init() {
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();