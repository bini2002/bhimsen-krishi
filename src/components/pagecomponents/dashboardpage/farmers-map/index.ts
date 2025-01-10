import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./FarmerDistributionMap"), {
  ssr: false,
});

export { MapComponent };
