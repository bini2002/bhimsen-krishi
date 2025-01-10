/* eslint-disable @next/next/no-img-element */
import { PrimaryButton } from "@/components/globalcomponents/Button";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Upload,
} from "antd/lib";
import { useState, useEffect } from "react";
import { FaUserCircle, FaIdCard } from "react-icons/fa";
import { MdDateRange, MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import axios from "axios";
import { IImage } from "@/utils/interface";
import { axiosInstance } from "@/utils/axiosInstance";
import Image from "next/image";

const { Option } = Select;

export default function AddProfileForm() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageList, setImageList] = useState<IImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axiosInstance.get("/imageupload");
        if (response.data.success) {
          setImageList(response.data.data.result);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setFileList(info.fileList);
  };

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
    const formData = {
      ...values,
      picture: values.picture,
      citizenshipBack: values.citizenshipBack,
      citizenshipFront: values.citizenshipFront,
    };
    console.log("Form Data to Submit:", formData);
  };

  return (
    <section className="p-4">
      <h1 className="text-xl lg:text-2xl font-medium mb-4">Add User</h1>
      <div className="bg-white px-8 md:px-16 lg:px-32 py-8 rounded-xl shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ gender: "male" }}
        >
          <h2 className="text-lg font-medium mb-4">Personal Details</h2>
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center mb-4 lg:mb-8">
            <Form.Item label="Picture" name="picture">
              <Select placeholder="Select Picture" loading={loading}>
                {imageList.map((image) => (
                  <Option key={image.id} value={image.id}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${image.image}`}
                      alt={image.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 inline-block mr-2"
                    />
                    {image.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input prefix={<FaUserCircle />} className="py-2" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input prefix={<FaUserCircle />} className="py-2" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<MdEmail />} className="py-2" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input prefix={<MdPhone />} className="py-2" />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[
                {
                  required: true,
                  message: "Please select your date of birth!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                suffixIcon={<MdDateRange />}
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Radio.Group className="py-2">
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Input prefix={<MdLocationOn />} className="py-2" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: "Please select your country!" },
              ]}
            >
              <Select placeholder="Select your country">
                <Option value="usa">USA</Option>
                <Option value="canada">Canada</Option>
                <Option value="uk">UK</Option>
              </Select>
            </Form.Item>
          </div>

          <h2 className="text-lg font-medium mb-4">KYC</h2>
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
            <Form.Item
              label="Citizenship Number"
              name="citizenshipNumber"
              rules={[
                {
                  required: true,
                  message: "Please input your citizenship number!",
                },
              ]}
            >
              <Input prefix={<FaIdCard />} className="py-2" />
            </Form.Item>

            <Form.Item
              label="Citizenship Issued Date"
              name="citizenshipIssuedDate"
              rules={[
                {
                  required: true,
                  message: "Please select your citizenship issued date!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                suffixIcon={<MdDateRange />}
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              label="Ward"
              name="ward"
              rules={[
                { required: true, message: "Please input your ward number!" },
              ]}
            >
              <Input type="number" className="py-2" />
            </Form.Item>

            <Form.Item
              label="Tole"
              name="tole"
              rules={[{ required: true, message: "Please input your tole!" }]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="District"
              name="district"
              rules={[
                { required: true, message: "Please input your district!" },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Pradesh"
              name="pradesh"
              rules={[
                { required: true, message: "Please input your pradesh!" },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Municipality"
              name="municipality"
              rules={[
                { required: true, message: "Please input your municipality!" },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Landmark"
              name="landmark"
              rules={[
                { required: true, message: "Please input your landmark!" },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Temporary Ward"
              name="tWard"
              rules={[
                {
                  required: true,
                  message: "Please input your temporary ward number!",
                },
              ]}
            >
              <Input type="number" className="py-2" />
            </Form.Item>

            <Form.Item
              label="Temporary Tole"
              name="tTole"
              rules={[
                {
                  required: true,
                  message: "Please input your temporary tole!",
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Temporary District"
              name="tDistrict"
              rules={[
                {
                  required: true,
                  message: "Please input your temporary district!",
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Temporary Pradesh"
              name="tPradesh"
              rules={[
                {
                  required: true,
                  message: "Please input your temporary pradesh!",
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Temporary Municipality"
              name="tMunicipality"
              rules={[
                {
                  required: true,
                  message: "Please input your temporary municipality!",
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item
              label="Temporary Landmark"
              name="tLandmark"
              rules={[
                {
                  required: true,
                  message: "Please input your temporary landmark!",
                },
              ]}
            >
              <Input className="py-2" />
            </Form.Item>

            <Form.Item label="Citizenship Front" name="citizenshipFront">
              <Select placeholder="Select Citizenship Front" loading={loading}>
                {imageList.map((image) => (
                  <Option key={image.id} value={image.id}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${image.image}`}
                      alt={image.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 inline-block mr-2"
                    />
                    {image.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Citizenship Back" name="citizenshipBack">
              <Select placeholder="Select Citizenship Back" loading={loading}>
                {imageList.map((image) => (
                  <Option key={image.id} value={image.id}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${image.image}`}
                      alt={image.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 inline-block mr-2"
                    />
                    {image.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <PrimaryButton buttonName="Add User" />
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
