'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *
 * @class Plane
 * @description It helps to draw Coordinate System while using d3.js. It provides function to draw concave hull.
 * @param {Object} [renderer] d3 renderer object
 */
var Plane = function Plane(renderer) {
  /**
   * d3 renderer object
   * @property {Object}
   */
  this.root = renderer;
  this.axisG = this.root.append('g').attr('class', 'axis');
  this.backgroundG = this.root.append('g').attr('class', 'background');
  this.foregroundG = this.root.append('g').attr('class', 'foreground');
  this.activeG = this.root.append('g').attr('class', 'active');
  this.searchedThesisId = null;

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
  this.origin = { x: this.width / 2, y: this.height / 2 };
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
  drawAxisX: function drawAxisX(offset, text, c) {
    var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    var color = c || this.strokeColor;

    this.axisG.append('line').attr('x1', this.origin.x - this.axisLength / 2).attr('y1', this.origin.y + offset).attr('x2', this.origin.x + this.axisLength / 2).attr('y2', this.origin.y + offset).attr('stroke', color).attr('stroke-width', weight);

    if (text) {
      this.axisG.append('text').attr('x', this.origin.x + this.axisLength / 2 + 4).attr('y', this.origin.y + offset).attr('fill', '#444444').attr('alignment-baseline', 'central').text(text);
    }
  },
  drawBox: function drawBox(y, title) {
    var rectWidth = this.axisLength - 60;

    this.backgroundG.append('rect').attr('x', this.origin.x - rectWidth / 2).attr('y', y - 15).attr('width', rectWidth).attr('height', 30).attr('fill', '#575757');

    if (title) {
      this.backgroundG.append('text').attr('x', this.origin.x).attr('y', y).attr('fill', '#fefefe').attr('text-anchor', 'middle').attr('alignment-baseline', 'central').text('' + title);
    }
  },
  /**
   * draw node
   * @param {number} x
   * @param {number} y
   * @param {object} [node] node property(size, color)
   */
  drawNode: function drawNode(x, y) {
    var node = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var g = arguments[3];

    if (isNaN(x) || isNaN(y)) {
      return new Error('x, y mush be a number.');
    }
    var circle = {
      x: this.origin.x + x,
      y: y,
      size: node.size || this.nodeRadius,
      color: node.color || '#fefefe'
    };

    return this.activeG.append('circle').attr('cx', circle.x).attr('cy', circle.y).attr('r', circle.size).attr('fill', circle.color).attr('opacity', 0.8);
  },
  drawPolygon: function drawPolygon() {
    var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var color = arguments[1];

    var c = color || '#fefefe';

    return g.append('polygon').attr('points', points.map(function (r) {
      return r.x + ',' + r.y + ' ';
    }).join(' ')).attr('fill', c).attr('opacity', 0.2);
  },
  drawForceSimulation: function drawForceSimulation(nodes, x, y) {
    var _this = this;

    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#c62828';
    var searchedThesisId = arguments[4];

    var g = this.activeG.append('g');
    var convexHull = g.append("path").attr("class", 'hull');

    var u = g.selectAll('circle').data(nodes).enter().append('circle').attr('r', this.nodeRadius).attr('fill', color);

    if (!_.isNil(searchedThesisId)) this.searchedThesisId = searchedThesisId;

    d3.forceSimulation(nodes).force('charge', d3.forceManyBody().strength(10)).force('center', d3.forceCenter(this.origin.x + x, y)).force('collision', d3.forceCollide().radius(this.nodeRadius + 3)).force("forceY", d3.forceY().strength(.1).y(.3)).on('tick', function () {
      u.attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      });

      var hull = d3.polygonHull(u.data().map(function (d) {
        return [d.x, d.y];
      }));
      convexHull.datum(hull).attr("d", function (d) {
        return "M" + d.join("L") + "Z";
      }).attr("fill", color).attr("opacity", .4).on('click', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var group, groupSearchedThesisContained, representativeThesis;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                group = _.map(nodes, function (e) {
                  return e._id;
                });
                groupSearchedThesisContained = _.cloneDeep(group);

                groupSearchedThesisContained.push(_this.searchedThesisId);

                _context.next = 5;
                return axios.post('http://dblp.ourguide.xyz/papers/representative', { group: groupSearchedThesisContained });

              case 5:
                representativeThesis = _context.sent.data;

                sideViewManager.makeView(group, representativeThesis._id, color);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })));
      // u.exit().remove();
    });
  },
  drawLine: function drawLine(src, dest) {
    var line = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    line = {
      x1: this.origin.x + src.x,
      y1: src.y,
      x2: this.origin.x + dest.x,
      y2: dest.y,
      color: line.color || '#C62828',
      strokeWidth: line.strokeWidth || 2,
      opacity: line.opacity || .2
    };

    this.foregroundG.append('line').attr('x1', line.x1).attr('y1', line.y1).attr('x2', line.x2).attr('y2', line.y2).attr('stroke', line.color).attr('stroke-width', line.strokeWidth).attr('opacity', 0.2);
  },
  clear: function clear() {
    this.mappingY = {};
    this.backgroundG.selectAll('*').remove();
    this.axisG.selectAll('*').remove();
    this.foregroundG.selectAll('*').remove();
    this.activeG.selectAll('*').remove();
  }

};