/* eslint-disable react-hooks/exhaustive-deps */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IImage, IProfile, IUser } from "@/utils/interface";
import {
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
  Switch,
} from "antd/lib";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AddOtherFarmerKYCModal = () => {
  const { fetchedData: users, loading: usersLoading } = useFetchData(`/user`);
  const { fetchedData: images, loading: imagesLoading } =
    useFetchData(`/imageupload`);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: sessionData } = useSession();

  console.log("profile id test", profileData?.id);

  const fetchProfileData = async (userId: string) => {
    try {
      setLoading(true);
      const user = users?.data?.result?.find(
        (user: IUser) => user?.userId === userId
      );
      if (!user?.profile) {
        message.warning("No profile found for the selected user.");
        return;
      }
      const response = await axiosInstance.get(`/profile/${user.profile}`, {
        headers: { Authorization: `Bearer ${sessionData?.user?.accessToken}` },
      });
      const profile = response.data?.data;
      setProfileData(profile);
      form.setFieldsValue({
        citizenshipIssuedDate: profile?.citizenshipIssuedDate || "",
        citizenshipNumber: profile?.citizenshipNumber || "",
        citizenshipFront: profile?.citizenshipFront || "",
        citizenshipBack: profile?.citizenshipBack || "",
        area: "",
        fertileSoil: "",
        unfertileSoil: "",
        isOnLease: false,
        hasTunnelFarming: false,
        hasRoadAccess: false,
        status: "pending",
        message: "",
      });
    } catch (error) {
      message.error("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchProfileData(selectedUserId);
    }
  }, [selectedUserId]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedUserId) {
        message.warning("Please select a user.");
        return;
      }

      await axiosInstance.post(
        `/admin-farmers-kyc/${selectedUserId}`,
        {
          area: values?.area || "",
          fertileSoil: values?.fertileSoil || "",
          unfertileSoil: values?.unfertileSoil || "",
          isOnLease: values?.isOnLease,
          hasTunnelFarming: values?.hasTunnelFarming,
          hasRoadAccess: values?.hasRoadAccess,
          user: selectedUserId,
          status: values?.status,
          message: values?.message,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData?.user?.accessToken}`,
          },
        }
      );

      await axiosInstance.patch(
        `/admin/profile/${profileData?.id}`,
        {
          citizenshipIssuedDate: values?.citizenshipIssuedDate || "",
          citizenshipNumber: values?.citizenshipNumber || "",
          citizenshipFront: values?.citizenshipFront || "",
          citizenshipBack: values?.citizenshipBack || "",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData?.user?.accessToken}`,
          },
        }
      );

      message.success("Farmer KYC and profile updated successfully!");
      form.resetFields();
      setSelectedUserId(null);
      setProfileData(null);
    } catch (error) {
      message.error("Failed to save Farmer KYC and profile.");
    }
  };

  return (
    <section className="">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Create Farmer KYC
      </h2>
      <Spin spinning={loading || usersLoading || imagesLoading}>
        <Form
          form={form}
          layout="vertical"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* User Selection */}
          <Form.Item
            label="Select User"
            name="userId"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select
              placeholder="Select a user"
              onChange={(value) => setSelectedUserId(value)}
            >
              {users?.data?.result?.map((user: IUser) => (
                <Select.Option key={user?.userId} value={user?.userId}>
                  {user?.email || `User ${user?.userId}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Citizenship Front */}
          <Form.Item
            label="Citizenship Front"
            name="citizenshipFront"
            rules={[
              { required: true, message: "Please select a front image!" },
            ]}
          >
            <Select placeholder="Select Citizenship Front">
              {images?.data?.result?.map((image: IImage) => (
                <Select.Option key={image?.id} value={image?.id}>
                  <div className="flex items-center space-x-4">
                    <Image
                      alt={` ${image?.name}`}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
                      width={50}
                      height={50}
                      className=" w-8 h-8 object-cover"
                    />
                    <span>{` ${image?.name}`}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Citizenship Back */}
          <Form.Item
            label="Citizenship Back"
            name="citizenshipBack"
            rules={[{ required: true, message: "Please select a back image!" }]}
          >
            <Select placeholder="Select Citizenship Back">
              {images?.data?.result?.map((image: IImage) => (
                <Select.Option key={image?.id} value={image?.id}>
                  <div className="flex items-center space-x-4">
                    <Image
                      alt={` ${image?.name}`}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
                      width={50}
                      height={50}
                      className=" w-8 h-8 object-cover"
                    />
                    <span>{` ${image?.name}`}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Citizenship Issued Date */}
          <Form.Item
            label="Citizenship Issued Date"
            name="citizenshipIssuedDate"
            rules={[
              { required: true, message: "Please enter the issue date!" },
            ]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>

          {/* Citizenship Number */}
          <Form.Item
            label="Citizenship Number"
            name="citizenshipNumber"
            rules={[
              {
                required: true,
                message: "Please enter the citizenship number!",
              },
            ]}
          >
            <Input placeholder="Citizenship Number" />
          </Form.Item>

          {/* Area */}
          <Form.Item
            label="Area (in hectares)"
            name="area"
            rules={[{ required: true, message: "Please enter the area!" }]}
          >
            <InputNumber placeholder="Area" min={0} className="w-full" />
          </Form.Item>

          {/* Fertile Soil */}
          <Form.Item
            label="Fertile Soil (in hectares)"
            name="fertileSoil"
            rules={[
              { required: true, message: "Please enter the fertile soil!" },
            ]}
          >
            <InputNumber
              placeholder="Fertile Soil"
              min={0}
              className="w-full"
            />
          </Form.Item>

          {/* Unfertile Soil */}
          <Form.Item
            label="Unfertile Soil (in hectares)"
            name="unfertileSoil"
            rules={[
              { required: true, message: "Please enter the unfertile soil!" },
            ]}
          >
            <InputNumber
              placeholder="Unfertile Soil"
              min={0}
              className="w-full"
            />
          </Form.Item>

          {/* Boolean Fields */}
          <Form.Item
            label="Is on Lease?"
            name="isOnLease"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Has Tunnel Farming?"
            name="hasTunnelFarming"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Has Road Access?"
            name="hasRoadAccess"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please select the status!",
              },
            ]}
          >
            <Select placeholder="Select Status">
              <Select.Option value="verified">Verified</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          {/* Message */}
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter a message!" }]}
          >
            <Input.TextArea
              placeholder="Enter message here..."
              rows={4}
              className="w-full"
            />
          </Form.Item>

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2">
            <button
              type="button"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </Form>
      </Spin>
    </section>
  );
};

export default AddOtherFarmerKYCModal;
