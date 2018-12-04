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
  this.origin = {x: this.width/2, y: this.height};
  this.strokeColor = '#ddd';
};
Plane.prototype = {
  /**
   * draw axis
   * @param {string} [c] Axis color (default='#fefefe')
   */
  drawAxisX: function (offset, text, c) {
    const color = c || this.strokeColor;

    this.axisG.append('line')
      .attr('x1',0)
      .attr('y1',this.origin.y - offset)
      .attr('x2',this.width)
      .attr('y2',this.origin.y - offset)
      .attr('stroke',color);

    if (text) {
      this.axisG.append('text')
        .attr('x', 30)
        .attr('y', this.origin.y - offset - 4)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text(text)
    }
  },
  clear: function () {
    this.activeG.selectAll('*').remove();
    this.foregroundG.selectAll('*').remove();
  }

};

