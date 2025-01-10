// EditCostSheet.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { axiosInstance } from "@/utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchData from "@/hook/useFetchData";

interface ProductionDetails {
  mainProduction: number;
  sellingPrice: number;
  gradualCropProduction: number;
  gradualCropSalePrice: number;
}

enum DataType {
  FIXED_CAPITAL = "fixed-capital",
  WORKING_CAPITAL = "working-capital",
  FIXED_COST = "fixed-cost",
  WORKING_COST = "working-cost",
  PROFIT_LOSS = "profit-loss",
}

interface FormData {
  title: string;
  commodity: number;
  data: {
    sn: number;
    type: string;
    name: string;
    unitType: string;
    quantity: number;
    rate: number;
  }[];
  productionDetails: ProductionDetails;
}

interface EditCostSheetProps {
  costSheetData: FormData;
}

const EditCostSheet: React.FC<EditCostSheetProps> = ({ costSheetData }) => {
  const router = useRouter();
  const { fetchedData: commodityData } = useFetchData("/business-commodity");
  const commodities = commodityData?.data?.data;

  const [formData, setFormData] = useState<FormData>(costSheetData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: keyof FormData["data"][0],
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name in formData.productionDetails) {
      setFormData((prev) => ({
        ...prev,
        productionDetails: {
          ...prev.productionDetails,
          [name]: parseFloat(value) || 0,
        },
      }));
    } else if (section !== undefined && index !== undefined) {
      setFormData((prev) => {
        const newData = [...prev.data];
        newData[index] = {
          ...newData[index],
          [section]:
            section === "quantity" || section === "rate"
              ? parseFloat(value) || 0
              : value,
        };
        return { ...prev, data: newData };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "commodity" ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          sn: prev.data.length + 1,
          type: "",
          name: "",
          unitType: "",
          quantity: 0,
          rate: 0,
        },
      ],
    }));
  };

  const handleRemoveRow = (index: number) => {
    setFormData((prev) => {
      const newData = [...prev.data];
      newData.splice(index, 1);
      return { ...prev, data: newData };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosInstance.patch(`/cost-sheet/${formData.commodity}`, formData);
      toast.success("Cost sheet updated successfully!");
      router.push("/cost-sheets");
    } catch (error) {
      toast.error("Error updating the cost sheet. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 border border-gray-300 shadow-sm rounded-md mt-6">
      <h1 className="lg:text-xl text-gray-800">
        लागत तालिका सम्पादन गर्नुहोस् (Edit Cost Sheet)
      </h1>
      <hr className="my-2 lg:my-4" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm text-gray-700">
              शीर्षक (Title)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="commodity" className="block text-sm text-gray-700">
              वस्तु (Commodity)
            </label>
            <select
              id="commodity"
              name="commodity"
              value={formData.commodity}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
              required
            >
              <option value="">वस्तु चयन गर्नुहोस् (Select Commodity)</option>
              {commodities?.map((commodity: any) => (
                <option key={commodity.id} value={commodity.id}>
                  {commodity.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* उत्पादन विवरण अनुभाग */}
        <h2 className="text-xl text-gray-800 border-b border-gray-300 pb-2 mt-8">
          उत्पादन विवरण (Production Details)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label
              htmlFor="mainProduction"
              className="block text-sm text-gray-700"
            >
              मुख्य उत्पादन (Main Production)
            </label>
            <input
              type="number"
              id="mainProduction"
              name="mainProduction"
              value={formData.productionDetails.mainProduction}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="sellingPrice"
              className="block text-sm text-gray-700"
            >
              बिक्री मूल्य (Selling Price)
            </label>
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              value={formData.productionDetails.sellingPrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="gradualCropProduction"
              className="block text-sm text-gray-700"
            >
              क्रमिक फसल उत्पादन (Gradual Crop Production)
            </label>
            <input
              type="number"
              id="gradualCropProduction"
              name="gradualCropProduction"
              value={formData.productionDetails.gradualCropProduction}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="gradualCropSalePrice"
              className="block text-sm text-gray-700"
            >
              क्रमिक फसल बिक्री मूल्य (Gradual Crop Sale Price)
            </label>
            <input
              type="number"
              id="gradualCropSalePrice"
              name="gradualCropSalePrice"
              value={formData.productionDetails.gradualCropSalePrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
              required
            />
          </div>
        </div>

        <h2 className="text-xl text-gray-800 border-b border-gray-300 pb-2 mt-8">
          डेटा (Data)
        </h2>
        {formData.data.map((item, index) => (
          <div key={index} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Serial Number (sn) */}
              <div>
                <label
                  htmlFor={`sn-${index}`}
                  className="block text-sm text-gray-700"
                >
                  श्रेणी संख्या (Serial Number)
                </label>
                <input
                  type="number"
                  id={`sn-${index}`}
                  name="sn"
                  value={item.sn}
                  onChange={(e) => handleChange(e, "sn", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                  required
                />
              </div>
              {/* Type */}
              <div>
                <label
                  htmlFor={`type-${index}`}
                  className="block text-sm text-gray-700"
                >
                  प्रकार (Type)
                </label>
                <select
                  value={item.type}
                  onChange={(e) => handleChange(e, "type", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                >
                  <option value="">छान्नुहोस् (Select)</option>
                  {Object.values(DataType).map((dataType) => (
                    <option key={dataType} value={dataType}>
                      {dataType
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              {/* Name */}
              <div>
                <label
                  htmlFor={`name-${index}`}
                  className="block text-sm text-gray-700"
                >
                  नाम (Name)
                </label>
                <input
                  type="text"
                  id={`name-${index}`}
                  name="name"
                  value={item.name}
                  onChange={(e) => handleChange(e, "name", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                  required
                />
              </div>
              {/* Unit Type */}
              <div>
                <label
                  htmlFor={`unitType-${index}`}
                  className="block text-sm text-gray-700"
                >
                  एकाई प्रकार (Unit Type)
                </label>
                <input
                  type="text"
                  id={`unitType-${index}`}
                  name="unitType"
                  value={item.unitType}
                  onChange={(e) => handleChange(e, "unitType", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                  required
                />
              </div>
              {/* Quantity */}
              <div>
                <label
                  htmlFor={`quantity-${index}`}
                  className="block text-sm text-gray-700"
                >
                  मात्रता (Quantity)
                </label>
                <input
                  type="number"
                  id={`quantity-${index}`}
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, "quantity", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                  required
                />
              </div>
              {/* Rate */}
              <div>
                <label
                  htmlFor={`rate-${index}`}
                  className="block text-sm text-gray-700"
                >
                  दर (Rate)
                </label>
                <input
                  type="number"
                  id={`rate-${index}`}
                  name="rate"
                  value={item.rate}
                  onChange={(e) => handleChange(e, "rate", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-2 text-red-600 bg-red-100 border rounded p-2"
              onClick={() => handleRemoveRow(index)}
            >
              पंक्ति हटाउनुहोस् (Remove Row)
            </button>
          </div>
        ))}
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={handleAddRow}
            className=" bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            नयाँ पंक्ति थप्नुहोस् (Add New Row)
          </button>
          <button
            type="submit"
            className=" #6d4c41 text-white px-4 py-2 rounded-md"
          >
            अद्यावधिक गर्नुहोस् (Update)
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditCostSheet;
