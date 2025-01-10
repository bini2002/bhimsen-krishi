import { IAgroFirmKyc } from "@/utils/interface";
import Image from "next/image";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

interface AgroFirmCardProps {
  kyc: IAgroFirmKyc;
  handleEdit: (kyc: IAgroFirmKyc) => void;
  handleDelete: (id: number) => void;
}

export default function AgroFirmCard({
  kyc,
  handleEdit,
  handleDelete,
}: AgroFirmCardProps) {
  return (
    <div className="border border-gray-300 rounded overflow-hidden bg-white ">
      <div key={kyc.id} className="bg-gray-50 rounded-lg p-4">
        {/* Header with Firm Name and Badge */}
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
            कृषि फर्म परिचय पत्र
          </div>
        </div>

        <hr className="mb-2 lg:mb-4" />

        {/* Firm Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 lg:mb-8">
          <div className="flex flex-col">
            <p className="text-gray-700">
              <span className="font-medium">फर्मको नाम:</span> {kyc.firmName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">वडा:</span> {kyc.ward}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">ठेगाना:</span> {kyc.address}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">प्यान नम्बर:</span> {kyc.pan}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">फर्म प्रकार:</span> {kyc.type}
            </p>
          </div>

          <div className="w-full h-full overflow-hidden">
            {kyc?.images && kyc.images.length > 0 && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${kyc?.images?.[0]?.image}`}
                alt="Image"
                className="w-full h-auto rounded shadow object-cover"
                width={500}
                height={500}
              />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Financial Details */}
          <div className="mb-4">
            <p className="text-gray-700">
              <span className="font-medium">वार्षिक लगानी:</span> रु{" "}
              {kyc.annualInvestment}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">वार्षिक कारोबार:</span> रु{" "}
              {kyc.annualTransaction}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">व्यक्तिगत खर्च:</span> रु{" "}
              {kyc.personalExpenses}
            </p>
          </div>

          {/* Employee and Sales Details */}
          <div>
            <p className="text-gray-700">
              <span className="font-medium">पूर्णकालीन कर्मचारी:</span>{" "}
              {kyc.fullTimeEmpoloyees}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">अंशकालिक कर्मचारी:</span>{" "}
              {kyc.parTimeEmployees}
            </p>
            <div className="text-gray-700">
              <span className="font-medium">बिक्रि गरिने स्थान:</span>{" "}
              {kyc.whomeTheySell.join(", ") || "N/A"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            <FaTrashAlt className="h-4 w-4 mr-1" aria-hidden="true" />
          </button>
        </div>

        {/* Images Section */}
        {/* {kyc?.images && kyc.images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-800 font-bold">तस्बिरहरू</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {kyc.images.map((image) => (
                <Image
                  key={image.id}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
                  alt="Image"
                  className="w-full h-24 rounded shadow object-cover"
                  width={500}
                  height={500}
                />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
