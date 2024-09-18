import React, { useLayoutEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

const ActiveUsersByRegion = () => {
    useLayoutEffect(() => {
        // Create map instance
        var chart2 = am4core.create("anim_map_2", am4maps.MapChart);

        // Set map definition
        chart2.geodata = am4geodata_worldLow;

        // Set projection
        chart2.projection = new am4maps.projections.Miller();

        // Create map polygon series
        var polygonSeries = chart2.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.mapPolygons.template.fill = am4core.color("#E6E9EB");
        polygonSeries.mapPolygons.template.fillOpacity = 1;
        // Exclude Antartica
        polygonSeries.exclude = ["AQ"];

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";


        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#CCE5E7");

        // Add image series
        var imageSeries = chart2.series.push(new am4maps.MapImageSeries());
        imageSeries.mapImages.template.propertyFields.longitude = "longitude";
        imageSeries.mapImages.template.propertyFields.latitude = "latitude";
        imageSeries.mapImages.template.tooltipText = "{title}";
        imageSeries.mapImages.template.propertyFields.url = "url";

        var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle.radius = 3;
        circle.propertyFields.fill = "color";

        var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle2.radius = 3;
        circle2.propertyFields.fill = "color";


        circle2.events.on("inited", function (event) {
            animateBullet(event.target);
        })


        function animateBullet(circle) {
            var animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
            animation.events.on("animationended", function (event) {
                animateBullet(event.target.object);
            })
        }

        // var colorSet = new am4core.ColorSet();

        imageSeries.data = [{
            "title": "Brussels",
            "latitude": 50.8371,
            "longitude": 4.3676,
            "color": '#007D88'
        }, {
            "title": "Copenhagen",
            "latitude": 55.6763,
            "longitude": 12.5681,
            "color": '#007D88'
        }, {
            "title": "Paris",
            "latitude": 48.8567,
            "longitude": 2.3510,
            "color": '#007D88'
        }, {
            "title": "Reykjavik",
            "latitude": 64.1353,
            "longitude": -21.8952,
            "color": '#007D88'
        }, {
            "title": "Moscow",
            "latitude": 55.7558,
            "longitude": 37.6176,
            "color": '#007D88'
        }, {
            "title": "Madrid",
            "latitude": 40.4167,
            "longitude": -3.7033,
            "color": '#007D88'
        }, {
            "title": "London",
            "latitude": 51.5002,
            "longitude": -0.1262,
            "url": "http://www.google.co.uk",
            "color": '#007D88'
        }, {
            "title": "Peking",
            "latitude": 39.9056,
            "longitude": 116.3958,
            "color": '#007D88'
        }, {
            "title": "New Delhi",
            "latitude": 28.6353,
            "longitude": 77.2250,
            "color": '#007D88'
        }, {
            "title": "Tokyo",
            "latitude": 35.6785,
            "longitude": 139.6823,
            "url": "http://www.google.co.jp",
            "color": '#007D88'
        }, {
            "title": "Ankara",
            "latitude": 39.9439,
            "longitude": 32.8560,
            "color": '#007D88'
        }, {
            "title": "Buenos Aires",
            "latitude": -34.6118,
            "longitude": -58.4173,
            "color": '#007D88'
        }, {
            "title": "Brasilia",
            "latitude": -15.7801,
            "longitude": -47.9292,
            "color": '#007D88'
        }, {
            "title": "Ottawa",
            "latitude": 45.4235,
            "longitude": -75.6979,
            "color": '#007D88'
        }, {
            "title": "Washington",
            "latitude": 38.8921,
            "longitude": -77.0241,
            "color": '#007D88'
        }, {
            "title": "Kinshasa",
            "latitude": -4.3369,
            "longitude": 15.3271,
            "color": '#007D88'
        }, {
            "title": "Cairo",
            "latitude": 30.0571,
            "longitude": 31.2272,
            "color": '#007D88'
        }, {
            "title": "Pretoria",
            "latitude": -25.7463,
            "longitude": 28.1876,
            "color": '#007D88'
        }];
    }, [])
    return (
        <>
            <div id="anim_map_2" style={{ width: "100%", height: "300px" }}></div>
        </>
    )
}

export default ActiveUsersByRegion;
