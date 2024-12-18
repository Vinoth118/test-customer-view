import axios from "@/utils/axios";
import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

export default function Login({ closeModal, setAuthenticated }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const inputRefs = useRef([]);
  const [showDialog, setShowDialog] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isCompanyNameNotProvided, setIsCompanyNameNotProvided] =
    useState(false);
  const [isNameNotProvided, setIsNameNotProvided] = useState(false);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");

  if (!showDialog) return null;

  const focusNextInput = (index) => {
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleInputChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newValues = [...otpValues];
      newValues[index] = value;
      setOtpValues(newValues);
      focusNextInput(index);
    } else if (value === "") {
      setOtpValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[index] = "";
        return newValues;
      });
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setErrorMessage("Please enter a valid mobile number");
      return;
    }
    setErrorMessage("");

    const response = await axios.post("/customer/generateOtp", {
      phone: phoneNumber,
    });
    if (response.data.success) {
      if (response.data.data.isTestAccount) {
        // Handle test account
        setIsOtpSent(true);
        setIsCompanyNameNotProvided(false);
        setIsNameNotProvided(false);
        toast.success("Test account OTP generated");
      } else {
        // Handle regular account
        setIsCompanyNameNotProvided(response.data.data.isCompanyNameNotProvided);
        setIsNameNotProvided(response.data.data.isNameNotProvided);
        setIsOtpSent(true);
        toast.success("OTP sent successfully");
      }
    } else {
      setErrorMessage("Failed to send OTP, Please contact support");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpValues.join("").length !== 6) {
      setErrorMessage("Please enter a valid OTP");
      return;
    }
    setErrorMessage("");

    const response = await axios.post("/customer/verifyOtp", {
      phone: phoneNumber,
      name: isNameNotProvided ? name : undefined,
      companyName: isCompanyNameNotProvided ? companyName : undefined,
      otp: otpValues.join(""),
    });
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      setCookie("token", response.data.data.token);
      closeModal();
      setAuthenticated(true);
      toast.success("Logged in successfully");
    } else {
      toast.error(response.data.message || "Incorrect OTP");
    }
  };

  const handleChangeMobile = () => {
    setIsOtpSent(false);
    setPhoneNumber("");
    setErrorMessage("");
    setOtpValues(Array(6).fill(""));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {showDialog && (
        <div className="bg-white p-5 md:p-16 shadow-2xl rounded-lg w-full max-w-lg relative">
          <div className="flex items-center justify-center mb-2">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-transparent p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img src="/logo.png" width={65} />
          </div>
          <h2 className="mt-2 mb-6 text-center text-xl md:text-2xl font-bold leading-6 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          {!isOtpSent ? (
            <>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile Number
              </label>
              <div>
                <div className="flex mt-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    +91
                  </span>
                  <input
                    type="text"
                    id="mobile"
                    className="block focus:outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={handleGenerateOTP}
                className="flex mt-4 px-4 py-2 mx-auto justify-center rounded-md bg-indigo-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send OTP
              </button>
            </>
          ) : (
            <div className="flex flex-col">
              {isNameNotProvided && (
                <>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900 mt-4"
                  >
                    Name
                  </label>
                  <div>
                    <div className="flex mt-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        id="name"
                        className="block focus:outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              {isCompanyNameNotProvided && (
                <>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium leading-6 text-gray-900 mt-4"
                  >
                    Company Name
                  </label>
                  <div>
                    <div className="flex mt-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        id="companyName"
                        className="block focus:outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              <label className="block text-xs md:text-sm font-medium leading-6 text-gray-900 mt-4">
                An OTP has sent to +91 {phoneNumber}
                <button
                  className="font-semibold text-indigo-600 hover:text-indigo-500 ml-2"
                  onClick={handleChangeMobile}
                >
                  Change
                </button>
              </label>
              <div className="flex justify-between">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="number"
                    maxLength="1"
                    value={otpValues[index]}
                    className="mt-2 md:w-14 md:h-12 h-8 w-10 border rounded text-center md:text-xl text-lg border-gray-300 focus:border-indigo-500 mr-2"
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <p
                  className="mt-2 text-xs md:text-sm text-red-600"
                  id="email-error"
                >
                  {errorMessage}
                </p>
                <div className="mt-2 text-right text-xs md:text-sm">
                  <button
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                    onClick={handleGenerateOTP}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
              <button
                className="mt-4 block mx-auto bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500"
                onClick={handleVerifyOTP}
              >
                Verify
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
