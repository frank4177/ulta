import '@testing-library/jest-dom'
import { screen, render } from "@testing-library/react"
import Button from './Button'


test("Renders button element", () => {
    render(<Button />)
    const buttonEl = screen.getByRole("button")
    expect(buttonEl).toBeInTheDocument()
})

