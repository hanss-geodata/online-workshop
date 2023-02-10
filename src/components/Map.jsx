import React, { useRef, useEffect, useContext, useState } from "react";

import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";
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
      // Det første vi trenger er et Map objekt med bakgrunnskart
      // Konstruktøren er allerede i koden, men vi må velge bakgrunnskartet
      // En liste med valg inner vi i API dokumentasjonen:
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
      const map = new Map({
        basemap: "",
      });

      // Vi ønsker så å hente data som vi kan legge til i kartet.
      // På følgende tjeneste finner dere punkter som viser en rekke turistattraksjoner i Europa:
      // Url: https://services-eu1.arcgis.com/zci5bUiJ8olAal7N/arcgis/rest/services/OSM_Tourism_EU/FeatureServer/0
      // Se dokumentasjonssiden for et eksempel: https://developers.arcgis.com/javascript/latest/add-a-feature-layer/

      // Om man ønsker å ha en popup når man trykker på punktene i FeatureLayeret trenger man også å legge
      // inn en popup template i featurelayeret. Denne har vi ferdig definert her.
      const popUpTemplate = new PopupTemplate({
        title: "{name}",
        content: [{
          type: "text",
          text: `<p>Type: {tourism}</p><p>{description}</p>`
        }]
      });

      // TODO: Hente data
      // TODO: Legge til data i kartet
      // TODO: Legg til data i context

      // For å kunne vise kartet må dette legges til i et MapView
      // Dokumentasjonen for MapView finnes her:
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html

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
        setLoaded(true)
        mapView.constraints = {
          minZoom: 2,
          geometry: boundary
        };
        // Når kartet er initialisert kan vi manipulere data her

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
