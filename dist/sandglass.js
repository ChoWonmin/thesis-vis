'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sandglass = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
  var searchBar, searchList, searchItem, logoBtn, colorMap, that, group, currentGroup, target, main, list;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          searchBar = document.getElementById('search-input');
          searchList = document.getElementById('search-list');

          searchItem = function searchItem(title, authors, id) {
            var item = document.createElement('div');
            item.setAttribute('id', id);
            item.classList.add('item');

            var titleEle = document.createElement('div');
            titleEle.classList.add('title');
            titleEle.innerHTML = title;

            var authorsEle = document.createElement('div');
            authorsEle.classList.add('author');
            authorsEle.innerHTML = authors;

            item.appendChild(titleEle);
            item.appendChild(authorsEle);

            return item;
          };

          logoBtn = document.getElementsByClassName('logo')[0];
          colorMap = ['#c62828', '#c2185b', '#311b92', '#304ff3', '#00b8d4', '#2e7d32', '#ffd600', '#ffa000', '#4e342e', '#37474f'];
          that = this;
          group = [];
          currentGroup = 0;
          target = {
            self: {},
            parents: {},
            offsprings: {}
          };
          main = new Plane(d3.select('#main'));


          this.renderBackground = function () {
            var year = target.self.year;

            var padding = 30;
            var num = 31;
            var diff = (main.height - 2 * padding) / (num - 1);

            main.clear();

            main.mappingY[year] = main.origin.y;
            main.drawAxisX(0, year, '#9B9B9B');

            for (var i = 1; i <= 15; i++) {
              var py = diff * -i;
              var oy = diff * i;
              main.mappingY[year - i] = main.origin.y + py;
              main.mappingY[year + i] = main.origin.y + oy;

              if (i % 5 === 0) {
                main.drawAxisX(py, year - i, '#9B9B9B');
                main.drawAxisX(oy, year + i, '#9B9B9B');
              } else {
                // main.drawAxisX(py);
                // main.drawAxisX(oy);
              }
            }
          };

          list = {}; //(await axios.get('http://dblp.ourguide.xyz/papers/f14df1ed-e3e9-4348-9040-fc06e3411b95/ancestor')).data;

          this.update = function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return axios.get('http://dblp.ourguide.xyz/papers/' + id + '/info');

                    case 2:
                      target.self = _context.sent.data;
                      _context.t0 = _;
                      _context.next = 6;
                      return axios.get('http://dblp.ourguide.xyz/papers/' + id + '/ancestor', {
                        params: {
                          value: 2
                        }
                      });

                    case 6:
                      _context.t1 = _context.sent.data.group;
                      target.parents = _context.t0.chain.call(_context.t0, _context.t1).groupBy('year').value();
                      _context.t2 = _;
                      _context.next = 11;
                      return axios.get('http://dblp.ourguide.xyz/papers/' + id + '/offspring', {
                        params: {
                          value: 7
                        }
                      });

                    case 11:
                      _context.t3 = _context.sent.data.group;
                      target.offsprings = _context.t2.chain.call(_context.t2, _context.t3).groupBy('year').value();

                    case 13:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }();

          this.renderGroup = function () {};

          this.render = function () {
            main.drawBox(main.mappingY[target.self.year], target.self.title);

            var nodes = [];
            for (var i = 1; i <= 15; i++) {
              var yearGroup = target.parents[target.self.year - i];

              if (i % 5 == 0) {
                if (nodes.length >= 1) {
                  main.drawForceSimulation(nodes, 0, main.mappingY[target.self.year - i + 3], colorMap[0], target.self._id);
                  main.drawLine({ x: 0, y: main.mappingY[target.self.year] - 15 }, { x: 0, y: main.mappingY[target.self.year - i + 3] }, { strokeWidth: 10, color: colorMap[0] });
                }
                nodes = [];
              }

              _.forEach(yearGroup, function (e) {
                nodes.push(e);
              });
            }

            nodes = [];
            for (var _i = 1; _i <= 15; _i++) {
              var _yearGroup = target.offsprings[target.self.year + _i];

              if (_i % 5 == 0) {
                if (nodes.length >= 1) {
                  main.drawForceSimulation(nodes, 0, main.mappingY[target.self.year + _i - 2], colorMap[2]);
                  main.drawLine({ x: 0, y: main.mappingY[target.self.year] + 15 }, { x: 0, y: main.mappingY[target.self.year + _i - 2] }, { strokeWidth: 10, color: colorMap[2] });
                }

                nodes = [];
              }

              _.forEach(_yearGroup, function (e) {
                nodes.push(e);
              });
            }
          };

          this.addSearchEvent = function () {
            searchBar.addEventListener('keyup', function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(event) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        event.preventDefault();

                        if (!(event.keyCode === 13)) {
                          _context3.next = 7;
                          break;
                        }

                        _context3.next = 4;
                        return axios.get('http://dblp.ourguide.xyz/papers/search', {
                          params: {
                            q: searchBar.value
                          }
                        });

                      case 4:
                        list = _context3.sent.data;


                        searchList.innerHTML = '';
                        _.forEach(list, function (e) {
                          var item = searchItem(e.title, e.authors, e._id);
                          searchList.appendChild(item);

                          item.addEventListener('click', function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
                              var id;
                              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      id = this.getAttribute('id');
                                      _context2.next = 3;
                                      return that.update(id);

                                    case 3:
                                      that.renderBackground(target.self.year);
                                      that.render();

                                    case 5:
                                    case 'end':
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2, this);
                            }));

                            return function (_x3) {
                              return _ref4.apply(this, arguments);
                            };
                          }());
                        });

                      case 7:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }());
          };

          this.addSearchEvent();
          logoBtn.addEventListener('click', function (event) {
            main.clear();
          });

        case 18:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this);
}))();