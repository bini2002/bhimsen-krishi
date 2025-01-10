import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Feature as GeoJSONFeature, Geometry } from "geojson";

type ProvinceData = {
  province: string;
  farmerCount: number;
};

type FeatureProperties = {
  ADM1_EN: string;
};

const provinceNameMapping: Record<string, string> = {
  "1": "कोशी प्रदेश",
  "2": "मधेश प्रदेश",
  "3": "बागमती प्रदेश",
  "4": "गण्डकी प्रदेश",
  "5": "लुम्बिनी प्रदेश",
  "6": "कर्णाली प्रदेश",
  "7": "सुदूरपश्चिम प्रदेश",
};

const provinceColors: Record<string, string> = {
  "कोशी प्रदेश": "#FF5733",
  "मधेश प्रदेश": "#33FF57",
  "बागमती प्रदेश": "#3357FF",
  "गण्डकी प्रदेश": "#FF33A6",
  "लुम्बिनी प्रदेश": "#A633FF",
  "कर्णाली प्रदेश": "#33FFF5",
  "सुदूरपश्चिम प्रदेश": "#F5FF33",
};

const farmerData: ProvinceData[] = [
  { province: "कोशी प्रदेश", farmerCount: 1200 },
  { province: "मधेश प्रदेश", farmerCount: 2500 },
  { province: "बागमती प्रदेश", farmerCount: 4300 },
  { province: "गण्डकी प्रदेश", farmerCount: 3100 },
  { province: "लुम्बिनी प्रदेश", farmerCount: 1900 },
  { province: "कर्णाली प्रदेश", farmerCount: 850 },
  { province: "सुदूरपश्चिम प्रदेश", farmerCount: 600 },
];

const NepalMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchGeoJson = async () => {
      try {
        const response = await axios.get("/geojson.json");
        setGeoJsonData(response.data);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    fetchGeoJson();
  }, []);

  const getProvinceStyle = (
    feature: GeoJSONFeature<Geometry, FeatureProperties> | undefined
  ) => {
    if (!feature || !feature.properties) return {};

    const provinceNumber = feature.properties.ADM1_EN;
    const provinceName = provinceNameMapping[provinceNumber] || "Unknown";
    const fillColor = provinceColors[provinceName] || "#FFFFFF";

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: "gray",
      fillOpacity: 0.5,
    };
  };

  return (
    <section className="p-4 bg-white border rounded">
      <h1 className="lg:text-lg mb-4 font-medium">किसान वितरण नक्सा</h1>

      {isClient && (
        <MapContainer
          center={[28.3949, 84.124]}
          zoom={7}
          style={{ maxHeight: "500px", height: "500px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={getProvinceStyle}
              onEachFeature={(feature, layer) => {
                const provinceNumber = feature?.properties?.ADM1_EN;
                const provinceName =
                  provinceNameMapping[provinceNumber] || "Unknown";
                const farmerCount =
                  farmerData.find((item) => item.province === provinceName)
                    ?.farmerCount || 0;

                layer.bindTooltip(
                  `<div style="
                            background-color: #e6f4ea;
                            border-radius: 8px;
                            padding: 6px 10px;
                            text-align: center;
                            font-size: 14px;
                            color: #333;
                            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
                          ">
                          <strong style="display: block; font-size: 15px; color: #2f855a;">${provinceName}</strong>
                          <span style="display: block; font-size: 13px;">किसान संख्या: ${farmerCount}</span>
                        </div>`,
                  { direction: "top", sticky: true }
                );
              }}
            />
          )}
        </MapContainer>
      )}
    </section>
  );
};

export default NepalMap;
