// Copyright (c) 2017, Baidu Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview string utilities tests
 *
 * @author copperybean.zhang
 */
goog.require('rebar.util');

describe('string.js test suite', function () {
  it('timeDes test', function () {
    expect(rebar.util.string.timeDes(0)).toBe('0sec');
    expect(rebar.util.string.timeDes(10)).toBe('0sec');
    expect(rebar.util.string.timeDes(999)).toBe('0sec');
    expect(rebar.util.string.timeDes(1000)).toBe('1sec');
    expect(rebar.util.string.timeDes(1001)).toBe('1sec');
    expect(rebar.util.string.timeDes(59 * 1000)).toBe('59sec');
    expect(rebar.util.string.timeDes(60 * 1000)).toBe('1min');
    expect(rebar.util.string.timeDes(61 * 1000)).toBe('1min1sec');
    expect(rebar.util.string.timeDes(3599 * 1000)).toBe('59min59sec');
    expect(rebar.util.string.timeDes(3600 * 1000)).toBe('1hour');
    expect(rebar.util.string.timeDes(3601 * 1000)).toBe('1hour');
    expect(rebar.util.string.timeDes(3661 * 1000)).toBe('1hour1min');
    expect(rebar.util.string.timeDes(24 * 3600 * 1000)).toBe('1day');
    expect(rebar.util.string.timeDes(150 * 24 * 3600 * 1000)).toBe('150day');

    expect(rebar.util.string.timeDes(10)).toBe('10ms');
    var time = 150 * 24 * 3600 * 1000 + 11 * 3600 * 1000 + 24 * 60 * 1000 + 5000;
    expect(rebar.util.string.timeDes(time, 3))
    .toBe('150day11hour24min');
  });
});
