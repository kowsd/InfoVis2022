let BarChart
let ScatterPlot

d3.csv("https://kowsd.github.io/InfoVis2022/final/data.csv")
    .then( data => {
        data.forEach( d => { 
            d.value = +d.value;
            d.x = +d.x;
            d.y = +d.y;
        });

        bar_chart = new  BarChart({
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:40, left:60},
            title: "Food Price",
            xlabel: "Price",
        }, data);
        bar_chart.update();
    
        d3.select('#reverse')
        .on('click', d => {
            data.reverse();
            bar_chart.update();
        });

        d3.select('#ascend')
        .on('click', d => {
            data.sort((a,b) => a.value - b.value);
            bar_chart.update();
        });

        d3.select('#descend')
        .on('click', d => {
            data.sort((a,b) => b.value - a.value);
            bar_chart.update();
        });

        scatter_plot = new  ScatterPlot({
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:40, left:60},
            title: "Food Price",
            xlabel: "Price",
        }, data);
        scatter_plot.update();

    })
    .catch( error => {
        console.log( error );
    });
