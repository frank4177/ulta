import "@testing-library/jest-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import Form from "../component/AuthForm";
import { MemoryRouter } from "react-router-dom";
import { store } from "../services/redux/store";
import { Provider } from "react-redux";

const MockAuthForm = () => {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <Form />
      </MemoryRouter>
    </Provider>
  );
};

test("input should be empty", () => {
  render(<MockAuthForm />);
  const otpInputEl = screen.getByPlaceholderText(
    /Enter 5 digit OTP/i
  ) as HTMLInputElement;
  expect(otpInputEl.value).toBe("");
});



test("input should change", () => {
  render(<MockAuthForm />);
  const testValue = "test";
  const otpInputEl = screen.getByPlaceholderText(
    /Enter 5 digit OTP/i
  ) as HTMLInputElement;

  fireEvent.change(otpInputEl, { target: { value: testValue } });
  expect(otpInputEl.value).toBe(testValue);
});
