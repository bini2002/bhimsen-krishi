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

const AddCostSheet: React.FC = () => {
  const router = useRouter();

  const { fetchedData: commodityData } = useFetchData("/business-commodity");
  const commodities = commodityData?.data?.data;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    commodity: 0,
    data: [{ sn: 1, type: "", name: "", unitType: "", quantity: 0, rate: 0 }],
    productionDetails: {
      mainProduction: 0,
      sellingPrice: 0,
      gradualCropProduction: 0,
      gradualCropSalePrice: 0,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: keyof FormData["data"][0],
    index?: number
  ) => {
    const { name, value } = e.target;

    // Check if the change is for production details
    if (name in formData.productionDetails) {
      setFormData((prev) => ({
        ...prev,
        productionDetails: {
          ...prev.productionDetails,
          [name]: parseFloat(value) || 0, // Convert to number or default to 0
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
    setFormData((prevFormData) => {
      const newData = [...prevFormData.data];
      newData.splice(index, 1);
      return { ...prevFormData, data: newData };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare a set to track types entered in the form
    const enteredTypes = new Set(formData.data.map((item) => item.type));

    // Ensure all required types are present
    const requiredTypes = Object.values(DataType);
    const missingTypes = requiredTypes.filter(
      (type) => !enteredTypes.has(type)
    );

    if (missingTypes.length > 0) {
      toast.error(
        `कृपया सबै आवश्यक प्रकार भर्नुहोस्: ${missingTypes.join(", ")}` // Please fill in all required types
      );
      return;
    }

    try {
      await axiosInstance.post("/cost-sheet", formData);
      toast.success(
        "खर्च पत्र सफलतापूर्वक थपियो! (Cost sheet added successfully!)"
      );
      router.push("/cost-sheets");
    } catch (error) {
      toast.error(
        "फारम पेश गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्। (Error submitting the form. Please try again.)"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 border border-gray-300 shadow-sm rounded-md mt-6">
      <h1 className="lg:text-xl  text-gray-800 ">
        खर्च पत्र थप्नुहोस् (Add Cost Sheet)
      </h1>
      <hr className="my-2 lg:my-4" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Commodity */}
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
              <option value="">वस्तु छान्नुहोस् (Select Commodity)</option>
              {commodities?.map((commodity: any) => (
                <option key={commodity.id} value={commodity.id}>
                  {commodity.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Section */}
        <h2 className="text-xl text-gray-800 border-b border-gray-300 pb-2 mt-8">
          डेटा (Data)
        </h2>
        {formData.data.map((item, index) => (
          <div key={index} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700">
                  नाम (Name)
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleChange(e, "name", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
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
              <div>
                <label className="block text-sm text-gray-700">
                  इकाई प्रकार (Unit Type)
                </label>
                <input
                  type="text"
                  value={item.unitType}
                  onChange={(e) => handleChange(e, "unitType", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  मात्रामा (Quantity)
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, "quantity", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none appearance-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">दर (Rate)</label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleChange(e, "rate", index)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none appearance-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                हटाउनुहोस् (Remove)
              </button>
            </div>

            {index < formData.data.length - 1 && (
              <hr className="my-6 border-gray-300" />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddRow}
          className="mt-4 px-4 py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-800"
        >
          नयाँ पंक्ति थप्नुहोस् (Add New Row)
        </button>

        {/* Production Details */}
        <h2 className="text-xl text-gray-800 border-b border-gray-300 pb-2 mt-8">
          उत्पादन विवरण (Production Details)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700">
              मुख्य उत्पादन (Main Production)
            </label>
            <input
              type="number"
              name="mainProduction"
              value={formData.productionDetails.mainProduction || ""}
              onChange={(e) => handleChange(e)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none appearance-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              बिक्री मूल्य (Selling Price)
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.productionDetails.sellingPrice || ""}
              onChange={(e) => handleChange(e)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none appearance-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              क्रमिक बाली उत्पादन (Gradual Crop Production)
            </label>
            <input
              type="number"
              name="gradualCropProduction"
              value={formData.productionDetails.gradualCropProduction || ""}
              onChange={(e) => handleChange(e)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none appearance-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              क्रमिक बाली बिक्री मूल्य (Gradual Crop Sale Price)
            </label>
            <input
              type="number"
              name="gradualCropSalePrice"
              value={formData.productionDetails.gradualCropSalePrice || ""}
              onChange={(e) => handleChange(e)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 outline-none appearance-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            पेश गर्नुहोस् (Submit)
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddCostSheet;
