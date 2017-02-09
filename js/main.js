//declaring a set of hardcoded locations
var locations = [
            {
                title: 'Amanora Town Centre',
                location: {
                    lat: 18.518642,
                    lng: 73.935024
                }
            },
            {
                title: 'Phoenix Market City',
                location: {
                    lat: 18.561958,
                    lng: 73.916926
                }
            },
            {
                title: 'A B C Farms',
                location: {
                    lat: 18.539421,
                    lng: 73.904975
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
                title: 'Sinhagadh Fort',
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
        zoom: 12
    });
    pushMarkers();
}

//function to display error in case the map is not loaded
function loadError() {
    alert("Sorry, could not load the Map!");
}

//function for markers
//var markers = [];
function pushMarkers() {
        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i].location;
            var title = locations[i].title;
            var marker = new google.maps.Marker({
                position: loc,
                title: title,
                animation: google.maps.Animation.DROP,
                map:map,
                id:i
            });
            console.log(locations[i].title);
            //markers.push(marker); //to push individual (i'th) marker on the map
            locInfo = new google.maps.InfoWindow();
            console.log('New InfoWindow Created');
            marker.addListener('click', function() {
                console.log('InfoWindow Loop entered');
                populateInfoWindow(this, locInfo);
            });
        }
    }

//function to populate info window of each marker
function populateInfoWindow(marker,locInfo) {
    locInfo.marker = marker;
    if (locInfo.marker != marker) {
        locInfo.marker = marker;
        locInfo.setContent('<div>' + marker.title + '<div>');
        locInfo.open(map, marker);
        locInfo.addListener('closeclick', function() {
            locInfo.marker = null;
        });
    }
}

