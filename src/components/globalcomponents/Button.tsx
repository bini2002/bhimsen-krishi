import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

type ButtonProps = {
  buttonName: string;
  onClick?: () => void;
  navigateTo?: string;
};

export const PrimaryButton: React.FC<ButtonProps> = ({
  buttonName,
  onClick,
  navigateTo,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (navigateTo) {
      router.push(navigateTo);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-primary text-white rounded-lg"
    >
      {buttonName}
    </button>
  );
};

export const GoBackButton: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center space-x-2 mb-4 text-primary"
    >
      <FaArrowLeft />
      <span>फिर्ता जानुहोस्</span>
    </button>
  );
};
