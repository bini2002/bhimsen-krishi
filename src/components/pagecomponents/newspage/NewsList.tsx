import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  ICategory,
  IFeaturedImage,
  INews,
  ISubCategory,
} from "@/utils/interface";
import { Button, Modal, message } from "antd/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddNewsModal from "./AddNewsModal";
import EditNewsModal from "./EditNewsModal";

const NewsList: React.FC = () => {
  const { fetchedData: newsData, refetchData: refetchNews } =
    useFetchData("/news");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [featuredImages, setFeaturedImages] = useState<IFeaturedImage[]>([]);
  const [news, setNews] = useState<INews[]>([]);
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    // Fetch categories
    axiosInstance
      .get("/category")
      .then((response) => setCategories(response.data.data.result))
      .catch((error) => console.error("Failed to fetch categories:", error));

    // Fetch subcategories
    axiosInstance
      .get("/subcategory")
      .then((response) => setSubCategories(response.data.data.result))
      .catch((error) => console.error("Failed to fetch subcategories:", error));

    // Fetch featured images
    axiosInstance
      .get("/imageupload")
      .then((response) => setFeaturedImages(response.data.result))
      .catch((error) =>
        console.error("Failed to fetch featured images:", error)
      );
  }, []);

  useEffect(() => {
    if (newsData && newsData.success) {
      setNews(newsData.data.result);
    }
  }, [newsData]);

  const handleEdit = (newsItem: INews) => {
    setSelectedNews(newsItem);
    setIsEditModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this news?",
      onOk: () => {
        axiosInstance
          .delete(`/news/${id}`)
          .then(() => {
            message.success("News deleted successfully!");
            refetchNews();
          })
          .catch((error) => {
            message.error("Failed to delete news.");
            console.error("Error deleting news:", error);
          });
      },
    });
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "N/A";
  };

  const getImageUrl = (imagePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`;
  };

  return (
    <section className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">समाचार</h2>
        <AddNewsModal refetchData={refetchNews} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="w-full border border-gray-300 rounded-lg bg-white shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <Image
                src={getImageUrl(item?.image?.image)}
                alt={item.title}
                width={300}
                height={200}
                className="object-cover w-full h-40 md:h-52 rounded"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="mb-1">
                <span className="font-medium">श्रेणी:</span>{" "}
                {getCategoryName(item.categories[0]?.id ?? 0)}
              </p>
              <p className="line-clamp-4">{item.description}</p>
              <div className="mt-4 flex justify-between">
                <Button
                  icon={<FaEdit />}
                  onClick={() => handleEdit(item)}
                  type="link"
                  className="hover:text-blue-600"
                >
                  सम्पादन गर्नुहोस्
                </Button>
                <Button
                  icon={<FaTrash />}
                  onClick={() => handleDelete(item.id)}
                  type="link"
                  danger
                  className="hover:text-red-600"
                >
                  मेटाउनुहोस्
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedNews && (
        <EditNewsModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          newsItem={selectedNews}
          refetchData={refetchNews}
        />
      )}
    </section>
  );
};

export default NewsList;
