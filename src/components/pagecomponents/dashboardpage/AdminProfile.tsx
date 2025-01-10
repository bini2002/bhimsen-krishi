import { useSession } from "next-auth/react";
import { Avatar, Button } from "antd/lib";
import { FaBirthdayCake, FaHome, FaPhoneAlt } from "react-icons/fa";
import useFetchData from "@/hook/useFetchData";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { IAddress } from "@/utils/interface";
import Image from "next/image";

export default function AdminProfile() {
  const { data: session } = useSession();
  const { fetchedData: imageData } = useFetchData(
    `/imageupload/${session?.user?.image}`
  );
  const { fetchedData: MyProfile } = useFetchData("/profile/user/my-profile");
  const router = useRouter();

  const getAvatarContent = () => {
    if (imageData?.data?.image) {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${imageData.data.image}`;
      return (
        <div className="relative w-32 h-32">
          <Image
            src={imageUrl}
            alt="User Avatar"
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      );
    }

    if (session?.user?.name) {
      return (
        <Avatar
          size={128}
          style={{ fontSize: "64px" }}
          className="uppercase bg-green-600"
        >
          {session.user.name === "undefined"
            ? "G"
            : session.user.name.charAt(0)}
        </Avatar>
      );
    }

    return (
      <Avatar
        size={128}
        style={{ fontSize: "64px" }}
        icon={<FaBirthdayCake />}
      />
    );
  };

  const handleSetUpProfile = () => {
    router.push("/setup-profile");
  };

  const formatAddress = (address: IAddress) => {
    if (!address) return "";
    return `Ward ${address.ward || ""}, ${address.tole || ""}, ${
      address.district || ""
    }`;
  };

  return (
    <div className="bg-white rounded border p-2 lg:p-4 hidden lg:block">
      <h1 className="lg:text-lg font-medium">प्रोफाइल</h1>
      <div className="flex items-center justify-center">
        {getAvatarContent()}
      </div>
      <h2 className="font-medium text-center mt-2">
        {session?.user?.name === "undefined"
          ? "Guest"
          : `${session?.user.name} ${MyProfile?.data?.lastName}`}
      </h2>
      <p className="text-center text-gray-600">
        <small>{session?.user?.email}</small>
      </p>
      <hr className="my-2" />

      {/* Check if MyProfile indicates profile not found */}
      {!MyProfile ||
      (MyProfile?.success === false &&
        MyProfile?.message === "profile not found.") ? (
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className="bg-blue-600 text-white"
            onClick={handleSetUpProfile}
          >
            Set Up Profile
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {MyProfile?.data?.phone && (
            <li className="flex items-center space-x-2">
              <FaPhoneAlt className="text-primary" />
              <span className="text-gray-700">{MyProfile.data.phone}</span>
            </li>
          )}
          {MyProfile?.data?.address && (
            <li className="flex items-center space-x-2">
              <FaHome className="text-primary" />
              <span className="text-gray-700">
                {formatAddress(MyProfile.data.address)}
              </span>
            </li>
          )}
          {MyProfile?.data?.dob && (
            <li className="flex items-center space-x-2">
              <FaBirthdayCake className="text-primary" />
              <span className="text-gray-700">
                {dayjs(MyProfile.data.dob).format("MMMM D, YYYY")}
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
