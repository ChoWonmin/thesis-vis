'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupKeyword = function () {
    function GroupKeyword() {
        _classCallCheck(this, GroupKeyword);
    }

    _createClass(GroupKeyword, [{
        key: 'makeView',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(group) {
                var response, keywords, maxCountOfKeywords;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return axios.post('http://dblp.ourguide.xyz/papers/topic', {
                                    group: group
                                    // value: "5"
                                });

                            case 3:
                                response = _context.sent;
                                keywords = response.data; // array

                                console.log('keywords : ', keywords);
                                maxCountOfKeywords = keywords[0].count;

                                // 컨텐츠들 띄우기

                                _.forEach(keywords, function (keywordUnit) {
                                    var template = '\n                    <div class="keyword-unit">\n                        <div class="keyword">' + keywordUnit.keword + '</div>\n                        <div class="bar-graph-zone">\n                            <div class="bar-graph"></div>\n                        </div>\n                        <div class="count">' + keywordUnit.count + '\uD68C</div>\n                    </div>\n                    ';

                                    var $template = $(template);
                                    $template.find('.bar-graph').css('width', keywordUnit.count / maxCountOfKeywords * 120);
                                    $('.group-keyword').append($template);
                                });
                                _context.next = 13;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](0);

                                console.log(_context.t0);

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 10]]);
            }));

            function makeView(_x) {
                return _ref.apply(this, arguments);
            }

            return makeView;
        }()
    }, {
        key: 'destroyView',
        value: function destroyView() {
            $('.keyword-unit').remove();
        }
    }]);

    return GroupKeyword;
}();

// const groupKeyword = new GroupKeyword();
// groupKeyword.makeView();