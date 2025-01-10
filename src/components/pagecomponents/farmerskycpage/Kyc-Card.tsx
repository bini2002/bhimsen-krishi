/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { IFarmerKyc } from "@/utils/interface";
import Image from "next/image";
import { BiCheckCircle } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";

interface KYCCardProps {
  kyc: IFarmerKyc;
  handleEdit: (kyc: IFarmerKyc) => void;
  handleDelete: (id: number) => void;
}

export default function KycCard({
  kyc,
  handleDelete,
  handleEdit,
}: KYCCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { fetchedData: imagesData } = useFetchData("/imageupload");

  const profilePictureUrl =
    imagesData?.data?.result?.find(
      (image: any) => image?.id === kyc?.profile?.picture
    )?.image || "";

  return (
    <div className="border border-gray-400 rounded overflow-hidden bg-white shadow-md">
      <div key={kyc.id} className="bg-gray-50 rounded-lg p-4">
        {/* Header Section with Logo and Badge */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="bg-green-200 text-green-700 text-xs font-bold uppercase p-2 px-4 rounded-full">
            किसान परिचय पत्र
          </div>
        </div>

        <hr className="mb-2 lg:mb-4" />

        {/* Farmer Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 lg:mb-8">
          <div className="flex flex-col">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span>{" "}
              {kyc.profile?.firstName || "N/A"} {kyc.profile?.lastName || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">ठेगाना:</span>{" "}
              {kyc.profile?.district || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">फोन नम्बर:</span>{" "}
              {kyc.profile?.phone || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">नागरिकता नम्बर:</span>{" "}
              {kyc.profile?.citizenshipNumber || "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {profilePictureUrl ? (
              <div className="w-full h-24 overflow-hidden flex md:justify-end ">
                <Image
                  className="object-cover w-32 h-full rounded"
                  src={`${baseUrl}/${profilePictureUrl}`}
                  alt="Profile Picture"
                  width={250}
                  height={250}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHZqj-XReJ2R76nji51cZl4ETk6-eHRmZBRw&s";
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-28 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Farm Related Details Section */}
          <div className="mb-4">
            <p className="text-gray-700">
              <span className="font-medium">पहिचान क्रमांक:</span> {kyc.id}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">क्षेत्रफल:</span>{" "}
              {kyc.area || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">उर्वर माटो:</span>{" "}
              {kyc.fertileSoil || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">उर्वर नभएको माटो:</span>{" "}
              {kyc.unfertileSoil || "N/A"}
            </p>
          </div>

          <div className="">
            <StatusLabel label="किरायामा छ" condition={kyc.isOnLease} />
            <StatusLabel label="सडक पहुँच छ" condition={kyc.hasRoadAccess} />
            <StatusLabel label="टनेल खेती छ" condition={kyc.hasTunnelFarming} />
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <button
            className="flex items-center bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            onClick={() => handleEdit(kyc)}
          >
            <FaRegEdit className="h-4 w-4 mr-1" aria-hidden="true" />
          </button>
          <button
            className="flex items-center bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
            onClick={() => handleDelete(kyc.id)}
          >
            <FaTrashCan className="h-4 w-4 mr-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

const StatusLabel = ({
  label,
  condition,
}: {
  label: string;
  condition: boolean;
}) => (
  <div className="flex items-center mb-1">
    <span className="font-medium mr-2">{label}:</span>
    {condition ? (
      <BiCheckCircle className="text-green-600 inline" />
    ) : (
      <IoCloseCircle className="text-red-600 inline" />
    )}
  </div>
);
