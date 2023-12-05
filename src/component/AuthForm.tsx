import React, { useState } from "react";
import Button from "./Button";
import { useVerifyCredentials } from "../services/APIs/verifyCredentials";
import ResponseMessage from "./ResponseMessage";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux/store";

interface IFormProp {
  type?: string;
  maxlength?: number;
}

const Form = ({ type, maxlength }: IFormProp) => {
  const twitterData = useSelector((state: RootState) => state?.user?.twitter);
  const typeprop = type ? type : "text";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [otpConfirmationCode, setOtpConfirmationCode] = useState<string>("");
  const {
    trigger: verifyCredentials,
    isError,
    isMutating,
    setError
  } = useVerifyCredentials();


  // Handle input change function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any previous error messages
    setErrorMessage("");
    setError("")

    // Limit the input based on the specified maxlength.
    const limit = maxlength;
    setOtpConfirmationCode(e.target.value.slice(0, limit));
  };


  // Handle OTP submit function
  const handleSumbmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    // Validate the OTP input before submission
    if (otpConfirmationCode?.length === 0) {
      // if the input field is empty:
      setErrorMessage("Please enter OTP");
    } else if (otpConfirmationCode && otpConfirmationCode?.length < 5) {
      // if the input is less than five:
      setErrorMessage("Please enter complete OTP");
    } else {
      // verifyCredential params
      const verifyCredentialParam = {
        twitterData: twitterData,
        otpConfirmationCode: otpConfirmationCode,
      };
      // Verify credentials and submit inputted OTP.
      verifyCredentials(verifyCredentialParam);
    }
  };


  return (
    <>
      <form className="form" onSubmit={(e) => handleSumbmit(e)}>
        {/* INPUT FORM */}
        <input
          type={typeprop}
          placeholder="Enter 5 digit OTP"
          className="form__input"
          onChange={(e) => handleChange(e)}
          readOnly={isMutating ? true : false}
          value={otpConfirmationCode}
        />

        <Button title={isMutating ? "Submitting..." : "Submit"} />

        {isError && !errorMessage ? (
          <ResponseMessage message="Failed to authenticate OTP" />
        ) : null}
        {errorMessage ? <ResponseMessage message={errorMessage} /> : null}
      </form>
    </>
  );
};

export default Form;
