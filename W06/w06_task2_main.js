d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:40, right:30, bottom:30, left:30},
            title: "Title",
            xlabel: "X",
            ylabel: "Y",
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || "",
            xlabel: config.xlabel || "",
            ylabel: config.ylabel || "",
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height , 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(10, ${self.inner_height})`);
        
        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(6);
        
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(10, 0)`);

        self.labels = self.svg.append('g')
            .attr('transform', `translate(self.margin.left, self.margin.top)`);
        
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [0, xmax+10] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [0, ymax+10] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x +10 ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
        
         self.labels.append("text")   
            .attr("x", self.inner_width/2 + self.config.margin.left)
            .attr("y", self.config.margin.top/2)
            .style("text-anchor", "middle")
            .attr("font-size", "16pt")
            .attr("font-weight", "bold")
            .text(self.config.title);
        

        self.labels.append("text")   
            .attr("x", self.inner_width/2 + self.config.margin.left)
            .attr("y", self.inner_height + self.config.margin.top + self.config.margin.bottom)
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(self.config.xlabel);
        
        self.labels.append("text")  
            .attr("transform", "rotate(-90)") 
            .attr("x", -self.inner_height/2 - self.config.margin.top)
            .attr("y", self.config.margin.left/2)
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(self.config.ylabel);
        
    }
}
