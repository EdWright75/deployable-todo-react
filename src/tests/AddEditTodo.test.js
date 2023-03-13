import { render, screen } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import sampleTodos from '../sampleTodos.json';

import AddEditTodo from '../Components/AddEditTodo';

// Provide mock implementation for DateCreated component
jest.mock("../Components/utils/DateCreated", () => {
    return function MockDateCreated() {
        return <span data-testid="dateCreated">Date Created Component</span>
    }
});

jest.mock("../Components/utils/generateId", () => () => `test_id`);

describe(`Tests for AddEditTodo`, () => {

    const mockSubmit = jest.fn(() => { });

    describe('Testing Add Todo rendering and functionality', () => {

        beforeEach(() => {
            const routes = [
                {
                    path: "/add",
                    element: <AddEditTodo submitAction={mockSubmit} />
                },
                {
                    path: "/",
                    element: <p>Redirected</p>
                }
            ];

            const router = createMemoryRouter(routes, {
                initialEntries: [`/add`],
                initialIndex: 0
            });

            render(<RouterProvider router={router} />);
        });


        test(`it should render a h3 with 'Add Todo' when no todo is supplied`, async () => {
            const addTodoHeading = screen.getByText(/add todo/i);
            expect(addTodoHeading).toBeInTheDocument();
        });

        test(`it should render a TodoForm`, () => {
            const form = document.querySelector(`form`);
            expect(form).toBeTruthy();
        });

        test(`it should call mockSubmit when the form is submitted`, async () => {

            const testDesc = `Edited description`;
            const submittedTodo = { todoDescription: testDesc, todoCompleted: false, todoDateCreated: `1970-01-01T00:00:00.000Z`, _id: null };

            const descInput = screen.getByPlaceholderText(/todo description/i);

            userEvent.clear(descInput);
            userEvent.type(descInput, testDesc);

            const submitBtn = await screen.getByRole(/button/i);

            userEvent.click(submitBtn);

            expect(mockSubmit).toHaveBeenCalledTimes(1);
            expect(mockSubmit).toHaveBeenCalledWith(submittedTodo);
        });

        test(`it should render "Redirected" when submitted is set to true`, async () => {

            const testDesc = `Edited description`;
            const submittedTodo = { todoDescription: testDesc, todoCompleted: false, todoDateCreated: `1970-01-01T00:00:00.000Z`, _id: null };

            const descInput = screen.getByPlaceholderText(/todo description/i);

            userEvent.clear(descInput);
            userEvent.type(descInput, testDesc);

            const submitBtn = await screen.getByRole(/button/i);

            userEvent.click(submitBtn);

            const redirectedParagraph = await screen.getByText(/redirected/i);

            expect(redirectedParagraph).toBeInTheDocument();

        });
    });

    describe('Testing Edit Todo rendering and functionality', () => {

        beforeEach(() => {
            const routes = [
                {
                    path: "/edit/:_id",
                    element: <AddEditTodo submitAction={mockSubmit} data={sampleTodos} />
                },
                {
                    path: "/",
                    element: <></>
                }
            ];

            const router = createMemoryRouter(routes, {
                initialEntries: [`/edit/${sampleTodos[0]._id}`],
                initialIndex: 0
            });

            render(<RouterProvider router={router} />);
        });

        test(`it should render a h3 with 'Add Todo' when no todo is supplied`, async () => {
            const addTodoHeading = screen.getByText(/edit todo/i);
            expect(addTodoHeading).toBeInTheDocument();
        });

        test(`it should render a TodoForm with values populated`, () => {
            const descInput = screen.getByDisplayValue(sampleTodos[0].todoDescription);
            const completedInput = screen.getByRole(`checkbox`);

            expect(descInput).toBeInTheDocument();
            expect(completedInput.checked).toBe(sampleTodos[0].todoCompleted);
        });

        test(`it should call mockSubmit when the form is submitted`, async () => {

            const testDesc = `Edited description`;
            const submittedTodo = { ...sampleTodos[0], todoDescription: testDesc };

            const descInput = screen.getByDisplayValue(sampleTodos[0].todoDescription);

            userEvent.clear(descInput);
            userEvent.type(descInput, testDesc);

            const submitBtn = await screen.findByRole(/button/i);

            userEvent.click(submitBtn);

            expect(mockSubmit).toHaveBeenCalledTimes(1);
            expect(mockSubmit).toHaveBeenCalledWith(submittedTodo);
        });


    });

    describe('Testing Edit Todo error and modal functionality', () => {

        beforeEach(() => {
            const routes = [
                {
                    path: "/edit/:_id",
                    element: <AddEditTodo submitAction={mockSubmit} data={sampleTodos} />
                },
                {
                    path: "/",
                    element: <></>
                }
            ];

            const router = createMemoryRouter(routes, {
                initialEntries: [`/edit/notAnId`, `/`],
                initialIndex: 0
            });

            render(<RouterProvider router={router} />);
        });

        test('should render the Modal with the message "Todo could not be found" if the todo id is not in the data array', () => {
            const modalText = screen.getByText(/todo could not be found/i);
            expect(modalText).toBeInTheDocument();
        });

        test('should remove the Modal with the message "Todo could not be found" when the Close button is clicked', () => {
            const modalText = screen.getByText(/todo could not be found/i);
            const modalCloseButton = screen.getByText(/close/i);

            userEvent.click(modalCloseButton);

            expect(modalText).not.toBeInTheDocument();
        });
    });
});
