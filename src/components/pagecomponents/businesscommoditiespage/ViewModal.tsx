import React, { useRef, useState, useEffect } from "react";
import { Button, message, Modal } from "antd/lib";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useFetchData from "@/hook/useFetchData";
import { CostSheet, Commodity, Item } from "@/types/cost-sheet";

interface CostSheetModalProps {
  isModalVisible: boolean;
  handleCloseModal: () => void;
  selectedCostSheet: any;
  commodityMap: Record<number, string>;
}

const renderTableToString = (title: string, data: Item[]) => {
  return `
      <div class="mt-6">
        <h3 class="font-semibold">${title}</h3>
        <table class="min-w-full mt-4">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2 text-left">विशेषताहरू (Particulars)</th>
              <th class="border border-gray-300 px-4 py-2 text-right">रकम (Amount)</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
                  <tr class="${
                    data.indexOf(item) % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }">
                    <td class="border border-gray-300 px-4 py-2">${
                      item.name
                    }</td>
                    <td class="border border-gray-300 px-4 py-2 text-right">${
                      item.rate * item.quantity
                    }</td>
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
};

const defaultTemplate = `
 {{fixedCapital}}
  {{fixedCost}}
  {{workingCost}}
  {{workingCapital}}
  {{profitLoss}}
 
`;

const CostSheetModal: React.FC<CostSheetModalProps> = ({
  isModalVisible,
  handleCloseModal,
  selectedCostSheet,
  commodityMap,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commodityTemplate, setCommodityTemplate] =
    useState<string>(defaultTemplate);
  const [error, setError] = useState<string | null>(null);
  const { fetchedData } = useFetchData("/business-commodity");
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const categorizeCostSheetData = (data: Item[]) => {
    return {
      workingCost: data.filter((item) => item.type === "working-cost"),
      workingCapital: data.filter((item) => item.type === "working-capital"),
      fixedCost: data.filter((item) => item.type === "fixed-cost"),
      profitLoss: data.filter((item) => item.type === "profit-loss"),
      fixedCapital: data.filter((item) => item.type === "fixed-capital"),
    };
  };

  const costSheetCategories = categorizeCostSheetData(selectedCostSheet?.data);

  const replaceTemplatePlaceholders = () => {
    if (!commodityTemplate) return defaultTemplate;
    return (commodityTemplate || defaultTemplate)
      .replace(
        "{{workingCost}}",
        renderTableToString(
          "कार्य लागत (Working Cost)",
          costSheetCategories.workingCost
        )
      )
      .replace(
        "{{workingCapital}}",
        renderTableToString(
          "कार्य पूंजी (Working Capital)",
          costSheetCategories.workingCapital
        )
      )
      .replace(
        "{{fixedCost}}",
        renderTableToString(
          "स्थिर लागत (Fixed Cost)",
          costSheetCategories.fixedCost
        )
      )
      .replace(
        "{{profitLoss}}",
        renderTableToString(
          "लाभ/हानि (Profit/Loss)",
          costSheetCategories.profitLoss
        )
      )
      .replace(
        "{{fixedCapital}}",
        renderTableToString(
          "स्थिर पूंजी (Fixed Capital)",
          costSheetCategories.fixedCapital
        )
      );
  };

  useEffect(() => {
    if (fetchedData) {
      const commodity = fetchedData?.data?.data.find(
        (item: Commodity) => item.id === selectedCostSheet?.commodity
      );
      if (commodity?.template) {
        setCommodityTemplate(commodity.template);
      } else {
        setCommodityTemplate(defaultTemplate);
      }
    }
  }, [fetchedData, selectedCostSheet?.commodity, error]);

  const handleDownloadPDF = async () => {
    if (modalContentRef.current) {
      setIsLoading(true);
      try {
        const canvas = await html2canvas(modalContentRef.current);
        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${selectedCostSheet?.title}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        message.error("Failed to download PDF.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleCloseModal}
      footer={
        <Button type="primary" onClick={handleDownloadPDF} loading={isLoading}>
          पीडीएफको रूपमा डाउनलोड गर्नुहोस् (Download as PDF)
        </Button>
      }
      width={1000}
    >
      <div className="p-8" ref={modalContentRef}>
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="text-center py-4">
              <h1 className="text-2xl font-medium">
                {selectedCostSheet?.title}
              </h1>
              <h2 className="md:text-lg">
                {commodityMap[selectedCostSheet?.commodity]}
              </h2>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: replaceTemplatePlaceholders(),
              }}
            />
            {/* Production Details */}
            <div className="mt-6">
              <h3 className="font-semibold">
                उत्पादन विवरण (Production Details)
              </h3>
              <table className="min-w-full mt-4">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      मुख्य उत्पादन (Main Production)
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {selectedCostSheet?.productionDetails.mainProduction}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      बेच्ने मूल्य (Selling Price)
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {selectedCostSheet?.productionDetails.sellingPrice}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      क्रमिक बाली उत्पादन (Gradual Crop Production)
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {
                        selectedCostSheet?.productionDetails
                          .gradualCropProduction
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      क्रमिक बाली बिक्री मूल्य (Gradual Crop Sale Price)
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {
                        selectedCostSheet?.productionDetails
                          .gradualCropSalePrice
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CostSheetModal;
