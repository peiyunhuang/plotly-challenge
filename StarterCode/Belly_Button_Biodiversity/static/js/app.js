function buildMetadata(sample) {
  var defaultURL = `/metadata/${sample}`;
d3.json(defaultURL).then(function(alldata) {
  console.log(alldata)
 
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  
      var table = d3.select("#sample-metadata");
      Object.entries(alldata).forEach(([key, value]) => table.append("h6").text(`${key}: ${value}`)); 
      
    
  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
})};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var defaultURL = `/samples/${sample}`;
d3.json(defaultURL).then(function(alldata) {
  console.log(alldata)

  var trace1 = {
    labels: alldata.otu_ids.slice(0, 10),
    values: alldata.sample_values.slice(0,10),
    type: 'pie'
  
  };
  
  var data = [trace1];
  
  var layout = {
  };
  Plotly.plot("pie", data, layout);

  var bubbletrace = {
    x : alldata.otu_ids,
    y :alldata.sample_values,
    mode:'markers',
    marker : { 
      size : alldata.sample_values,
      color : alldata.otu_ids
  }
};
  var data = [bubbletrace];
  Plotly.plot("bubble", data, layout); 
 
});

}


    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
     
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
