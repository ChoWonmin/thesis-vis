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
  this.axisG = this.root.append('g');
  this.backgroundG = this.root.append('g');
  this.foregroundG = this.root.append('g');
  this.activeG = this.root.append('g');

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
  this.origin = {x: 30, y: this.height};
  this.axisLength = this.width - 80;
  this.mappingY = {};
  this.strokeColor = '#bdbdbd'; //'#ededed';
};
Plane.prototype = {
  /**
   * draw axis
   * @param {string} [c] Axis color (default='#fefefe')
   */
  drawAxisX: function (offset, text, c, weight=1) {
    const color = c || this.strokeColor;

    this.axisG.append('line')
      .attr('x1',this.origin.x)
      .attr('y1',this.origin.y - offset)
      .attr('x2',this.origin.x + this.axisLength)
      .attr('y2',this.origin.y - offset)
      .attr('stroke',color)
      .attr('stroke-width', weight);

    if (text) {
      this.axisG.append('text')
        .attr('x', this.origin.x + this.axisLength + 4)
        .attr('y', this.origin.y - offset)
        .attr('fill', '#444444')
        .attr('alignment-baseline', 'central')
        .text(text)
    }
  },
  drawBox: function(y, title, authors) {
    const rectWidth = this.axisLength - 30;

    this.backgroundG.append('rect')
      .attr('x', this.origin.x + 30)
      .attr('y', y - 15)
      .attr('width', rectWidth)
      .attr('height', 30)
      .attr('fill','#575757');

    if (title || authors) {
      this.backgroundG.append('text')
        .attr('x', this.origin.x + 30 + rectWidth/2)
        .attr('y', y)
        .attr('fill', '#fefefe')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .text(`${title}  ${authors}`)
    }

  },
  /**
   * draw node
   * @param {number} x
   * @param {number} y
   * @param {object} [node] node property(size, color)
   */
  drawNode: function(x, y, node = {}) {
    if (!x || !y) {
      return new Error('x, y mush be a number.');
    }
    const circle = {
      x: this.origin.x + x,
      y: this.origin.y - y,
      size: node.size||'7',
      color: node.color||'#fefefe',
    };

    return this.activeG.append('circle')
      .attr('cx',circle.x)
      .attr('cy',circle.y)
      .attr('r',circle.size)
      .attr('fill',circle.color)
      .attr('opacity',0.8)
  },
  clear: function () {
    this.mappingY = {};
    this.backgroundG.selectAll('*').remove();
    this.axisG.selectAll('*').remove();
    this.foregroundG.selectAll('*').remove();
    this.activeG.selectAll('*').remove();
  }

};

