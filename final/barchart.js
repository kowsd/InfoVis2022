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
          .domain([0, d3.max(self.data, d => d.save)])
          .range( [0, self.inner_width] );

      self.yscale = d3.scaleBand()
          .domain(self.data.map(d => d.name))
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

      self.labels = self.svg.append('g');

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


    update(){
      let self = this;

      const xmax = d3.max( self.data, d => d.save );
      self.xscale.domain( [0, xmax] );

      self.yscale.domain(self.data.map(d => d.name));

      console.log( self.data );

      self.render();
    }


    render(){
      let self = this;

      self.chart.selectAll("rect")
      .data(self.data)
      .join("rect")
      .transition().duration(1000)
      .attr("x", 0)
      .attr("y", d => self.yscale(d.name))
      .attr("width", d => self.xscale(d.save))
      .attr("height", self.yscale.bandwidth())
      .attr('fill', 'blue');

      self.xaxis_group
          .call( self.xaxis );
      self.yaxis_group
          .call( self.yaxis );
      
      }
}
