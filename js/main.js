//declaring a set of hardcoded locations
var locations = [
            {
                title: 'Phoenix Market City, Pune',
                location: {
                    lat: 18.561958,
                    lng: 73.916926
                }
            },
            {
                title: 'Khadakwasla Dam',
                location: {
                    lat: 18.442294,
                    lng: 73.767091
                }
            },
            {
                title: 'Pashan Lake',
                location: {
                    lat: 18.534397,
                    lng: 73.785292
                }
            },
            {
                title: 'Lavale, Pune',
                location: {
                    lat: 18.516655,
                    lng: 73.73896
                }
            },
            {
                title: 'Shaniwar Wada',
                location: {
                    lat: 18.519565,
                    lng: 73.855386
                }
            },
            {
                title: 'Rajiv Gandhi Zoological Park',
                location: {
                    lat: 18.454267,
                    lng: 73.859848
                }
            },
            {
                title: 'Sinhagad Fort',
                location: {
                    lat: 18.366304,
                    lng: 73.755876
                }
            }
];

//initialize a map
var map, locInfo;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {//latlongs of approximate center
                lat: 18.474727,
                lng: 73.848164
        },
        zoom: 11
    });
    pushMarkers(); //to push individual marker on the map
}

//function to display error in case the map is not loaded
function loadError() {
    alert("Sorry, could not load the Map!");
}

//function for markers:
function pushMarkers() {
locInfo = new google.maps.InfoWindow();
    for (var i = 0; i < locations.length; i++) {
        var loc = locations[i].location;
        var title = locations[i].title;
        locations[i].marker = new google.maps.Marker({
            position: loc,
            title: title,
            animation: google.maps.Animation.DROP,
            map:map,
            id:i
        });
        console.log(locations[i].title);
        locations[i].marker.addListener('click', function() {
            console.log('InfoWindow Loop entered');
            toggleBounce(this);
            populateInfoWindow(this, locInfo);
        });
        wikiLink(locations[i].marker);
    }
}

function wikiLink(marker) {
    //AJAX request for Wikipedia link:
    //initializing a variable
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiReqTimeout = setTimeout(function(){
        alert("Failed to get Wikipedia resources");
    }, 8000);       //in case there are no resources found
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            if(response[3] === null) {
                alert("No Wikipedia results found!");
            }
            marker.url = response[3];       //to assign the value of the third inndex in the array of the searched wikipedia link items through the API
            clearTimeout(wikiReqTimeout);
        }
    });
}

//function to populate info window of each marker
function populateInfoWindow(marker,locInfo) {
    locInfo.marker = marker;
    if (marker.url !== undefined) {
        var heading = '<div><h2>' + marker.title + '</h2></div>';       //the name of the place displayed as the heading of the infoWindow
        var wikiString = '<hr><h4><a href = "' + marker.url + '">' + 'Wikipedia Link' + '</a></h4>';        //the wikipedia link of the corresponding place
        var streetViewString = '<img src ="https://maps.googleapis.com/maps/api/streetview?size=300x100&location=' + marker.title + '&key=AIzaSyAxD5mgFLhdkpdMY75kZGPpe7-luaa3Qso">';//the streetview of the corresponding place
        var infoString = heading + '<div>' + wikiString + '</div><div>' + streetViewString + '</div>';      //combining all the infoWindow matter into a single variable
        locInfo.setContent(infoString);
        console.log("InfoWindow code: " + infoString);
    }
    else {
        locInfo.setContent("No info available!");   //in case no wikipedia and streetview information is available
    }
    locInfo.open(map, marker);
    locInfo.addListener('closeclick', function() {
        marker.setAnimation(null);     // in case the marker has not stopped animating, do so on closing it
        locInfo.marker = null;      //set null as the info in infoWindow
    });
}

//function for toggling bounce animation on selected infoWindow:
function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(google.maps.Animation.null);
    }, 1500);   // this will animate a 'bouncing' effect on te marker for a second and a half
}

//code for toggling place list in mobile and tablet mode:
jQuery(function($) {
    $('.listBtn').click(function() {
        $('.placeList').toggleClass('expand');
        console.log("Search Button Clicked");
    });
});

//code for the viewModel:
var locationArray = [];
var viewModel = function() {

    var self = this;
    self.locationArray = ko.observableArray();      //initializing an observable array for the list of locations
    for (var i = 0; i < locations.length; i++) {
        self.locationArray.push(locations[i]);
    }

    self.query = ko.observable('');

    self.itemSelector = function(locations) {
        toggleBounce(locations.marker);
        new google.maps.event.trigger(locations.marker, "click");       //to select the corresponding marker on clicking the list item
    };
    self.searchedPlaces = ko.computed(function() {       //function for filtering places
        if (self.query()) {
            var placeFilter = self.query().toLowerCase();       //to enable the user to enter search in upper or lower case
            return ko.utils.arrayFilter(self.locationArray(), function(place) {
                var thisTitle = place.title.toLowerCase();
                var finalStringSet = thisTitle.indexOf(placeFilter);
                if (finalStringSet >= 0) {
                    place.marker.setVisible(true);
                }
                else {
                    place.marker.setVisible(false);
                }
                return place.title.toLowerCase().indexOf(placeFilter) > -1;
            });
        } else {
            self.locationArray().forEach(function(locations) {
                if (locations.marker) {
                    locations.marker.setVisible(true);      //this will display the markers
                }
            });
            return self.locationArray();
        }
    });
};
//apply bindings of the viewModel
ko.applyBindings(new viewModel());

