
module("Popcorn");
test("API", function () {
  
  var expects = 3, 
      count = 0;
  
  expect(expects);
  
  function plus(){ if ( ++count == expects ) start(); }

  stop();

  
  try {
    
    ok( Popcorn, "Popcorn exists");
    plus();
    
  } catch (e) {};
    
  
  try {
    
    ok( typeof Popcorn === "function", "Popcorn is a function");
    plus();
    
  } catch (e) {};
  
  try {  
    
    equals( Setup.getGlobalSize(), Setup.globalSize + 1 , "Popcorn API creates only 1 global reference");
    plus();
    
  } catch (e) {};

  
});

test("Utility", function () {
  
  //  TODO: comprehensive tests for these utilities
  
  equals( typeof Popcorn.forEach, "function" , "Popcorn.forEach is a provided utility function");
  equals( typeof Popcorn.extend, "function" , "Popcorn.extend is a provided utility function");
  equals( typeof Popcorn.guid, "function" , "Popcorn.guid is a provided utility function");
  equals( typeof Popcorn.sizeOf, "function" , "Popcorn.sizeOf is a provided utility function");
  equals( typeof Popcorn.nop, "function" , "Popcorn.nop is a provided utility function");

});


test("Object", function () {

  
  var popped = Popcorn("#video"), 
      methods = "load play pause currentTime mute volume";
  
  
  popped.play();

  methods.split(/\s+/g).forEach(function (k,v) {

    ok( k in popped, "instance has method: " + k );

  });

  ok( "video" in popped, "instance has `video` property" );
  ok( Object.prototype.toString.call(popped.video) === "[object HTMLVideoElement]", "video property is a HTMLVideoElement" );

  ok( "data" in popped, "instance has `data` property" );
  ok( Object.prototype.toString.call(popped.data) === "[object Object]", "data property is an object" );

  ok( "tracks" in popped.data, "instance has `tracks` property" );
  ok( Object.prototype.toString.call(popped.data.tracks) === "[object Array]", "tracks property is an array" )
  
});

module("Popcorn Events");

test("Stored By Type", function () {
  
  QUnit.reset();
  
  expect(6)
  
  var p = Popcorn("#video"), 
      count = 0,
      fired = 0, 
      wants = 4
      ;

  function plus(){ 

    if ( ++count == 4 ) {
      
      equals( fired, wants, "Number of callbacks fired from 1 handler" );

      p.unlisten("play");
  
      ok( !p.data.events["play"], "play handlers removed" );
  
      start();
    } 
  }

  stop();  
  
  
  p.listen("play", function () {
    fired++;
    
    ok(true, "Play fired " + fired);
    plus();
  });
      
  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);    
    plus();
  });

  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);    
    plus();
  });

  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);
    plus();
  });
  
  p.trigger("play");
  
  p.unlisten("play");
  
});


test("Simulated", function () {
  
  QUnit.reset();
  
  var p = Popcorn("#video"),
      completed = [];

  
  var expects = Setup.events.length, 
      count = 0;

  expect(expects);
  
  function plus(){ 
    if ( ++count == expects ) start(); 
  }
  
  stop();  
  
  
  Setup.events.forEach(function ( name ) {
    p.listen( name, function (event) {
      
      if ( completed.indexOf(name) === -1 ) {
        ok(true, name + " fired");
        plus();
        
        completed.push(name);
      }
      
      
    });  
  });

  Setup.events.forEach(function ( name ) {
    p.trigger( name );  
  });
  
  
});


test("Real", function () {
  
  QUnit.reset();

  var p = Popcorn("#video"),
      completed = [];                              
  
  
  var expects = 10, 
      count = 0;


  function plus(){ 
    if ( ++count == expects ) start(); 
  }
  
  stop();  
  
  
  Setup.events.forEach(function ( name ) {
    
    p.listen( name, function (event) {
    
      if ( completed.indexOf(name) === -1 ) {
        ok(true, name + " fired");
        plus();
        
        completed.push(name);
      }
      
      
    });  
  });


  
  p.pause();
  
  p.mute(true);
  
  p.play();
  
  p.volume(0.9);
  
  p.currentTime(49);

  
  
});

test("Custom", function () {

  var expects = 1, 
      count = 0;
  
  expect(expects);
  
  function plus(){ if ( ++count == expects ) start(); }

  stop();
  
  var p = Popcorn("#video");
  
  
  p.listen("eventz0rz", function ( event ) {
  
    ok( true, "Custom event fired" );
    plus();

  });
  
  p.trigger("eventz0rz");

  
  
});


