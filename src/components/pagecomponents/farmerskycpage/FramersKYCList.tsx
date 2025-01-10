/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IFarmerKyc, IImage } from "@/utils/interface";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
} from "antd/lib";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import AddFarmerKYCModal from "./AddAdminFarmerKycModal";
import KycCard from "./Kyc-Card";
import { DatePicker } from "antd/lib";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import TextArea from "antd/lib/input/TextArea";

const FarmersKYCList: React.FC = () => {
  const { fetchedData, refetchData } = useFetchData("/kyc");
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const [dataSource, setDataSource] = useState<IFarmerKyc[]>([]);
  const [editingKYC, setEditingKYC] = useState<IFarmerKyc | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { data } = useSession();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const [imagesMap, setImagesMap] = useState<{ [key: number]: IImage }>({});

  useEffect(() => {
    if (fetchedData?.success) {
      setDataSource(fetchedData.data.result);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (imagesData?.success) {
      const imagesMap = imagesData?.data?.result.reduce(
        (map: { [key: number]: IImage }, image: IImage) => {
          map[image.id] = image;
          return map;
        },
        {}
      );
      setImagesMap(imagesMap);
    }
  }, [imagesData]);

  const handleEdit = (kyc: IFarmerKyc) => {
    setEditingKYC(kyc);

    form.setFieldsValue({
      ...kyc,
      citizenshipIssuedDate: kyc?.profile?.citizenshipIssuedDate
        ? dayjs(kyc.profile.citizenshipIssuedDate)
        : null,
      citizenshipNumber: kyc?.profile?.citizenshipNumber || null,
      citizenshipFrontImage: kyc?.profile?.citizenshipFront || null,
      citizenshipBackImage: kyc?.profile?.citizenshipBack || null,
    });

    setIsEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await form.validateFields();

      const {
        citizenshipIssuedDate,
        citizenshipNumber,
        citizenshipFrontImage,
        citizenshipBackImage,
        ...kycDetails
      } = values;

      if (editingKYC) {
        await axiosInstance.patch(`/admin-farmers-kyc/${editingKYC.id}`, kycDetails, {
          headers: { Authorization: `Bearer ${data?.user?.accessToken}` },
        });
        message.success("KYC सफलतापूर्वक अपडेट गरियो!");
      }

      if (editingKYC?.profile?.id) {
        await axiosInstance.patch(
          `/admin/profile/${editingKYC.profile.id}`,
          {
            citizenshipIssuedDate,
            citizenshipNumber,
            citizenshipFront: citizenshipFrontImage,
            citizenshipBack: citizenshipBackImage,
          },
          {
            headers: { Authorization: `Bearer ${data?.user?.accessToken}` },
          }
        );
        message.success("नागरिकता विवरण सफलतापूर्वक अपडेट गरियो!");
      }

      setIsEditModalVisible(false);
      refetchData();
    } catch (error) {
      message.error("अपडेट गर्न असफल भयो।");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/kyc/${id}`, {
        headers: { Authorization: `Bearer ${data?.user?.accessToken}` },
      });
      message.success("KYC सफलतापूर्वक मेटाइयो!");
      refetchData();
    } catch (error) {
      message.error("KYC मेटाउन असफल भयो।");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    const filteredData = fetchedData?.data.result.filter((kyc: IFarmerKyc) =>
      kyc?.profile?.firstName
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setDataSource(filteredData || []);
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <section className="md:p-4">
      <h1 className="text-lg lg:text-xl font-medium mb-4">किसान KYC सूची</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <Input
          placeholder="किसानको नामद्वारा खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "200px" }}
        />
        <div className="space-x-4">
          <Link href={"/farmers-kyc/create"}>
            <Button>Create Farmer KYC</Button>
          </Link>
          <AddFarmerKYCModal refetchData={refetchData} />
        </div>
      </div>

      {/* cards  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:p-4">
        {dataSource.map((kyc) => (
          <KycCard
            key={kyc.id}
            kyc={kyc}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      <Modal
        title="KYC सम्पादन गर्नुहोस्"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            बचत गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area"
                label="क्षेत्र"
                rules={[
                  {
                    required: true,
                    message: "कृपया क्षेत्र प्रविष्ट गर्नुहोस्",
                  },
                ]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fertileSoil"
                label="उर्वर माटो"
                rules={[
                  {
                    required: true,
                    message: "कृपया उर्वर माटोको मात्रा प्रविष्ट गर्नुहोस्",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unfertileSoil"
                label="उर्वर नभएको माटो"
                rules={[
                  {
                    required: true,
                    message:
                      "कृपया उर्वर नभएको माटोको मात्रा प्रविष्ट गर्नुहोस्",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isOnLease"
                label="भाडामा छ?"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hasRoadAccess"
                label="सडक पहुँच छ?"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hasTunnelFarming"
                label="सुरंग खेती छ?"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="citizenshipIssuedDate"
                label="नागरिकता जारी मिति"
                rules={[
                  {
                    required: true,
                    message: "कृपया नागरिकता जारी मिति प्रविष्ट गर्नुहोस्",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="citizenshipNumber"
                label="नागरिकता नम्बर"
                rules={[
                  {
                    required: true,
                    message: "कृपया नागरिकता नम्बर प्रविष्ट गर्नुहोस्",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="citizenshipFrontImage"
                label="नागरिकता अगाडिको तस्बिर"
                rules={[
                  {
                    required: true,
                    message: "कृपया अगाडिको तस्बिर चयन गर्नुहोस्",
                  },
                ]}
              >
                <Select
                  placeholder="तस्बिर चयन गर्नुहोस्"
                  options={imagesData?.data?.result?.map((image: IImage) => ({
                    label: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
                          alt={image.name}
                          width={50}
                          height={50}
                          className="w-8"
                        />
                        {image.name}
                      </div>
                    ),
                    value: image.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="citizenshipBackImage"
                label="नागरिकता पछाडिको तस्बिर"
                rules={[
                  {
                    required: true,
                    message: "कृपया पछाडिको तस्बिर चयन गर्नुहोस्",
                  },
                ]}
              >
                <Select
                  placeholder="तस्बिर चयन गर्नुहोस्"
                  options={imagesData?.data?.result?.map((image: IImage) => ({
                    label: (
                      <div className="flex space-x-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
                          alt={image.name}
                          width={50}
                          height={50}
                          className="w-8 h-8 object-cover"
                        />
                        {image.name}
                      </div>
                    ),
                    value: image.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Status Field */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="स्थिति"
                rules={[
                  {
                    required: true,
                    message: "कृपया स्थिति चयन गर्नुहोस्",
                  },
                ]}
              >
                <Select placeholder="स्थिति चयन गर्नुहोस्">
                  <Select.Option value="verified">पुष्टि गरिएको</Select.Option>
                  <Select.Option value="pending">मुल्यांकनमा</Select.Option>
                  <Select.Option value="rejected">अस्वीकृत</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Message Field */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="message"
                label="सन्देश"
                rules={[
                  {
                    required: true,
                    message: "कृपया सन्देश प्रविष्ट गर्नुहोस्",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="सन्देश यहाँ लेख्नुहोस्" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </section>
  );
};

export default FarmersKYCList;
