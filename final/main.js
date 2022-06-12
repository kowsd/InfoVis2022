d3.csv("https://kowsd.github.io/InfoVis2022/final/data.csv")
    .then( data => {
        data.forEach( d => { 
            d.value = +d.value;
            d.x = +d.x;
            d.y = +d.y;
            d.first = +d.first;
            d.second = +d.second;
            d.third = +d.third;
        });

        bar_chart = new  BarChart({
            parent: '#drawing_region_barchart',
            width: 512,
            height: 512,
            margin: {top:50, right:10, bottom:40, left:60},
            title: "Graph1",
        }, data);
        bar_chart.update();
    
        scatter_plot = new  ScatterPlot({
            parent: '#drawing_region_scatterplot',
            width: 512,
            height: 512,
            margin: {top:50, right:10, bottom:40, left:60},
            title: "セリーグ投手の防御率,勝率",
            xlabel: "防御率",     
            ylabel: "勝率",
        }, data);
        scatter_plot.update();

        d3.select('#1')
        .on('click', d => {
            const bar_chart = new BarChart(config,data);
            data.reverse();
            bar_chart.update();
        });

    })
    .catch( error => {
        console.log( error );
    });
