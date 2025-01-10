/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { message } from "antd/lib";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { email }
      );
      if (response.data.success) {
        message.success("Reset code sent to your email!");
        setStep(2);
      } else {
        message.error("Error: " + response.data.message);
      }
    } catch (error) {
      message.error("Failed to send reset code. Please try again.");
      console.error("Error sending reset code:", error);
    }

    setIsLoading(false);
  };

  const handleResetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          email,
          otp,
          password: newPassword,
        }
      );

      if (response.data.success) {
        message.success("Password reset successful! You can now log in.");
        router.push('/auth/signin')
      } else {
        message.error("Failed to reset password. " + response.data.message);
      }
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
      console.error("Error resetting password:", error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center p-2 sm:px-8 md:px-16 lg:px-32 py-8 lg:py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-vector/web-icon-background-computer-vector-icon-background_645658-707.jpg?w=1800')",
          }}
        ></div>
        <div className="relative p-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-16 bg-opacity-20">
          <div className="flex flex-col justify-center items-center">
            <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-4" />
            <h1 className="text-lg lg:text-2xl font-medium lg:font-bold mb-2 text-center">
              Empower Agriculture. Evolve your workforce
            </h1>
            <p className="hidden md:block text-sm lg:text-base text-gray-600 text-center">
              Optimize your agricultural operations with a cutting-edge system.
              Simplify crop management, monitor growing metrics, and cultivate
              innovation for sustainable farming practices.
            </p>
          </div>
          <div className="p-2 lg:p-8">
            <div className="mb-4 lg:mb-8 text-center">
              <h1 className="text-2xl font-bold mb-4">
                {step === 1 ? "Forgot Password" : "Enter Reset Code"}
              </h1>
              <p className="text-gray-600">
                {step === 1
                  ? "Enter your email address, and we'll send you a reset code."
                  : "Enter the reset code sent to your email and set your new password."}
              </p>
            </div>
            {step === 1 && (
              <form onSubmit={handleEmailSubmit}>
                <div className="relative mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 outline-none sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleResetSubmit}>
                <div className="relative mb-6">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reset Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 outline-none sm:text-sm"
                  />
                </div>
                <div className="relative mb-6">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 outline-none sm:text-sm"
                  />
                </div>
                <div className="relative mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <ToastContainer />
    </>
  );
}
