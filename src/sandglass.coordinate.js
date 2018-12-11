/**
 *
 * @class Plane
 * @description It helps to draw Coordinate System while using d3.js. It provides function to draw concave hull.
 * @param {Object} [renderer] d3 renderer object
 */
const Plane =  function(renderer) {
  /**
   * d3 renderer object
   * @property {Object}
   */
  this.root = renderer;
  this.axisG = this.root.append('g').attr('class','axis');
  this.backgroundG = this.root.append('g').attr('class','background');
  this.foregroundG = this.root.append('g').attr('class','foreground');
  this.activeG = this.root.append('g').attr('class','active');

  /**
   * canvas width
   * @property {number}
   */
  this.width = this.root.node().getBoundingClientRect().width;
  /**
   * canvas height
   * @property {number}
   */
  this.height = this.root.node().getBoundingClientRect().height;
  /**
   * origin point
   * @property {object}
   */
  this.origin = {x: this.width/2, y: this.height/2};
  this.axisLength = this.width - 80;
  this.mappingY = {};
  this.strokeColor = '#bdbdbd'; //'#ededed';
  this.nodeRadius = 7;
  this.groupRadius = (this.height - 60) / 12;
};
Plane.prototype = {
  /**
   * draw axis
   * @param {string} [c] Axis color (default='#fefefe')
   */
  drawAxisX: function (offset, text, c, weight=1) {
    const color = c || this.strokeColor;

    this.axisG.append('line')
      .attr('x1',this.origin.x - this.axisLength/2)
      .attr('y1',this.origin.y + offset)
      .attr('x2',this.origin.x + this.axisLength/2)
      .attr('y2',this.origin.y + offset)
      .attr('stroke',color)
      .attr('stroke-width', weight);

    if (text) {
      this.axisG.append('text')
        .attr('x', this.origin.x + this.axisLength/2 + 4)
        .attr('y', this.origin.y + offset)
        .attr('fill', '#444444')
        .attr('alignment-baseline', 'central')
        .text(text)
    }
  },
  drawBox: function(y, title) {
    const rectWidth = this.axisLength - 60;

    this.backgroundG.append('rect')
      .attr('x', this.origin.x - rectWidth/2)
      .attr('y', y - 15)
      .attr('width', rectWidth)
      .attr('height', 30)
      .attr('fill','#575757');

    if (title) {
      this.backgroundG.append('text')
        .attr('x', this.origin.x)
        .attr('y', y)
        .attr('fill', '#fefefe')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .text(`${title}`)
    }

  },
  /**
   * draw node
   * @param {number} x
   * @param {number} y
   * @param {object} [node] node property(size, color)
   */
  drawNode: function(x, y, node = {}) {
    if (isNaN(x) || isNaN(y)) {
      return new Error('x, y mush be a number.');
    }
    const circle = {
      x: this.origin.x + x,
      y: y,
      size: node.size||this.nodeRadius,
      color: node.color||'#fefefe',
    };

    return this.activeG.append('circle')
      .attr('cx',circle.x)
      .attr('cy',circle.y)
      .attr('r',circle.size)
      .attr('fill',circle.color)
      .attr('opacity',0.8)
  },
  drawPolygon: function(points = [], color) {
    const c =  color||'#fefefe';

    return this.activeG.append('polygon')
      .attr('points', points.map(r=> `${this.origin.x + r.x},${r.y} `).join(' '))
      .attr('fill',c)
      .attr('opacity',0.8)
  },
  drawForceSimulation: function(nodes, x, y, color = '#c62828') {
    // const group = this.activeG.append('circle')
    //                   .attr('cx',this.origin.x + x)
    //                   .attr('cy',y)
    //                   .attr('r',this.groupRadius)
    //                   .attr('fill',color)
    //                   .attr('opacity',0.6);

    const u = this.activeG.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', this.nodeRadius)
      .attr('fill', color);

    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(this.origin.x + x, y))
      .force('collision', d3.forceCollide().radius(10))
      .force('y', d3.forceY().y(0))
      .on('tick', () => {
          u.attr('cx', d => d.x).attr('cy', d => d.y);
      });
  },
  clear: function () {
    this.mappingY = {};
    this.backgroundG.selectAll('*').remove();
    this.axisG.selectAll('*').remove();
    this.foregroundG.selectAll('*').remove();
    this.activeG.selectAll('*').remove();
  }

};

