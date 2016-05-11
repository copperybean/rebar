js_test(
    name = 'basecontroller_test',
    srcs = [
        'mvc/basecontroller_test.js'
    ],
    deps = [
        ':for_test',
        ':jasmine',
    ]
)

js_test(
    name = 'paginationview_test',
    srcs = [
        'views/paginationview_test.js'
    ],
    deps = [
        ':for_test',
        ':jasmine',
    ]
)

js_test(
    name = 'tabscontroller_test',
    srcs = [
        'mvc/tabscontroller_test.js'
    ],
    deps = [
        ':for_test',
        ':jasmine',
    ]
)

js_test(
    name = 'messagebox_test',
    srcs = [
        'messagebox_test.js'
    ],
    deps = [
        ':for_test',
        ':jasmine',
    ]
)

js_test(
    name = 'util_test',
    srcs = [
        'util_test.js'
    ],
    deps = [
        ':for_test',
        ':jasmine',
    ]
)

js_module(
    name = 'for_test',
    srcs = [
        'fortest.js',
    ],
    deps = [
        ':closure_library',
        ':jsbase',
    ],
    entry_namespace = 'baidu.base.Test',
)

js_library(
    name = 'jsbase',
    srcs = [
        'closuredialog.js',
        'closuredialog.soy',
        'const.js',
        'cookie.js',
        'css/common.css',
        'dialoginterface.js',
        'factory3rdparty.js',
        'logger.js',
        'messagebox.js',
        'mvc/basecontroller.js',
        'mvc/baseinput.js',
        'mvc/basemodel.js',
        'mvc/baseview.js',
        'mvc/common.soy',
        'mvc/tabscontroller.js',
        'mvc/viewcontroller.js',
        'mvc/urlrestfulinfo.js',
        'settings.js',
        'stateful.js',
        'structs/set.js',
        'util.js',
        'views/inputwrapper.js',
        'views/paginationview.js',
        'views/semanticsearchwrapper.js',
        'views/semanticsearchwrapper.soy',
    ],
    deps = [
        './img:jsbase_resource'
    ],
    baidu_style = True,
    is_closure_based = True,
    check_code_style = True
)

js_library(
    name = 'jsbase_history',
    srcs = [
        'history.js',
        'urltool.js',
    ],
    is_closure_based = True
)

resource_file(
    name = 'closure_library',
    deps = [
        '//thirdparty/js/closure-library/:goog',
        '//thirdparty/js/closure-template:closure_soy',
    ]
)

resource_file(
    name = 'jasmine',
    deps = [
        '//thirdparty/js/jasmine/jasmine-reporters-master/src:jasmine_reporter',
        '//thirdparty/js/jasmine/jasmine-standalone-1.3.0/lib/jasmine-1.3.0:jasmine',
    ]
)

