d3.csv("https://kowsd.github.io/InfoVis2022/final/data.csv")
    .then( data => {
        data.forEach( d => { 
            d.Name = +d.Name;
            d.Team = +d.Team;
            d.Save = +d.Save;
            d.Win = +d.Win;
        });

    const color_scale = d3.scaleOrdinal()
        .domain(["阪神","広島","ヤクルト","巨人","中日","DeNA"])
        .range(["yellow","red","navy","orange","blue","skyblue"]);

        bar_chart = new  BarChart({
            parent: '#drawing_region_barchart',
            width: 512,
            height: 512,
            margin: {top:50, right:10, bottom:40, left:100},
            title: "防御率",
            color: color_scale,
        }, data);
        bar_chart.update();

        var choise = document.getElementById('choise');
        choise.onchance = function(){
            data = data.filter.includes(this.value);
            console.log( 'a' );
            bar_chart.update();
        }

    
        scatter_plot = new  ScatterPlot({
            parent: '#drawing_region_scatterplot',
            width: 512,
            height: 512,
            margin: {top:50, right:10, bottom:40, left:60},
            title: "防御率,勝率の散布図",
            xlabel: "防御率",     
            ylabel: "勝率",
            color: color_scale,
        }, data);
        scatter_plot.update();

    })
    .catch( error => {
        console.log( error );
    });
