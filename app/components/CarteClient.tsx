// @ts-nocheck
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

export default function CarteClient() {
  useEffect(() => {
    // Correction de l'icône par défaut de Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer center={[14.6928, -17.4467]} zoom={12} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={[14.6700, -17.4300]}>
        <Popup>
          <strong>Atelier Moussa</strong> <br /> Dakar Plateau <br /> ⭐ 4.8
        </Popup>
      </Marker>
      
      <Marker position={[14.7167, -17.4667]}>
        <Popup>
          <strong>Couture Fatou</strong> <br /> Yoff <br /> ⭐ 4.9
        </Popup>
      </Marker>
    </MapContainer>
  );
}