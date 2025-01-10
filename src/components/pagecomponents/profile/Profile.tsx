/* eslint-disable react/no-unescaped-entities */
import { PrimaryButton } from "@/components/globalcomponents/Button";
import useFetchData from "@/hook/useFetchData";
import { IProfile } from "@/utils/interface";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import AddFarmerKYCModal from "../farmerskycpage/AddAdminFarmerKycModal";

const Profile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchedData: imagesData } = useFetchData("/imageupload");

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
      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]); // Added session as dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <p className="text-center text-lg text-red-500">
          No profile data available. (प्रोफाइल डेटा उपलब्ध छैन।)
        </p>
        <PrimaryButton
          buttonName="Set Up Your Profile (तपाईंको प्रोफाइल सेट अप गर्नुहोस्)"
          navigateTo="/setup-profile"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-end mb-4">
          <PrimaryButton
            buttonName="Edit Profile (प्रोफाइल सम्पादन गर्नुहोस्)"
            navigateTo="/edit-profile"
          />
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {profile?.picture?.id ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${
                  imagesData?.data?.result?.find(
                    (img: any) => img.id === profile?.picture?.id
                  )?.image
                }`}
                alt="Profile Picture"
                width={96}
                height={96}
                className="rounded-lg border-4 border-gray-300 shadow-lg w-40 h-40 object-cover"
              />
            ) : (
              <div className="rounded-full border-4 border-gray-300 shadow-lg w-24 h-24 flex items-center justify-center">
                <FaUser size={32} />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h2>
        </div>

        {/* Personal Information Section */}
        <h3 className="text-lg font-semibold mt-6">
          Personal Information (व्यक्तिगत जानकारी)
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="font-medium">Name (नाम):</span>
            <p>{`${profile.firstName} ${profile.lastName}`}</p>
          </div>
          <div>
            <span className="font-medium">Date of Birth (जन्म मिति):</span>
            <p>{new Date(profile.dob).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium">Gender (लिङ्ग):</span>
            <p>{profile?.gender}</p>
          </div>
          <div>
            <span className="font-medium">Address (ठेगाना):</span>
            <p>{`${profile.address?.tole}, ${profile.address?.district}, ${profile.address?.pradesh}`}</p>
          </div>
          <div>
            <span className="font-medium">Skills (सीपहरू):</span>
            <p>{profile.skills.join(", ")}</p>
          </div>
          <div>
            <span className="font-medium">Education (शिक्षा):</span>
            <p>{profile.education.join(", ")}</p>
          </div>
        </div>

        {/* Temporary Address Section */}
        <h3 className="text-lg font-semibold mt-6">
          Temporary Address (अस्थायी ठेगाना)
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="font-medium">Ward (वार्ड):</span>
            <p>{profile.temporaryAddress?.ward || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">Tole (टोले):</span>
            <p>{profile.temporaryAddress?.tole || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">District (जिल्ला):</span>
            <p>{profile?.temporaryAddress?.district || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">Pradesh (प्रदेश):</span>
            <p>{profile?.temporaryAddress?.pradesh || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">Municipality (नगरपालिका):</span>
            <p>
              {profile?.temporaryAddress?.municipality || "N/A (उपलब्ध छैन)"}
            </p>
          </div>
        </div>

        {/* Permanent Address Section */}
        <h3 className="text-lg font-semibold mt-6">
          Permanent Address (स्थायी ठेगाना)
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="font-medium">Ward (वार्ड):</span>
            <p>{profile.address?.ward || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">Tole (टोले):</span>
            <p>{profile.address?.tole || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">District (जिल्ला):</span>
            <p>{profile?.address?.district || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">Pradesh (प्रदेश):</span>
            <p>{profile?.address?.pradesh || "N/A (उपलब्ध छैन)"}</p>
          </div>
          <div>
            <span className="font-medium">Municipality (नगरपालिका):</span>
            <p>{profile?.address?.municipality || "N/A (उपलब्ध छैन)"}</p>
          </div>
        </div>

        {/* Farmer's KYC Section */}
        {/* Uncomment the KYC Section if needed */}
        {/* <h3 className="text-lg font-semibold mt-6">Farmer's KYC (किसानको KYC)</h3>
        {profile.farmkersKyc ? (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-medium">Area (क्षेत्र):</span>
              <p>{profile.farmkersKyc?.area}</p>
            </div>
            <div>
              <span className="font-medium">Fertile Soil (उर्वर माटो):</span>
              <p>{profile.farmkersKyc?.fertileSoil}</p>
            </div>
            <div>
              <span className="font-medium">Unfertile Soil (उर्वर माटो नभएको):</span>
              <p>{profile.farmkersKyc?.unfertileSoil}</p>
            </div>
            <div>
              <span className="font-medium">Is On Lease (भाडामा छ?):</span>
              <p>{profile.farmkersKyc?.isOnLease ? "Yes (हो)" : "No (होइन)"}</p>
            </div>
            <div>
              <span className="font-medium">Has Road Access (सड़क पहुँच छ?):</span>
              <p>{profile.farmkersKyc?.hasRoadAccess ? "Yes (हो)" : "No (होइन)"}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-lg text-red-500">
              KYC information not found. (KYC जानकारी भेटिएन।)
            </p>
            <AddFarmerKYCModal />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Profile;
