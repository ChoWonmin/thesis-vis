/**
 *
 * @class Polar
 * @description It helps to draw Polar Coordinate System while using d3.js. It provides function to draw point by Polar Equation and draw Axis.
 * @param {Object} [renderer] d3 renderer object
 */
const Polar =  function(renderer) {
  /**
   * d3 renderer object
   * @property {Object}
   */
  this.root = renderer;
  this.axisG = this.root.append('g');
  this.backgroundG = this.root.append('g');
  this.activeG = this.root.append('g');
  this.backgroud = renderer;
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
  this.strokeColor = '#ddd';
};
Polar.prototype = {
  /**
   * draw axis
   * @param {string} [c] Axis color (default='#fefefe')
   */
  drawAxis: function (c) {
    const color = c || this.strokeColor;

    this.axisG.append('line')
      .attr('x1','0')
      .attr('y1',this.height/2)
      .attr('x2',this.width)
      .attr('y2',this.height/2)
      .attr('stroke',color);

    this.axisG.append('line')
      .attr('x1',this.width/2)
      .attr('y1','0')
      .attr('x2',this.width/2)
      .attr('y2',this.height)
      .attr('stroke',color);
  },
  /**
   * draw node by Polar Equation
   * @param {number} radius
   * @param {number} theta
   * @param {object} [node] node property(size, color)
   */
  drawNode: function(radius, theta, node = {}) {
    const circle = {
      x: this.origin.x + radius*Math.cos(theta),
      y: this.origin.y + radius*Math.sin(theta),
      size: node.size||'5',
      color: node.color||'#fefefe',
    };

    this.activeG.append('circle')
      .attr('cx',circle.x)
      .attr('cy',circle.y)
      .attr('r',circle.size)
      .attr('fill',circle.color)
      .attr('opacity',0.8)
  },
  /**
   * draw circle axis by radius
   * @param radius
   */
  drawCircle: function(radius, color = this.strokeColor, text, weight=.6) {

    this.axisG.append('circle')
      .attr('cx',this.origin.x)
      .attr('cy',this.origin.y)
      .attr('r',radius)
      .attr('fill','transparent')
      .attr('stroke', color)
      .attr('stroke-width', weight);

    if (text) {
      this.axisG.append('text')
        .attr('x', this.origin.x)
        .attr('y', this.origin.y + radius - 6)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text(text)
    }

  },

  drawLine: function (src, dest, line = {}) {
    line = {
      x1: this.origin.x + src.radius * Math.cos(src.angle),
      y1: this.origin.y + src.radius * Math.sin(src.angle),
      x2: this.origin.x + dest.radius * Math.cos(dest.angle),
      y2: this.origin.y + dest.radius * Math.sin(dest.angle),
      color: line.color || '#b3b3b3',
      strokeWidth: line.strokeWidth || 1
    };

    this.activeG.append('line')
      .attr('x1', line.x1)
      .attr('y1', line.y1)
      .attr('x2', line.x2)
      .attr('y2', line.y2)
      .attr('stroke', line.color)
      .attr('stroke-width', line.strokeWidth)
      .attr('opacity', 0.8);

  },

  clear: function () {
    this.activeG.selectAll('*').remove();
  }

};
