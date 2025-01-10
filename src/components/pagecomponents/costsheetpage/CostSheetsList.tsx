import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { CostSheet } from "@/utils/interface";
import type { ColumnsType } from "antd/es/table";
import { Button, Modal, Table, message } from "antd/lib";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { CgEye } from "react-icons/cg";
import { FiTrash } from "react-icons/fi";
import CostSheetModal from "../businesscommoditiespage/ViewModal";

export default function CostSheetsList() {
  const router = useRouter();
  const { fetchedData, refetchData } = useFetchData("/cost-sheet");
  const { fetchedData: commodityData } = useFetchData("/business-commodity");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCostSheet, setSelectedCostSheet] = useState<CostSheet | null>(
    null
  );

  const commodityMap: Record<number, string> = {};
  if (commodityData?.data) {
    commodityData.data.data.forEach(
      (commodity: { id: number; name: string }) => {
        commodityMap[commodity.id] = commodity.name;
      }
    );
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this cost sheet?",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/cost-sheet/${id}`);
          message.success("Cost sheet deleted successfully.");
          refetchData();
        } catch (error) {
          console.error("Error deleting the cost sheet:", error);
          message.error("Failed to delete cost sheet.");
        }
      },
    });
  };

  const handleView = (record: CostSheet) => {
    setSelectedCostSheet(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCostSheet(null);
  };

  if (!fetchedData || !fetchedData.data) return <div>Loading...</div>;

  const costSheets: CostSheet[] = fetchedData.data.result;

  const columns = (
    onView: (record: CostSheet) => void,
    onDelete: (id: number) => void
  ): ColumnsType<CostSheet> => [
    {
      title: "शीर्षक",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "कमोडिटी",
      dataIndex: "commodity",
      key: "commodity",
      render: (commodityId: number) => commodityMap[commodityId] || "नाहीं",
    },

    {
      title: "मुख्य उत्पादन",
      dataIndex: ["productionDetails", "mainProduction"],
      key: "mainProduction",
    },
    {
      title: "बिक्री मूल्य",
      dataIndex: ["productionDetails", "sellingPrice"],
      key: "sellingPrice",
    },
    {
      title: "क्रमबद्ध बाली उत्पादन",
      dataIndex: ["productionDetails", "gradualCropProduction"],
      key: "gradualCropProduction",
    },
    {
      title: "कार्यहरू",
      key: "actions",
      render: (_text, record) => (
        <>
          <Button
            type="link"
            onClick={() => onView(record)}
            icon={<CgEye />}
          ></Button>
          <Button
            type="link"
            onClick={() => router.push(`/cost-sheets/edit/${record?.id}`)}
            icon={<BiEdit />}
          ></Button>
          <Button
            type="link"
            danger
            onClick={() => onDelete(record.id)}
            icon={<FiTrash />}
          ></Button>
        </>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between mb-4 lg:mb-8">
        <h1 className="lg:text-lg font-medium">खर्च पत्रको सूची</h1>
        <Link href="/cost-sheets/add">
          <Button type="primary">नयाँ थप्नुहोस् </Button>
        </Link>
      </div>
      <Table
        columns={columns(handleView, handleDelete)}
        dataSource={costSheets}
        rowKey={(record) => record.id}
        pagination={{
          total: fetchedData.data.totalCount,
          pageSize: 10,
        }}
      />

      {/* View Modal integration */}
      {selectedCostSheet && (
        <CostSheetModal
          isModalVisible={isModalVisible}
          handleCloseModal={handleCloseModal}
          selectedCostSheet={selectedCostSheet}
          commodityMap={commodityMap}
        />
      )}
    </section>
  );
}
