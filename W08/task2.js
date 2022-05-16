d3.csv("https://kowsd.github.io/InfoVis2022/W08/task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:40, right:30, bottom:30, left:30}
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    class LineChart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 256,
                height: config.height || 256,
                margin: config.margin || {top:10, right:10, bottom:10, left:10}
            }
            this.data = data;
            this.init();
        }
          init(){
            let self = this;

            self.svg = d3.select( self.config.parent )
                .attr('width', self.config.width)
                .attr('height', self.config.height);
    
            self.chart = self.svg.append('g')
                .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
    
            self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
            self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
    
            self.xscale = d3.scaleLinear()
                .domain([0, d3.max(self.data, d => d.x)])
                .range( [0, self.inner_width] );
    
            self.yscale = d3.scaleLinear()
                .domain([0, d3.max(self.data, d => d.y)])
                .range([self.inner_height, 0]);
    
            self.xaxis = d3.axisBottom( self.xscale )
                .ticks(5)
                .tickSizeOuter(0);
            
            self.yaxis = d3.axisLeft( self.yscale )
                .tickSizeOuter(0);
    
            self.xaxis_group = self.chart.append('g')
                .attr('transform', `translate(0, ${self.inner_height})`);
            
            self.yaxis_group = self.chart.append('g');

            self.area = d3.area()
                .x( d => self.xscale(d.x) )
                .y1( d => self.yscale(d.y) )
                .y0( d => self.yscale(0) );
 
          }
          update(){
            let self = this;
    
            self.render();
          }
          render(){
            let self = this;

            self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'red');

            self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", 4 );
      
            self.xaxis_group
                .call( self.xaxis );
            self.yaxis_group
                .call( self.yaxis );
            
            }
    }