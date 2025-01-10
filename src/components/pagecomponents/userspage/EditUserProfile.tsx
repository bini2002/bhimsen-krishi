import useFetchData from "@/hook/useFetchData";
import { Select } from "antd/lib";
import dayjs from "dayjs";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";

export interface User {
  firstName: string;
  lastName: string;
  picture: number;
  gender: string;
  dob: string;
  skills: string[];
  education: string[];
  citizenshipNumber: string;
  citizenshipIssuedDate: string;
  ward: number;
  tole: string;
  district: string;
  pradesh: string;
  municipality: string;
  landmark: string;
  tWard: number;
  tTole: string;
  tLandmark: string;
  tDistrict: string;
  tPradesh: string;
  tMunicipality: string;
  citizenshipBack: number;
  citizenshipFront: number;
}

interface EditUserProfileProps {
  user: User;
  onSubmit: (updatedUser: User) => void;
}
const { Option } = Select;

const EditUserProfile: React.FC<EditUserProfileProps> = ({
  user,
  onSubmit,
}) => {
  const [formUser, setFormUser] = useState<any>(user);
  const { fetchedData: imageOptions } = useFetchData("/imageupload");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.target && "name" in e.target && "value" in e.target) {
      const { name, value } = e.target;

      setFormUser({
        ...formUser,
        [name]: name.endsWith("Id") ? Number(value) : value,
      });
    }
  };
  const handleArrayChange = (name: string, value: string) => {
    setFormUser({
      ...formUser,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formUser);
  };

  return (
    <section className="p-4">
      <h1 className="text-xl font-medium mb-4 border-b pb-4">
        Update User Profile
      </h1>
      <form className="" onSubmit={handleSubmit}>
        {/* Personal Details Section */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2 mt-4">Personal Details</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formUser?.firstName}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formUser?.lastName}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div className="relative">
              <label>Picture</label>
              <Select
                value={formUser?.picture}
                onChange={(value) =>
                  setFormUser({ ...formUser, picture: value })
                }
                style={{ width: "100%" }}
                placeholder="Select a Picture"
                showSearch
                optionFilterProp="children"
              >
                {imageOptions?.data?.result?.map((img: any) => (
                  <Option key={img.id} value={img.id}>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${img.image}`}
                        alt={img.name}
                        width={50}
                        height={50}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="">{img.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              {/* Displaying Selected Image */}
              {formUser?.picture && (
                <div className="mt-4 flex items-center space-x-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      imageOptions?.data?.result?.find(
                        (img: any) => img.id === formUser?.picture
                      )?.image
                    }`}
                    alt="Selected image"
                    width={500}
                    height={500}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <span>
                    {
                      imageOptions?.data?.result?.find(
                        (img: any) => img.id === formUser?.picture
                      )?.name
                    }
                  </span>
                </div>
              )}
            </div>
            <div>
              <label>Gender</label>
              <select
                name="gender"
                value={formUser?.gender}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={
                  formUser?.dob ? dayjs(formUser.dob).format("YYYY-MM-DD") : ""
                }
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formUser?.skills.join(", ")}
                onChange={(e) => handleArrayChange("skills", e.target.value)}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Education (comma separated)</label>
              <input
                type="text"
                name="education"
                value={formUser?.education.join(", ")}
                onChange={(e) => handleArrayChange("education", e.target.value)}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2 mt-4">Permanent Address</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label>Ward</label>
              <input
                type="number"
                name="ward"
                value={formUser?.ward}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Tole</label>
              <input
                type="text"
                name="tole"
                value={formUser?.tole}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>District</label>
              <input
                type="text"
                name="district"
                value={formUser?.district}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Pradesh</label>
              <input
                type="text"
                name="pradesh"
                value={formUser?.pradesh}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Municipality</label>
              <input
                type="text"
                name="municipality"
                value={formUser?.municipality}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formUser?.landmark}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Temporary Address Section */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2 mt-4">Temporary Address</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label>Ward</label>
              <input
                type="number"
                name="tWard"
                value={formUser?.tWard}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Tole</label>
              <input
                type="text"
                name="tTole"
                value={formUser?.tTole}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Landmark</label>
              <input
                type="text"
                name="tLandmark"
                value={formUser?.tLandmark}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>District</label>
              <input
                type="text"
                name="tDistrict"
                value={formUser?.tDistrict}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Pradesh</label>
              <input
                type="text"
                name="tPradesh"
                value={formUser?.tPradesh}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Municipality</label>
              <input
                type="text"
                name="tMunicipality"
                value={formUser?.tMunicipality}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Citizenship Details Section */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2 mt-4">
            Citizenship Details
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label>Citizenship Number</label>
              <input
                type="text"
                name="citizenshipNumber"
                value={formUser?.citizenshipNumber}
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div>
              <label>Citizenship Issued Date</label>
              <input
                type="date"
                name="dob"
                value={
                  formUser?.citizenshipIssuedDate
                    ? dayjs(formUser.citizenshipIssuedDate).format("YYYY-MM-DD")
                    : ""
                }
                onChange={handleInputChange}
                className="border p-2 rounded w-full outline-none"
              />
            </div>
            <div className="relative">
              <label>Citizenship Front</label>
              <Select
                value={formUser?.citizenshipFront}
                onChange={(value) =>
                  setFormUser({ ...formUser, citizenshipFront: value })
                }
                style={{ width: "100%" }}
                placeholder="Select a Picture"
                showSearch
                optionFilterProp="children"
              >
                {imageOptions?.data?.result?.map((img: any) => (
                  <Option key={img.id} value={img.id}>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${img.image}`}
                        alt={img.name}
                        width={50}
                        height={50}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="">{img.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              {/* Displaying Selected Image */}
              {formUser?.citizenshipFront && (
                <div className="mt-4 flex items-center space-x-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      imageOptions?.data?.result?.find(
                        (img: any) => img.id === formUser?.citizenshipFront
                      )?.image
                    }`}
                    alt="Selected image"
                    width={500}
                    height={500}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <span>
                    {
                      imageOptions?.data?.result?.find(
                        (img: any) => img.id === formUser?.citizenshipFront
                      )?.name
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="relative">
              <label>Citizenship Back</label>
              <Select
                value={formUser?.citizenshipBack}
                onChange={(value) =>
                  setFormUser({ ...formUser, citizenshipBack: value })
                }
                style={{ width: "100%" }}
                placeholder="Select a Picture"
                showSearch
                optionFilterProp="children"
              >
                {imageOptions?.data?.result?.map((img: any) => (
                  <Option key={img.id} value={img.id}>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${img.image}`}
                        alt={img.name}
                        width={50}
                        height={50}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="">{img.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              {/* Displaying Selected Image */}
              {formUser?.citizenshipBack && (
                <div className="mt-4 flex items-center space-x-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      imageOptions?.data?.result?.find(
                        (img: any) => img.id === formUser?.citizenshipBack
                      )?.image
                    }`}
                    alt="Selected image"
                    width={500}
                    height={500}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <span>
                    {
                      imageOptions?.data?.result?.find(
                        (img: any) => img.id === formUser?.citizenshipBack
                      )?.name
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-right">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditUserProfile;
