/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";

// Define the interface for props
interface Document {
  url: string;
  name: string;
}

interface UserProfileProps {
  photo: string;
  name: string;
  gender: string;
  dob: string;
  nationality: string;
  address: string;
  country: string;
  phoneNumber: string;
  email: string;
  documents: Document[]; // List of document URLs and names
}
const UserProfile: React.FC<UserProfileProps> = ({
  photo,
  name,
  gender,
  dob,
  nationality,
  address,
  country,
  phoneNumber,
  email,
  documents,
}) => {
  return (
    <section className="p-4 lg:p-0">
      <h1 className="text-xl lg:text-2xl font-medium mb-4">User Profile</h1>
      <div className="bg-white rounded-xl shadow p-4 lg:p-8 grid lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="grid md:grid-cols-2 gap-4 gap-y-6">
          <div>
            <h1 className="text-primary lg:text-lg font-medium mb-2 lg:mb-4">
              Personal Details
            </h1>
            <Image
              src={photo}
              alt=""
              width={500}
              height={500}
              className="bg-blue-50 w-60 h-72 rounded-xl object-cover"
            />
          </div>
          <div className="flex items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium  mb-4">{name}</p>
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="font-medium  mb-4">{gender}</p>
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="font-medium  mb-4">{dob}</p>
              <p className="text-sm text-gray-500 mb-1">Nationality</p>
              <p className="font-medium ">{nationality}</p>
            </div>
          </div>
          <div>
            <h1 className="text-primary lg:text-lg font-medium mb-2 lg:mb-4">
              Address
            </h1>
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <p className="font-medium  mb-4">{address}</p>
            <p className="text-sm text-gray-500 mb-1">Country</p>
            <p className="font-medium  mb-4">{country}</p>
          </div>
          <div>
            <h1 className="text-primary lg:text-lg font-medium mb-2 lg:mb-4">
              Contact
            </h1>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="font-medium  mb-4">{phoneNumber}</p>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-medium  mb-4">{email}</p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h1 className="text-primary lg:text-lg font-medium mb-2 lg:mb-4">
            Submitted Documents
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={doc.url}
                  alt={doc.name}
                  width={500}
                  height={500}
                  className="w-full h-auto max-h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">{doc.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
