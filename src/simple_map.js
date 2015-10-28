/*
  Angelo D. Machado - 2015
  https://github.com/geloh
  The MIT License (MIT)
  Copyright (c) 2015 Angelo Machado
*/

(function($) {
  'use strict';
  //Some default options
  var defaults = {
    maxMarkers : "unlimited", //markers max number permitted
    blockMarkers : false, //do we block adding markers?
    infoWindow : false, //do we use infowindow?
    zoom : 12, //initial zoom
    afterAddMarker : false //execute some code after add marker
  };
  //allow public access
  var public_methods = {
    addMarkers : addMarkers,
    hideMarkers : hideMarkers,
    showMarkers : showMarkers,
    deleteMarkers : deleteMarkers
  };
  //Array of map instances
  var maps = [];
  $.fn.SimpleMap = function() {
    //Calling the public methods
    if (typeof arguments[0] === 'string') {
      var method = Array.prototype.slice.call(arguments);
      method.splice(0, 1);
      public_methods[arguments[0]].apply(this, method);
    }
    else {
      var s = this.selector;
      //current map instance
      maps[s] = {};
      maps[s].markers = [];
      maps[s].options = $.extend( {}, defaults, arguments[0] );
      maps[s].canvas = document.getElementById(this.selector.replace('#',''));
      //Initializing the map
        var mapOptions = {
          zoom: maps[this.selector].options.zoom,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
      maps[s].map = new google.maps.Map(maps[s].canvas,mapOptions);
      maps[s].map.addListener('click', function(e) {
        addMarker(e.latLng,s);
      });
      initialize.apply(this, arguments);
    }
    return this;
  };
  //Private methods
  function initialize(args){
    //Locating the coords
    var s = this.selector;
    if (maps[s].options.lat!=undefined && maps[s].options.lng!=undefined){
      var location = new google.maps.LatLng(maps[s].options.lat, maps[s].options.lng);
      maps[s].map.setCenter(location);
    }else {
      //Can't find the coords
      geoLocate.apply(this);
    }
  }
  //l = location; s = selector;
  function addMarker(l,s) {
    if (((maps[s].options.maxMarkers > maps[s].markers.length)||(maps[s].options.maxMarkers=="unlimited"))
        &&!maps[s].options.blockMarkers){
      var marker = new google.maps.Marker({
        position: l,
        map: maps[s].map
      });
      maps[s].markers.push(marker);
      //Open info window?
      if (maps[s].options.infoWindow){
        var iwc = {};//infoWindowContent
        if (maps[s].options.infoWindow.title!=undefined)
          iwc.title = maps[selector].options.infoWindow.title;
        if (maps[s].options.infoWindow.content!=undefined)
          iwc.content=maps[s].options.infoWindow.content;
        var infowindow = new google.maps.InfoWindow(iwc);
        //binds the marker click
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(maps[s].map,marker);
        });
      }
      //call the afterAddmarker function if passed
      if (typeof maps[s].options.afterAddMarker=="function"){
        maps[s].options.afterAddMarker(marker);
      }
    }
  };
  //adding markers via javascript
  function addMarkers(_markers) {
    var s = this.selector;
    $.each(_markers,function(index,marker){
      var m = new google.maps.Marker({
        position: {lat : marker.lat, lng : marker.lng },
        map: maps[s].map
      });
      maps[s].markers.push(m);
      //Open info window?
      if (marker.infoWindow){
        var infoWindowContent = {};
        if (marker.infoWindow.title!=undefined)
          infoWindowContent.title = marker.infoWindow.title;
        if (marker.infoWindow.content!=undefined)
          infoWindowContent.content=marker.infoWindow.content;
        var infowindow = new google.maps.InfoWindow(infoWindowContent);
        //binds the marker click
        google.maps.event.addListener(m, 'click', function() {
          infowindow.open(maps[s].map,m);
        });
      }
    });
    setMarkers(s,maps[s].map);
  };
  //where are u?
  function geoLocate(){
    var selector = this.selector;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          maps[selector].map.setCenter(location);
        }
      );
    }else{
      noGeoLocationSuported();
    }
  };
  function noGeoLocationSuported() {
    console.log("No geolocation supported!");
    console.log("Update your browser and ensure a better experience!");
  };
  // Sets the map on all markers in the array.
  //s = selector; v=value(map instance or null)
  function setMarkers(s,v) {
    for (var i = 0; i < maps[s].markers.length; i++) {
      maps[s].markers[i].setMap(v);
    }
  };
  // Removes the markers from the map, but keeps them in the array.
  function hideMarkers() {
    var s = this.selector;
    setMarkers(s,null);
  };
  // Shows any markers currently in the array.
  function showMarkers() {
    var s = this.selector;
    setMarkers(s,maps[s].map);
  };
  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    var s = this.selector;
    setMarkers(s,null);
    maps[s].markers = [];
  };
})(jQuery);
