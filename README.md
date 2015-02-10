# defer-images

defers image loading until images are in the view, background loads more images when idle.
>> [Example here:](http://dperrymorrow.github.io/defer-images/examples/)

## Usage

Change your html so that it has a placeholder instead of the real image you wish to defer loading on.
Be sure to include width and height so that it will take up the space that it will eventually occupy.

```html
<img src="placeholder.gif" onload="defer.add(this);"
data-src="http://example.com/real-image.gif" width="100" height="50">
```

The load handler will register the image with the defer module.
This will trigger on the load of the placeholder image, and immediately begin determining if it is in the viewport.

Or if ```onload``` handlers are not your thing, add it directly with javascript on the page after its been added to the DOM.

```javascript
var img = document.getElementById([id]);
defer.add(img);
```

## Building and running the tests

Install grunt and karma cli so you can interact with them on the command line

```bash
$ npm install -g grunt-cli
$ npm install karma-cli -g
```

Next install required packages for defer-images

```bash
cd defer-images
$ npm install
```
Now you can run the test suite or build the project.

To build __(minifiy and create source map)__

```bash
$ grunt uglify
```

to jsLint the project
```bash
$ grunt
```

To run the tests
```bash
$ karma start
```

You will see output like the following
```
$ karma start
INFO [karma]: Karma v0.12.31 server started at http://localhost:9876/
INFO [launcher]: Starting browser PhantomJS
INFO [PhantomJS 1.9.8 (Mac OS X)]: Connected on socket nBbW5jL6-B08r6AV_5JA with id 96072712
PhantomJS 1.9.8 (Mac OS X): Executed 26 of 26 SUCCESS (0.011 secs / 0.008 secs)
```



