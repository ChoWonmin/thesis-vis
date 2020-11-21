'use strict';

var polar = new Polar(d3.select('#renderer'));

var target = data;

var yearMap = [];
for (var i = 1995; i < 2017; i++) {
  yearMap.push(i);
}var diffCircle = polar.height / 54;
var padding = 5;

yearMap = _.reduce(yearMap, function (ac, e) {
  ac[e] = (e - 1995 + 5) * diffCircle + padding;
  return ac;
}, {});

polar.drawAxis();

_.forEach(yearMap, function (e, i) {
  if (i % 5 === 0) polar.drawCircle(e, '#333');else polar.drawCircle(e);
});

var colorMap = {
  0: '#ff704f',
  1: '#bee8ad',
  2: '#89c3ff',
  3: '#5041ff',
  4: '#ffbc73'
};

var nodes = _.forEach(target, function (e) {
  var diffAngle = 2 * Math.PI / 1;
  var angle = diffAngle * (Math.random() - 0.5);

  e.radius = yearMap[e.year];
  e.angle = normalizeAngle(angle);
  e.color = colorMap[0];
});

var nodesGroupByYear = {};

var _loop = function _loop(_i) {
  nodesGroupByYear[_i] = _.filter(nodes, function (e) {
    return e.year === _i;
  });
};

for (var _i = 1995; _i < 2017; _i++) {
  _loop(_i);
}

function normalizeAngle(angle) {
  if (angle < 0) return Math.PI * 2 + angle;else if (angle > 2 * Math.PI) return angle - 2 * Math.PI;
  return angle;
}

function collide(collision) {
  var isCollide = true;
  while (isCollide) {
    isCollide = false;

    _.forEach(nodes, function (src) {
      _.forEach(nodesGroupByYear[src.year], function (dest) {
        if (src._id === dest._id) return;

        var theta = Math.abs(src.angle - dest.angle);

        if ((2 * Math.PI - theta) * yearMap[src.year] <= collision) {
          isCollide = true;
          if (src.angle <= dest.angle) {
            src.angle = normalizeAngle(src.angle + 0.01);
            dest.angle = normalizeAngle(dest.angle - 0.01);
          } else if (src.angle > dest.angle) {
            src.angle = normalizeAngle(src.angle - 0.01);
            dest.angle = normalizeAngle(dest.angle + 0.01);
          }
          return;
        }

        var length = theta * yearMap[src.year];

        if (length <= collision) {
          isCollide = true;
          if (src.angle <= dest.angle) {
            src.angle = normalizeAngle(src.angle - 0.01);
            dest.angle = normalizeAngle(dest.angle + 0.01);
          } else if (src.angle > dest.angle) {
            src.angle = normalizeAngle(src.angle + 0.01);
            dest.angle = normalizeAngle(dest.angle - 0.01);
          }
        }
      });
    });
  }
}

function render() {
  _.forEach(nodes, function (e) {
    polar.drawNode(e.radius, e.angle, { color: e.color }).on('mouseover', function () {
      _.forEach(e.references, function (parent) {
        polar.drawLine(e, nodes[parent], { color: '#ffbc73' });
      });

      _.forEach(e.offsprings, function (child) {
        polar.drawLine(e, nodes[child], { color: '#aaffff' });
      });
    }).on('mouseout', function () {
      polar.foregroundG.selectAll('*').remove();
    });

    _.forEach(e.references, function (parent) {
      polar.drawLine(e, nodes[parent]);
    });
  });
}

var roots_topDown = _.filter(nodes, function (e) {
  return e.references.length < 1;
});
var roots_bottomUp = _.filter(nodes, function (e) {
  return e.offsprings.length < 1;
});

function bfs() {
  var visit = {};
  var root = nodes[100]; //roots[0];

  var queue = [];
  queue.push(root);
  visit[root._id] = true;

  while (queue.length > 0) {
    var node = queue.shift();

    for (var _i2 = 0; _i2 < node.references.length; _i2++) {
      var dest = nodes[node.references[_i2]];

      if (!visit[dest._id]) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.color = '#ffaaff';
  }
}

function genTreeByBottomUp(root) {
  var visit = {};

  var queue = [];
  queue.push(root);
  visit[root._id] = true;

  while (queue.length > 0) {
    var node = queue.shift();

    for (var _i3 = 0; _i3 < node.references.length; _i3++) {
      var dest = nodes[node.references[_i3]];

      if (dest === undefined) continue;

      if (!visit[dest._id]) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.angle = root.angle;
  }
}

function genTreeByTopDown(root) {
  var visit = {};

  var queue = [];
  queue.push(root);
  visit[root._id] = true;

  while (queue.length > 0) {
    var node = queue.shift();

    for (var _i4 = 0; _i4 < node.offsprings.length; _i4++) {
      var dest = nodes[node.offsprings[_i4]];

      if (dest === undefined) continue;

      if (!visit[dest._id]) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.angle = root.angle;
  }
}

collide(35);
_.forEach(roots_topDown, function (e) {
  // root
  genTreeByTopDown(e);
});

_.forEach(roots_bottomUp, function (e) {
  // leaf
  e.color = '#5041ff';
  genTreeByBottomUp(e);
});

collide(35);
render();

console.log(roots_bottomUp.length);
console.log(roots_topDown.length);
console.log(target);
console.log(Object.keys(target).length);