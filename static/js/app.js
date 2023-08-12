// use d3 to read in samples.json

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
d3.json(url).then(function(data) {
    // Populate the dropdown options with IDs
    const dropdown = d3.select("#selDataset");
    data.names.forEach(function(id) {
      dropdown.append("option").text(id);
    });
    
    // Display object data from metadata array in json based on ID selected in dropdown
    // Ppulatig Demographics Info element
    function displayMetadata(id) {
      const metadata = data.metadata.find(meta => meta.id.toString() === id);
      const demographicInfo = d3.select("#sample-metadata");
      demographicInfo.html("");
      Object.entries(metadata).forEach(([key, value]) => {
        demographicInfo.append("h6").text(`${key.toLowerCase()}: ${value}`);
      });
    }

    // Display bar chart based on ID selected in dropdown --> https://plotly.com/javascript/bar-charts/
    // https://plotly.com/javascript/horizontal-bar-charts/
    function displayBarChart(id) {
      const samples = data.samples.filter(s => s.id.toString() === id)[0];
      const sampleValues = samples.sample_values.slice(0, 10).reverse();
      const otuIds = samples.otu_ids.slice(0, 10).reverse().map(d => "OTU " + d);
      const otuLabels = samples.otu_labels.slice(0, 10).reverse();
      const barTrace = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
      };
      const barData = [barTrace];
      const barLayout = {
        title: "Top 10 OTUs",
        margin: { t: 30, l: 150 }
      };
      Plotly.newPlot("bar", barData, barLayout);
    }

    // Display bubble chart based on ID selected in dropdown --> https://plotly.com/python/bubble-charts/
    
    //https://plotly.com/python/builtin-colorscales/
    
    function displayBubbleChart(id) {
      const samples = data.samples.filter(s => s.id.toString() === id)[0];
      const sampleValues = samples.sample_values;
      const otuIds = samples.otu_ids;
      const otuLabels = samples.otu_labels;
      const bubbleTrace = {
        x: otuIds,
        y: sampleValues,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "plasma"
        },
        text: otuLabels
      };
      const bubbleData = [bubbleTrace];
      const bubbleLayout = {
        title: "OTU Frequency",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30 }
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }

    // Display gauge chart based on ID selected in dropdown --> https://plotly.com/javascript/gauge-charts/
    //https://www.w3schools.com/cssref/css_colors.php
    
    function displayGaugeChart(id) {
      const samples = data.metadata.filter(meta => meta.id.toString() === id)[0];
      const washFreq = samples.wfreq;
      const gaugeTrace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9]},
          bar: { color: "#FA8072" },
          steps: [
            { range: [0, 1], color: "#FFFABE" },
            { range: [1, 2], color: "#FFF44F" },
            { range: [2, 3], color: "#FFD700" },
            { range: [3, 4], color: "#FFB884" },
            { range: [4, 5], color: "#FF6B6B" },
            { range: [5, 6], color: "#D6425E" },
            { range: [6, 7], color: "#93204D" },
            { range: [7, 8], color: "#561D3E" },
            { range: [8, 9], color: "#330C2F" }
          ]
        }
      };
      const gaugeData = [gaugeTrace];
      const gaugeLayout = {
        width: 600,
        height: 450,
        margin: { t: 0, b: 0 }
      };
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    }

    // Display charts and metadata based on ID selected in dropdown
    function optionChanged(id) {
      displayMetadata(id);
      displayBarChart(id);
      displayBubbleChart(id);
      displayGaugeChart(id);
    }

    // Initialize page with data from first ID
    displayMetadata(data.names[0]);
    displayBarChart(data.names[0]);
    displayBubbleChart(data.names[0]);
    displayGaugeChart(data.names[0]);
  
  // Set up event listener for dropdown changes
  dropdown.on("change", function() {
    const selectedId = d3.select(this).property("value");
    optionChanged(selectedId);
  });
  
  });

