# rebar
An mvc library based on [Closure Library](https://github.com/google/closure-library).

Like its name, this library mainly concentrates on the framework when building a project with Closure Library. Users are suggested to browse the [demo source codes](https://github.com/copperybean/rebar/tree/master/demo/src/main/resources/static/js) first, especially [controller](https://github.com/copperybean/rebar/tree/master/demo/src/main/resources/static/js/controller) and [view](https://github.com/copperybean/rebar/tree/master/demo/src/main/resources/static/js/view). If you are impatient to read following words, you can start you own project according to the demo now, I think it's really easy to understand the source codes.

Closure library is an excellent library, rebar wants to provide following abilities when developing [SPA](https://en.wikipedia.org/wiki/Single-page_application) project based on Closure Library.
1. An MVC system to manage pages and abstract interaction of related pages in SPA
2. The ability of routing from uri to specific page state.
3. Conveniently interacting with web server using json format in advance level of [Closure Compiler](https://github.com/google/closure-compiler).
4. Processing form simply.

## Page managing and view controller
If you had developed an iOS app, you may be familiar with [iOS view controller](https://developer.apple.com/library/content/featuredarticles/ViewControllerPGforiPhoneOS/), if not, you are strongly recommended to visit that page and have a look at the diagrams. In rebar, [tabs controller](https://github.com/copperybean/rebar/blob/master/src/mvc/tabscontroller.js) inherits from [view controller](https://github.com/copperybean/rebar/blob/master/src/mvc/viewcontroller.js), so it is managing a batch of tabs(view controllers), and a view providing container of these tabs. In rebar demo, you can browse [index controller](https://github.com/copperybean/rebar/blob/master/demo/src/main/resources/static/js/controller/index.js) which inherits from tabs controller and [index page](https://github.com/copperybean/rebar/blob/master/demo/src/main/resources/static/js/view/indexpage.js) first.  Method ```rebar.demo.view.IndexPage.prototype.getContentElement``` specifies the container of tabs, navigation bar's click event triggers the switch of tabs, index controller is response for managing the instances of tabs.

Tabs controller can be used to abstract the interaction of some related pages. In the demo, you may find that you can go to job instance page by clicking the detail button in [running jobs tab](http://104.154.173.69/), and you can do same thing in [job list tab](http://104.154.173.69/?t=l) when visiting [africa_forest_monitor's instances](http://104.154.173.69/?t=l&jlt=jil&jname=africa_forest_monitor&jilt=jilp). This behavior can be abstracted to a class ```rebar.demo.controller.JobInsList```.

## Routing

Routing from uri to specific page in SPA project requires an important feature: this specific page is a state of the SPA project, and this state can be stored in uri and replayed from uri. Take the demo as example again, the [create job](http://104.154.173.69/?t=c) page is a state of the demo SPA project, this page is implemented by index controller by activating create job tab. A key-value map is used to record the whole project's state, we name the create job tab as ```rebar.demo.view.IndexPage.TabName.CREATE_JOB```, and store the name in the map with key ```rebar.demo.common.state.Keys.INDEX_TAB```. Other tab controllers can record their active tab state in the map with same mechanism.

Interface [stateful](https://github.com/copperybean/rebar/blob/master/src/mvc/stateful.js) is used to abstract this logic, tabs controller implemented this interface to switch to a tab marked as active in the state map when ```setState``` method called, and the active tab's ```setState``` method will be called same-time with same argument. In demo project, when index controller's ```setState``` method is called, the whole project will go to a correct state.

Saving this map to uri and replay state from uri is really straightforward, please refer to class [```rebar.util.StatefulUri```](https://github.com/copperybean/rebar/blob/master/src/util/statefuluri.js). The default implementation is to save the map in query part of uri, this can be overrided by subclass to save the map in path or both.

You may find ```rebar.mvc.View``` implemented this interface also, so a view can have routing state such as the current page number.

## Model
Rebar added two features to model. Firstly, the ```toJson``` and ```initWithJson``` methods defined in [base model](https://github.com/copperybean/rebar/blob/master/src/mvc/model.js). In [advance level of closure compiler](https://developers.google.com/closure/compiler/docs/api-tutorial3), the field name of a class will be simplified after compile, but the field name of json object sent from web server will not change. So ```initWithJson``` should be called when accepting object from web server, such as [```rebar.demo.model.java.restResponseFromJson```](https://github.com/copperybean/rebar/blob/master/demo/src/main/resources/static/js/model/java.js), ```toJson``` method is similar.

Secondly, the model class can be generated from model defined in web server, including ```toJson``` and ```initWithJsonMethod```, such as [```HiveJob```](http://104.154.173.69/js/model/java/schedule/hivejob.js) in demo. Now, only one [builder](https://github.com/copperybean/rebar/tree/master/tool/jsmodel-builder) is implemented to generate model class from java codes.

## Form
Normally, these two operations will be needed when processing form, model loading or saving and validation. Method ```loadFromObject``` of class [```rebar.view.Form```](https://github.com/copperybean/rebar/blob/master/src/view/form.js) can load the form from model object, method ```saveToObject``` is similar. Method ```validateInputs``` is used to validate all inputs in the form. Class [```rebar.view.Input```](https://github.com/copperybean/rebar/blob/master/src/view/input.js) abstracts a general inputs and works for most situation, users can provide specific inputs by inheriting the base input easily. Please refer to [edit job page](https://github.com/copperybean/rebar/blob/master/demo/src/main/resources/static/js/view/editjobpage.js) in the demo.

## About the demo

You can visit the deployed [demo page](http://104.154.173.69) first, it's a little slow, because the debug version is deployed for the convenience of browsing the source codes in developer tools.

How to deploy the demo.
1. java 1.8+, maven and python are required.
2. Check out the source code of rebar.
3. Check out closure library with version v20170124 to the same directory as rebar: ```git clone -b v20170124 https://github.com/google/closure-library.git```
4. Build the rebar tools: ```cd rebar/tool && mvn package```
5. Build the demo: ```cd rebar/demo && mvn package```
6. Start the server: ```java -jar target/rebar-demo-big-schedule.war```

About the debug version. You may find that it's hard to debug the js codes from the server deployed according to above steps. A debug profile provided in demo maven, you can trigger it by ```mvn package -Pdebug```, then start the debug server ```java -jar target-debug/rebar-demo-big-schedule.war```. You will find all source codes in developer tools. But there is another problem, you must run package command of maven when you changed a js file, it's inefficient. A script ```debug-server.sh``` is provided to start a web server using the js codes from original files instead of war file. You can refer to [generate-js-source.py](https://github.com/copperybean/rebar/blob/master/demo/src/main/python/generate-js-source.py) and [demo pom](https://github.com/copperybean/rebar/blob/master/demo/pom.xml) for more detail about how these are implemented.
