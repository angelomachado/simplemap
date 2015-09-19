(function ( $ ) {
 $.fn.SimpleMap = function( options ) {
   "use strict"
   var canvas = document.getElementById(this.selector.replace('#',''));
   var map;
   var markers = [];
   var options = $.extend( {}, $.fn.SimpleMap.defaults, options );
   function initialize() {
     //Creates a map with the given options
     if (options.lat!=undefined && options.lng!=undefined){
       var location = new google.maps.LatLng(options.lat, options.lng);
       var mapOptions = {
         zoom: options.zoom,
         center: location,
         mapTypeId: google.maps.MapTypeId.TERRAIN
       };
       map = new google.maps.Map(canvas,mapOptions);
       //When the user clicks on the map
       google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng);
       });      
     }else {
       //Can't find the coords
       geoLocate();
     }       
   };
   //where are u?
   function geoLocate(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
      function(position){
        var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          zoom: options.zoom,
          center: location,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        map = new google.maps.Map(canvas,mapOptions);
        //When the user clicks on the map
        google.maps.event.addListener(map, 'click', function(event) {
          addMarker(event.latLng);
        });            
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

  // Add a marker to the map and push to the array.
  function addMarker(location) {
    if (((options.maxMarkers > markers.length)||(options.maxMarkers=="unlimited"))
          &&!options.blockMarkers){
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
      markers.push(marker);
      //Open info window?
      if (options.infoWindow){
        var infoWindowContent = {};
        if (options.infoWindow.title!=undefined)
          infoWindowContent.title = options.infoWindow.title;
        if (options.infoWindow.content!=undefined)
          infoWindowContent.content=options.infoWindow.content;
        var infowindow = new google.maps.InfoWindow(infoWindowContent);        
        //binds the marker click
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });       
      }
      //call the afterAddmarker function if passed
      if (typeof options.afterAddMarker=="function"){
        options.afterAddMarker(marker);
      }
    }  
  };
  // Sets the map on all markers in the array.
  function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setAllMap(null);
  };

  // Shows any markers currently in the array.
  function showMarkers() {
    setAllMap(map);
  };

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  };

  //Public access
  $.fn.SimpleMap.deleteMarkers = deleteMarkers;
  $.fn.SimpleMap.clearMarkers = clearMarkers;
  $.fn.SimpleMap.showMarkers = showMarkers;

  //Let's go!
  google.maps.event.addDomListener(window, 'load', initialize);
  return $.fn.SimpleMap;
};

//I'm helping you with this options
$.fn.SimpleMap.defaults = {
  maxMarkers : "unlimited", //markers max number permitted
  blockMarkers : false, //do we block adding markers?
  infoWindow : false, //do we use infowindow?
  zoom : 12, //initial zoom
  afterAddMarker : false //execute some code after add marker
};

}( jQuery, window, document ));