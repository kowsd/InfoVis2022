d3.csv("https://kowsd.github.io/InfoVis2022/W08/task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:40, left:60},
            title: "Food Price",
            xlabel: "Price",
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    class BarChart{
          constructor(config,data){
            this.config = {
                  parent: config.parent,
                  width: config.width || 256,
                  height: config.height || 256,
                  margin: config.margin || {top:10, right:10, bottom:10, left:10},
                  title: config.title || "",
                  xlabel: config.xlabel || "",
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
                .domain([0, d3.max(self.data, d => d.value)])
                .range( [0, self.inner_width] );
    
            self.yscale = d3.scaleBand()
                .domain(self.data.map(d => d.label))
                .range([0, self.inner_height])
                .paddingInner(0.1);
    
            self.xaxis = d3.axisBottom( self.xscale )
                .ticks(5)
                .tickSizeOuter(0);
            
            self.yaxis = d3.axisLeft( self.yscale )
                .tickSizeOuter(0);
    
            self.xaxis_group = self.chart.append('g')
                .attr('transform', `translate(0, ${self.inner_height})`);
            
            self.yaxis_group = self.chart.append('g');
    
            self.labels = self.svg.append('g')
                .attr('transform', `translate(self.margin.left, self.margin.top)`);
          }
          update(){
            let self = this;

            const xmax = d3.max( self.data, d => d.value );
            self.xscale.domain( [0, xmax] );
    
            self.render();
          }
          render(){
            let self = this;

            self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());
      
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
                .text(self.config.xlabel);
            }
    }