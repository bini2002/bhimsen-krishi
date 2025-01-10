/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  message,
} from "antd/lib";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const { Title } = Typography;
const { Option } = Select;

const SetupProfile = () => {
  const { data: session } = useSession();
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [citizenshipFrontImage, setCitizenshipFrontImage] = useState<
    string | null
  >(null);
  const [citizenshipBackImage, setCitizenshipBackImage] = useState<
    string | null
  >(null);

  const handleProfileImageChange = (value: string) => {
    const selectedImage = imagesData?.data?.result?.find(
      (img: any) => img.id === value
    );
    setProfileImage(
      selectedImage
        ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedImage.image}`
        : null
    );
  };

  const handleCitizenshipFrontChange = (value: string) => {
    const selectedImage = imagesData?.data?.result?.find(
      (img: any) => img.id === value
    );
    setCitizenshipFrontImage(
      selectedImage
        ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedImage.image}`
        : null
    );
  };

  const handleCitizenshipBackChange = (value: string) => {
    const selectedImage = imagesData?.data?.result?.find(
      (img: any) => img.id === value
    );
    setCitizenshipBackImage(
      selectedImage
        ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedImage.image}`
        : null
    );
  };

  const handleFormSubmit = async (values: any) => {
    setLoading(true);

    const profileData = {
      ...values,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      citizenshipIssuedDate: dayjs(values.citizenshipIssuedDate).format(
        "YYYY-MM-DD"
      ),
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      message.success("Profile setup successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error setting up profile:", error);
      message.error("Failed to set up profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <Card className="bg-white shadow-lg rounded-lg" bordered={false}>
        <div className="text-center">
          <Title level={2} className="tnpmext-gray-900 mt-4">
            Setup Your Profile
          </Title>
        </div>

        <Divider orientation="left">Personal Information</Divider>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="picture"
                label="Profile Picture"
                rules={[
                  {
                    required: true,
                    message: "Please select the profile picture image",
                  },
                ]}
              >
                <Select
                  placeholder="Select profile picture"
                  onChange={handleProfileImageChange}
                >
                  {imagesData?.data?.result?.map((img: any) => (
                    <Option key={img?.id} value={img?.id}>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${img?.image}`}
                          alt={img?.name}
                          width={30}
                          height={60}
                          className="rounded h-8 object-cover"
                        />
                        <span>{img?.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
                {profileImage && (
                  <div className="mt-2">
                    <Image
                      src={profileImage}
                      alt="Profile Preview"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  { required: true, message: "Please select your gender" },
                ]}
              >
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                    message: "Please select your date of birth",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="skills"
                label="Skills"
                rules={[
                  { required: true, message: "Please enter your skills" },
                ]}
              >
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Enter skills"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="education"
                label="Education"
                rules={[
                  { required: true, message: "Please enter your education" },
                ]}
              >
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Enter education"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Address</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ward"
                label="Ward"
                rules={[
                  {
                    required: true,
                    type: "number",
                    message: "Please enter your ward",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tole"
                label="Tole"
                rules={[{ required: true, message: "Please enter your tole" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="district"
                label="District"
                rules={[
                  { required: true, message: "Please enter your district" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pradesh"
                label="Pradesh"
                rules={[
                  { required: true, message: "Please enter your pradesh" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="municipality"
                label="Municipality"
                rules={[
                  { required: true, message: "Please enter your municipality" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="landmark"
                label="Landmark"
                rules={[
                  { required: true, message: "Please enter your landmark" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Temporary Address</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tWard"
                label="Ward"
                rules={[
                  {
                    required: true,
                    type: "number",
                    message: "Please enter your ward",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tTole"
                label="Tole"
                rules={[{ required: true, message: "Please enter your tole" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tDistrict"
                label="District"
                rules={[
                  { required: true, message: "Please enter your district" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tPradesh"
                label="Pradesh"
                rules={[
                  { required: true, message: "Please enter your pradesh" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tMunicipality"
                label="Municipality"
                rules={[
                  { required: true, message: "Please enter your municipality" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tLandmark"
                label="Landmark"
                rules={[
                  { required: true, message: "Please enter your landmark" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            Citizenship Information (Optional)
          </Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="citizenshipNumber"
                label="Citizenship Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your citizenship number",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="citizenshipIssuedDate"
                label="Citizenship Issued Date"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select the issued date of your citizenship",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="citizenshipFront"
                label="Citizenship Front"
                rules={[
                  {
                    required: true,
                    message: "Please select the citizenship front image",
                  },
                ]}
              >
                <Select
                  placeholder="Select citizenship front"
                  onChange={handleCitizenshipFrontChange}
                >
                  {imagesData?.data?.result?.map((img: any) => (
                    <Option key={img?.id} value={img?.id}>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${img?.image}`}
                          alt={img?.name}
                          width={30}
                          height={60}
                          className="rounded h-8 object-cover"
                        />
                        <span>{img?.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
                {citizenshipFrontImage && (
                  <div className="mt-2">
                    <Image
                      src={citizenshipFrontImage}
                      alt="Citizenship Front Preview"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="citizenshipBack"
                label="Citizenship Back"
                rules={[
                  {
                    required: true,
                    message: "Please select the citizenship back image",
                  },
                ]}
              >
                <Select
                  placeholder="Select citizenship back"
                  onChange={handleCitizenshipBackChange}
                >
                  {imagesData?.data?.result?.map((img: any) => (
                    <Option key={img?.id} value={img?.id}>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${img?.image}`}
                          alt={img?.name}
                          width={30}
                          height={60}
                          className="rounded h-8 object-cover"
                        />
                        <span>{img?.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
                {citizenshipBackImage && (
                  <div className="mt-2">
                    <Image
                      src={citizenshipBackImage}
                      alt="Citizenship Back Preview"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SetupProfile;
