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
        console.log( self.data );
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
            .text(self.config.xlabel);
        
        self.labels.append("text")  
            .attr("transform", "rotate(-90)") 
            .attr("x", -self.inner_height/2 - self.config.margin.top)
            .attr("y", self.config.margin.left/2)
            .style("text-anchor", "middle")
            .text(self.config.ylabel);
        
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.Save );
        const xmax = d3.max( self.data, d => d.Save );
        self.xscale.domain( [0, xmax+1] );

        const ymin = d3.min( self.data, d => d.Win );
        const ymax = d3.max( self.data, d => d.Win );
        self.yscale.domain( [0, 1] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.Save ) )
            .attr("cy", d => self.yscale( d.Win ) )
            .attr("r", 5 )
            .on('mouseover', (e,d) => {
                d3.select(e.currentTarget)
                    .attr('fill','red');
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.Save}, ${d.Win})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', (e) => {
                d3.select(e.currentTarget)
                    .attr('fill','black');
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
        
    }
}
