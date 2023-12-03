import React, { useState } from "react";
import Button from "./Button";
import { useGetCredentials } from "../services/APIs/getCredentials";
import ResponseMessage from "./ResponseMessage";

interface IFormProp {
  type?: string;
  maxlength?: number;
}

const Form = ({ type, maxlength }: IFormProp) => {
  const typeprop = type ? type : "text";
  const { trigger: getCredentials, isError, isMutating } = useGetCredentials();
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Custom hook for getting user credentials
  const [otpConfirmationCode, setOtpConfirmationCode] = useState<any>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any previous error messages
    setErrorMessage("");

    // Limit the input based on the specified maxlength
    const limit = maxlength;
    setOtpConfirmationCode(e.target.value.slice(0, limit));
  };

  const handleSumbmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    // Validate the OTP input before submission
    if (otpConfirmationCode?.length === 0) {
      setErrorMessage("Please enter OTP");
    } else if (otpConfirmationCode.length < 5) {
      setErrorMessage("Please enter complete OTP");
    } else {
      // Submit the OTP for authentication
      getCredentials(otpConfirmationCode);
    }
  };

  return (
    <>
      <form className="form" onSubmit={(e) => handleSumbmit(e)}>
        <input
          type={typeprop}
          placeholder="Enter 5 digit OTP"
          className="form__input"
          onChange={(e) => handleChange(e)}
          readOnly={isMutating ? true : false}
          value={otpConfirmationCode}
        />
        <Button title={isMutating ? "Submitting..." : "Submit"} />
        {isError && !isMutating ? (
          <ResponseMessage message="Failed to authenticate OTP" />
        ) : null}
        {errorMessage ? <ResponseMessage message={errorMessage} /> : null}
      </form>
    </>
  );
};

export default Form;
