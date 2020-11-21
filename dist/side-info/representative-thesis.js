'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RepresentativeThesis = function () {
    function RepresentativeThesis() {
        _classCallCheck(this, RepresentativeThesis);
    }

    _createClass(RepresentativeThesis, [{
        key: 'makeView',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(representativeThesisId) {
                var response, thesisData;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return axios.get('http://dblp.ourguide.xyz/papers/' + representativeThesisId + '/info');

                            case 3:
                                response = _context.sent;
                                thesisData = response.data;

                                console.log('thesisData : ', thesisData);

                                // 컨텐츠들 띄우기
                                $('.thesis-title-content').text(thesisData.title);
                                $('.thesis-author-content').text(_.join(thesisData.authors, ', '));
                                $('.thesis-paper-keyword-content').text(_.join(thesisData.keyword, ', '));

                                _context.next = 14;
                                break;

                            case 11:
                                _context.prev = 11;
                                _context.t0 = _context['catch'](0);

                                console.log(_context.t0);

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 11]]);
            }));

            function makeView(_x) {
                return _ref.apply(this, arguments);
            }

            return makeView;
        }()
    }, {
        key: 'destroyView',
        value: function destroyView() {}
    }]);

    return RepresentativeThesis;
}();

// const representativeThesis = new RepresentativeThesis();
// representativeThesis.makeView();