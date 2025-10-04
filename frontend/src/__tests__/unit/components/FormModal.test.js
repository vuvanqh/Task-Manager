import {render, screen, fireEvent} from "@testing-library/react"
import FormModal from "../../../components/FormModal"
import { MemoryRouter } from "react-router-dom"

describe("Form Modal", () => {
    test("Renders children", () => {
        const fn = jest.fn();  
        render(
            <MemoryRouter>
                <FormModal>
                    Testing Text
                </FormModal>
            </MemoryRouter>
        );

        const text = screen.getByText("Testing Text");
        expect(text).toBeInTheDocument();
    })

    test("Calls handleSubmit on submission", () => {
        const fn = jest.fn((e) => e.preventDefault());
        render(
            <MemoryRouter>
                <FormModal handleSubmit={fn}>
                    Testing Text
                </FormModal>
            </MemoryRouter>
        );
        const form = screen.getByText("Testing Text").closest("form")
        fireEvent.submit(form)
        expect(fn).toHaveBeenCalled();
    })
})