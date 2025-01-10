/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error("Login failed: " + "Something went wrong. Please try again.");
      console.error("Login failed:", res?.error || "Unknown error");
    }

    setIsLoading(false);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center sm:px-8 md:px-16 lg:px-32 py-8 lg:py-16">
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
              <h1 className="text-2xl font-bold mb-4">Sign In</h1>
              <p className="text-gray-600">
                Enter your credentials to access your account.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
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
              <div className="relative mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none outline-none sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <FaEye className="text-gray-500 hover:text-gray-800" />
                    ) : (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-800" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right mb-6">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot password?
                </Link>
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
                    "Log in"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
