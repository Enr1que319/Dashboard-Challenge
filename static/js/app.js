d3.json("../../samples.json").then((data) => {

    function init(index) {

        var sampleValues = data.samples[index].sample_values.slice(0,10);
        var otuIds = data.samples[index].otu_ids.slice(0,10);
        var otuLabels = data.samples[index].otu_labels.slice(0,10);

        data_bar = [{
          x: sampleValues.reverse(),
          y: otuIds.map(object => "OTU " + object).reverse(),
          text: otuLabels.reverse(),
          type: "bar",
          orientation: "h"
         }];

        data_bubble = [{
            x: data.samples[index].otu_ids,
            y: data.samples[index].sample_values,
            text: data.samples[index].otu_labels,
            mode: 'markers',
            marker: {
                color: data.samples[index].otu_ids,
                size: data.samples[index].sample_values
            }
         }]

        var level = (data.metadata[index].wfreq * 200)/10;

        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data_gauge = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: ' scrubs per week',
            text: level,
            hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50/9,50],
        rotation: 90,
        text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3','1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',	  
        marker: {colors:['rgba(0,100,0, .8)','rgba(0,100,0, .7)','rgba(0,100,0, .6)',
                                'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                                'rgba(255, 255, 255, 0)']},
        labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3','1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout_gauge = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        var layout_bubble = {
            xaxis: {title:'OTU 940'}
        };


        Plotly.newPlot("bar", data_bar);
        Plotly.newPlot('gauge', data_gauge,layout_gauge);
        Plotly.newPlot("bubble", data_bubble, layout_bubble);

        d3.select("#sample-metadata").text("")

        for(key in data.metadata[index]){
            d3.select("#sample-metadata").append("p").text(`${key}: ${data.metadata[index][key]}`);
        }
      }

    function change() {

          var dropdown_value = d3.select("#selDataset").property("value");
          var id = data.samples.map( object => object.id);
          var count = 0
          
          id.forEach(element => {
              count += 1;
              if (element == dropdown_value) {
                 index = count - 1
              };
          });

          init(index)

    }

    data.samples.map( object => d3.select("#selDataset").append("option").text(object.id));

    d3.selectAll("#selDataset").on("change", change);

    init(0);
      
});
