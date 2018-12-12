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
  drawNode: function(x, y, node = {}, g) {
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

    return g.append('polygon')
      .attr('points', points.map(r=> `${r.x},${r.y} `).join(' '))
      .attr('fill',c)
      .attr('opacity',0.2)
  },
  drawForceSimulation: function(nodes, x, y, color = '#c62828') {
    const g = this.activeG.append('g');
    const convexHull = g.append("path")
      .attr("class",'hull');

    const u = g
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', this.nodeRadius)
      .attr('fill', color);

    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(10))
      .force('center', d3.forceCenter(this.origin.x + x, y))
      .force('collision', d3.forceCollide().radius(this.nodeRadius + 3))
      .force("forceY", d3.forceY().strength(.1).y(.5))
      .on('tick', () => {
        u.attr('cx', d => d.x).attr('cy', d => d.y);

        const hull = d3.polygonHull(u.data().map(function(d) { return [d.x, d.y]; }) );
        convexHull.datum(hull)
          .attr("d", function(d) {
            return "M" + d.join("L") + "Z"; })
          .attr("fill", color)
          .attr("opacity", .4).
          on('click', async function () {
            /* 컨벡스헐 클릭하면
            groups 변수에 그룹들 id 배열로 저장 */
            const group = _.map(nodes, e => e._id);
            console.log(group);

            // if (첫번째 뎁스인지) group.push();
            const representativeThesis = (await axios.post('http://dblp.ourguide.xyz/papers/representative', {group: group})).data;
            console.log('representativeThesis', representativeThesis._id);
            // sideViewManager.makeView(group,
            //     representativeThesis._id,
            //     color);
            sideViewManager.makeView([
                  "4be8eaca-a28a-4382-86c2-9314735066bd",
                  "7281e056-a2f6-4df3-bd54-fbd8ed8b737c",
                  "78efca65-ac1a-49bd-92ec-c8f0770fefb8",
                  "7d911d74-c4c1-4d4d-a737-5cf51e404c83",
                  "85bd9cc6-e41a-4fd4-8f3b-e776329efc4b",
                  "aa16086f-f3bf-432a-bfcd-9f1521c9ac52",
                  "cab91964-4e8d-4211-8d32-455cfd690b60",
                  "dc00221e-92c4-4ee4-8a7b-666ab5fd28c5",
                  "ea9489be-45f6-482f-937c-11b644d5f2ce",
                  "f258af24-e04a-49d4-86c3-1ab1c2f43914",
                  "fa96abdc-7c09-419b-a00d-4c24d5879eeb"
                ],
                "fa96abdc-7c09-419b-a00d-4c24d5879eeb",
                '#311B92');
        });

      });
  },
  drawLine: function (src, dest, line = {}) {
    line = {
      x1: this.origin.x + src.x,
      y1: src.y,
      x2: this.origin.x + dest.x,
      y2: dest.y,
      color: line.color || '#C62828',
      strokeWidth: line.strokeWidth || 2,
      opacity: line.opacity || .2,
    };

    this.foregroundG.append('line')
      .attr('x1', line.x1)
      .attr('y1', line.y1)
      .attr('x2', line.x2)
      .attr('y2', line.y2)
      .attr('stroke', line.color)
      .attr('stroke-width', line.strokeWidth)
      .attr('opacity', 0.2);
  },
  clear: function () {
    this.mappingY = {};
    this.backgroundG.selectAll('*').remove();
    this.axisG.selectAll('*').remove();
    this.foregroundG.selectAll('*').remove();
    this.activeG.selectAll('*').remove();
  }

};

