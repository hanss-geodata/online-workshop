import React, { useRef, useState, useEffect, useContext } from "react";

import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";
import Locate from "@arcgis/core/widgets/Locate";

import PopupTemplate from "@arcgis/core/PopupTemplate";

import cat from '../images/cat.gif';
import { boundary } from "../utils/setup";
import { AppContext } from "../state/context";
import "../App.css";

const MapComponent = () => {
  const context = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const mapDiv = useRef(null);
  // Required: Set this property to insure assets resolve correctly.
  esriConfig.assetsPath = "./assets";

  // Opprett kartet
  useEffect(() => {
    if (mapDiv.current) {
      const map = new Map({
        basemap: "gray-vector",
      });

      // Vi ønsker så å hente data som vi kan legge til i kartet. Til Dette trenger vi en FeatureLayer.
      // Dette FeatureLayeret trenger en dataset fra f.eks. en tjeneste.
      // På følgende tjeneste finner dere punkter som viser en rekke turistattraksjoner i Europa:
      // Url: https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0
      // Se dokumentasjonssiden for et eksempel: https://developers.arcgis.com/javascript/latest/add-a-feature-layer/

      // Om man ønsker å ha en popup når man trykker på punktene i FeatureLayeret trenger man også å legge
      // inn en popup template i Featurelayeret. Denne har vi ferdig definert her.
      const popUpTemplate = new PopupTemplate({
        title: "{name}",
        content: [{
          type: "text",
          text: `<p>Type: {tourism}</p><p>{description}</p>`
        }]
      });

      // Hent data
      const featureLayer = new FeatureLayer({
        url: "https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0",
        popupEnabled: true,
        popupTemplate: popUpTemplate,
        }
      );
      
      // Legg til dataen i kartet
      map.add(featureLayer);

      new MapView({
        map: map,
        container: mapDiv.current,
        extent: {
          ymin: 63.40182257265643,
          xmin: 10.227928161621094,
          ymax: 63.453731595863324,
          xmax: 10.560264587402344,
        },
      }).when((mapView) => {
        // Når kartet er initialisert kan vi manipulere data her
        setLoaded(true)
        mapView.constraints = {
          minZoom: 2,
          geometry: boundary
        };

        // Esri har mange widgets som er enkle å legge til i kartet
        // En av disse er locate widgeten, som flytter kartet til din posisjon
        // Widgeten må først opprettes, så plasseres på kartet
        // Dokumentasjon for dette er på:
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Locate.html
        // En god idé er å sette zoom nivået med scale attributten, f. eks scale 5000

        //TODO opprett Locate widget

        //TODO legg til vidget i MapViewet

      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    return <>
    { loaded ? "" : 
      <div className="notLoadedMapContainer">
        <img src={cat}/>
        <p>{"Klarte ikke å vise kartet :("}</p>
      </div>  }
    <div className="mapDiv" ref={mapDiv} />
  </>;
};

export default MapComponent;
