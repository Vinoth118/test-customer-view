import axios from "@/utils/axios";
import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

export default function EmailLogin({ setAuthenticated, handleEmailUpdate, closeModal }) {
    const [emailAddress, setemailAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [otpValues, setOtpValues] = useState(Array(6).fill(""));
    const [isOtpSent, setIsOtpSent] = useState(false);
    const inputRefs = useRef([]);
    const [showDialog, setShowDialog] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

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
        const response = await axios.post("/customer/updateEmail", {
            email: emailAddress,
        });
        if (response.data.success) {
            setIsOtpSent(true);
            setOtpValues(Array(6).fill(""));
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        // Check if OTP is complete
        if (otpValues.join("").length !== 6) {
            setErrorMessage("Please enter a valid OTP");
            return;
        }

        setErrorMessage(""); // Clear previous error messages

        try {
            const response = await axios.post("/customer/verifyEmail", {
                email: emailAddress,
                otp: otpValues.join(""), // Join OTP values into a single string
            });

            if (response.data.success) {
                toast.success("Email verified successfully");
                localStorage.setItem("token", response.data.data.token);
                setCookie("token", response.data.data.token);
                closeModal();
                setAuthenticated(true);
                handleEmailUpdate(emailAddress); // Update email in Profile component
            } else {
                setErrorMessage("Failed to verify OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setErrorMessage("Failed to verify OTP. Please try again.");
        }
    };

    const handleChangeMobile = () => {
        setIsOtpSent(false);
        setemailAddress("");
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
                    </div>
                    <h2 className="mt-2 mb-6 text-center text-xl md:text-2xl font-bold leading-6 tracking-tight text-gray-900">
                        Update your email
                    </h2>
                    {!isOtpSent ? (
                        <>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email Address
                            </label>
                            <div>
                                <div className="flex mt-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="email"
                                        id="email"
                                        className="block focus:outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        value={emailAddress}
                                        onChange={(e) => setemailAddress(e.target.value)}
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
                            <label className="block text-xs md:text-sm font-medium leading-6 text-gray-900">
                                An OTP has been sent to {emailAddress}
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
                                    <button className="font-semibold text-indigo-600 hover:text-indigo-500">
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