test("UI/Mouse", function () {

  var expects = 1, 
      count = 0;
  
  expect(expects);
  
  function plus(){ if ( ++count == expects ) start(); }

  stop();
  
  var p = Popcorn("#video");
  
  
  p.listen("click", function ( event ) {
  
    ok( true, "click event fired" );
    plus();

  });
  
  p.trigger("click");

  
  
});

module("Popcorn Plugin")
test("Plugin API", function () {
  
  QUnit.reset();
  
  // needs expectation

  var popped = Popcorn("#video"), 
      methods = "load play pause currentTime mute volume";
      
  
  stop();
  
  
  Popcorn.plugin("subtitles", function () {
    
    var self = this;
    
    // These ensure that a popcorn instance is the value of `this` inside a plugin definition
    
    methods.split(/\s+/g).forEach(function (k,v) {
      ok( k in self, "instance has method: " + k );
    });

    ok( "video" in this, "instance has `video` property" );
    ok( Object.prototype.toString.call(popped.video) === "[object HTMLVideoElement]", "video property is a HTMLVideoElement" );

    ok( "data" in this, "instance has `data` property" );
    ok( Object.prototype.toString.call(popped.data) === "[object Object]", "data property is an object" );

    ok( "tracks" in this.data, "instance has `tracks` property" );
    ok( Object.prototype.toString.call(popped.data.tracks) === "[object Array]", "tracks property is an array" )
  });
  
  
  //  Call plugin to test scope within 
  popped.subtitles();
  
  
  
  ok( "subtitles" in popped, "subtitles plugin is now available to instance" );
  ok( Popcorn.registry.length === 1, "One item in the registry");
  
  
  
  
  
  Popcorn.plugin("complicator", {
    
    start: function ( event ) {
      
      
      equals( ~~this.currentTime(), 1, "~~this.currentTime() === 1");
      
      var self = this;

      // These ensure that a popcorn instance is the value of `this` inside a plugin definition

      methods.split(/\s+/g).forEach(function (k,v) {
        ok( k in self, "instance has method: " + k );
      });

      ok( "video" in this, "instance has `video` property" );
      ok( Object.prototype.toString.call(popped.video) === "[object HTMLVideoElement]", "video property is a HTMLVideoElement" );

      ok( "data" in this, "instance has `data` property" );
      ok( Object.prototype.toString.call(popped.data) === "[object Object]", "data property is an object" );

      ok( "tracks" in this.data, "instance has `tracks` property" );
      ok( Object.prototype.toString.call(popped.data.tracks) === "[object Array]", "tracks property is an array" )      
      
    },
    end: function () {
    
      //start();
    
    }, 
    timeupdate: function () {
    }    
  });
  
  
  ok( "complicator" in popped, "complicator plugin is now available to instance" );
  ok( Popcorn.registry.length === 2, "Two items in the registry");
  
  
  
  popped.currentTime(0);
  
  popped.complicator({
    start: 1, 
    end: 2
  });  
  
  
  var breaker = {
    
    start: 0, 
    end: 0
    
  };

  Popcorn.plugin("breaker", {
    
    start: function () {
      
      breaker.start++;
    
      ok(true, "plugin:breaker started");
    },
    end: function () {
      
      breaker.end++;
    
      ok(true, "plugin:ended started");
      start();
      
      equals( 1, breaker.start, "plugin start method fires only once");
      equals( 1, breaker.end, "plugin end method fires only once");
    } 
  });

  
  
  popped.currentTime(0);
  
  popped.breaker({
    start: 1, 
    end: 2
  });    
});






test("Events Extended", function () {
  
  //QUnit.reset();
  
  // needs expectation

  var popped = Popcorn("#video"), 
      expects = 11, 
      count = 0;

  //expect(expects);
  // not in full use
  function plus(){ 
    if ( ++count == expects ) start(); 
  }
  
  stop();  
  
  
  Popcorn.plugin("extendedEvents", (function () {
  

    var pluginObj = {

      start: function() {

      },
      end: function() {

      }
    };
    
    $.each( Setup.events, function ( k, type ) {
      
      pluginObj[type]  = function (event, opts) {
        ok( true, type + " fired!" );
        
        plus();
      };
    
    });
    
    return pluginObj;
    
  })());
  
  
  
  
  popped.extendedEvents({
    
    start: 20,
    end: 21
    
  });
  
  
  popped.currentTime(19).play();
  
  
});


/*
module("Popcorn Video Object")
test("wait()", function () {
  
  //QUnit.reset();
  
  // needs expectation

  var popped = Popcorn("#video"), 
      startat = +new Date();


  
  
  popped.play().wait(2).exec(function () {
    
    console.log( +new Date() - startat );
    
    ok(true)
    
  }).pause();
  
  
});
*/