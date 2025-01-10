/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import useFetchData from "@/hook/useFetchData";
import { IProfile } from "@/utils/interface";
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
  Spin,
  Tag,
  Typography,
  message
} from "antd/lib";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

const EditProfile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<IProfile>();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const router = useRouter();

  const [selectedCitizenshipFront, setSelectedCitizenshipFront] = useState<
    string | undefined
  >();
  const [selectedCitizenshipBack, setSelectedCitizenshipBack] = useState<
    string | undefined
  >();

  const [selectedProfilePic, setSelectedProfilePic] = useState<
    string | undefined
  >();

  const handleProfilePicChange = (value: string) => {
    setSelectedProfilePic(value);
  };

  const handleCitizenshipFrontChange = (value: string) => {
    setSelectedCitizenshipFront(value);
  };

  const handleCitizenshipBackChange = (value: string) => {
    setSelectedCitizenshipBack(value);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/user/my-profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setProfile(response?.data?.data);
        setSelectedProfilePic(response?.data?.data?.picture?.id);
        setSelectedCitizenshipFront(response?.data?.data?.citizenshipFront?.id);
        setSelectedCitizenshipBack(response?.data?.data?.citizenshipBack?.id);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleFormSubmit = async (values: any) => {
    const updatedProfile = {
      ...values,
      skills: values.skills
        ? values.skills.split(",").map((skill: string) => skill.trim())
        : profile?.skills,
      education: values.education
        ? values.education.split(",").map((edu: string) => edu.trim())
        : profile?.education,
      dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : profile?.dob,
      citizenshipIssuedDate: values.citizenshipIssuedDate
        ? dayjs(values.citizenshipIssuedDate).format("YYYY-MM-DD")
        : profile?.citizenshipIssuedDate,
    };

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/${profile?.id}`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      message.success("Profile updated successfully!");
      router.push(`/profile`);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lg">
        <Spin />
      </p>
    );
  }

  if (!session?.user) {
    return (
      <p className="text-center text-lg text-red-500">
        No profile data available.
      </p>
    );
  }

  return (
    <div className="container mx-auto ">
      <Card className="bg-white shadow-lg rounded-lg" bordered={false}>
        <div className="text-center">
          <div className="flex justify-center mt-4">
            <Image
              src={
                selectedProfilePic
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${
                      imagesData?.data?.result?.find(
                        (img: any) => img.id === selectedProfilePic
                      )?.image
                    }`
                  : ""
              }
              width={96}
              height={96}
              alt="Profile Image"
              className="rounded-lg border-4 border-gray-300 shadow-lg w-40 h-40 object-cover"
            />
          </div>
          <Title level={2} className="text-gray-900">
            {profile?.firstName} {profile?.lastName}
          </Title>
          <Text className="text-gray-600">{profile?.gender}</Text>
          <Text className="block text-gray-600">
            {dayjs(profile?.dob).format("YYYY-MM-DD")}
          </Text>
          <Tag color="green" className="mt-2">
            Verified
          </Tag>
        </div>

        <Divider orientation="left">Edit Personal Information</Divider>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            gender: profile?.gender || "",
            dob: profile?.dob ? dayjs(profile.dob) : null,
            skills: profile?.skills?.join(", ") || "",
            education: profile?.education?.join(", ") || "",
            ward: profile?.address?.ward || "",
            tole: profile?.address?.tole || "",
            district: profile?.address?.district || "",
            pradesh: profile?.address?.pradesh || "",
            municipality: profile?.address?.municipality || "",
            landmark: profile?.address?.landmark || "",
            tWard: profile?.temporaryAddress?.ward || "",
            tTole: profile?.temporaryAddress?.tole || "",
            tDistrict: profile?.temporaryAddress?.district || "",
            tPradesh: profile?.temporaryAddress?.pradesh || "",
            tMunicipality: profile?.temporaryAddress?.municipality || "",
            tLandmark: profile?.temporaryAddress?.landmark || "",
            citizenshipNumber: profile?.citizenshipNumber || "",
            citizenshipIssuedDate: profile?.citizenshipIssuedDate
              ? dayjs(profile.citizenshipIssuedDate)
              : null,
            citizenshipFront: profile?.citizenshipFront?.id || "",
            citizenshipBack: profile?.citizenshipBack?.id || "",
          }}
          onFinish={handleFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="picture"
                label="Profile Picture"
                rules={[
                  {
                    required: true,
                    message: "Please select your profile picture",
                  },
                ]}
              >
                <Select
                  placeholder="Select profile picture"
                  allowClear
                  onChange={handleProfilePicChange}
                >
                  {imagesData?.data?.result?.map((img: any) => (
                    <Option key={img?.id} value={img?.id}>
                      {img?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Image preview for profile picture */}
              {selectedProfilePic && (
                <div className="mt-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      imagesData?.data?.result?.find(
                        (img: any) => img.id === selectedProfilePic
                      )?.image
                    }`}
                    alt="Profile Picture"
                    width={250}
                    height={250}
                    className="rounded w-40 h-32 object-cover"
                  />
                </div>
              )}
            </Col>
          </Row>

          <Row gutter={16}>
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
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
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
                <Input />
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
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Edit Address</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ward"
                label="Ward"
                rules={[{ required: true, message: "Please enter your ward" }]}
              >
                <InputNumber type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                name="tole"
                label="Tole"
                rules={[{ required: true, message: "Please enter your tole" }]}
              >
                <Input />
              </Form.Item>
            </Col>
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

          <Divider orientation="left">Edit Temporary Address</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tWard"
                label="Temporary Ward"
                rules={[
                  {
                    required: true,
                    message: "Please enter your temporary ward",
                  },
                ]}
              >
                <InputNumber type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                name="tTole"
                label="Temporary Tole"
                rules={[
                  {
                    required: true,
                    message: "Please enter your temporary tole",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tDistrict"
                label="Temporary District"
                rules={[
                  {
                    required: true,
                    message: "Please enter your temporary district",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tPradesh"
                label="Temporary Pradesh"
                rules={[
                  {
                    required: true,
                    message: "Please enter your temporary pradesh",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tMunicipality"
                label="Temporary Municipality"
                rules={[
                  {
                    required: true,
                    message: "Please enter your temporary municipality",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                name="tLandmark"
                label="Temporary Landmark"
                rules={[
                  {
                    required: true,
                    message: "Please enter your temporary landmark",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Edit Citizenship</Divider>

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
                    message: "Please select your citizenship issued date",
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
                  allowClear
                  onChange={handleCitizenshipFrontChange}
                >
                  {imagesData?.data?.result?.map((img: any) => (
                    <Option key={img?.id} value={img?.id}>
                      {img?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Image preview for citizenship front */}
              {selectedCitizenshipFront && (
                <div className="mt-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      imagesData?.data?.result?.find(
                        (img: any) => img.id === selectedCitizenshipFront
                      )?.image
                    }`}
                    alt="Citizenship Front"
                    width={250}
                    height={250}
                    className="rounded w-40 h-32 object-cover"
                  />
                </div>
              )}
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
                  allowClear
                  onChange={handleCitizenshipBackChange}
                >
                  {imagesData?.data?.result?.map((img: any) => (
                    <Option key={img?.id} value={img?.id}>
                      {img?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Image preview for citizenship back */}
              {selectedCitizenshipBack && (
                <div className="mt-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      imagesData?.data?.result?.find(
                        (img: any) => img?.id === selectedCitizenshipBack
                      )?.image
                    }`}
                    alt="Citizenship Back"
                    width={250}
                    height={250}
                    className="rounded w-40 h-32 object-cover"
                  />
                </div>
              )}
            </Col>
          </Row>

          <Form.Item className="text-center mt-8">
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;
