import { getByLabelText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../Components/TodoForm';

// Provide mock implementation for DateCreated component
jest.mock("../Components/utils/DateCreated", () => {
    return function MockDateCreated() {
        return <span data-testid="dateCreated">Date Created Component</span>
    }
});

describe(`TodoForm test suite`, () => {

    const mockSubmitAction = jest.fn();

    describe(`Todo form render tests - adding a todo`, () => {

        const testTodo = {};

        beforeEach(() => {
            render(<TodoForm submitAction={mockSubmitAction} todo={testTodo} />);
        });

        describe('Add todo render tests', () => {


            test(`it should render a Description input and label`, () => {
                expect(screen.getByPlaceholderText(/todo description/i)).toBeInTheDocument();
            });

            test(`it should not render a Completed input and label`, () => {
                expect(screen.queryByRole(/checkbox/)).not.toBeInTheDocument();
            });

            test(`it should render a DateCreated component a date`, () => {

                expect(screen.getByTestId(`dateCreated`).textContent).toContain(`Date Created Component`);
            });

            test(`it should render a Submit button`, () => {
                expect(screen.getByText(`Submit`)).toBeInTheDocument();
            });
        });

        describe(`Add todo - manipulation tests`, () => {

            test(`it should render the new value in the input when the todoDescription is updated`, () => {
                const testDesc = `Test description`;
                const descInput = screen.getByPlaceholderText(/todo description/i);

                userEvent.type(descInput, testDesc);

                expect(descInput).toHaveValue(testDesc);
            });

            test(`should enable the submit button when the todo description is populated`, () => {
                const testDesc = `Test description`;
                const descInput = screen.getByPlaceholderText(/todo description/i);
                const submitBtn = screen.getByDisplayValue(/submit/i);

                expect(submitBtn).toBeDisabled();

                userEvent.type(descInput, testDesc);

                expect(submitBtn).not.toBeDisabled();
            });
        });

        describe(`Form submission tests`, () => {

            test(`test the submitTodo prop function is called when submit button is clicked`, () => {

                const testDesc = `Test description`;
                const descInput = screen.getByPlaceholderText(/todo description/i);
                const submitBtn = screen.getByDisplayValue(/submit/i);

                userEvent.type(descInput, testDesc);
                userEvent.click(submitBtn);

                expect(mockSubmitAction).toHaveBeenCalledTimes(1);
                expect(mockSubmitAction).toHaveBeenCalledWith(testDesc, null, false, undefined);
            });
        });
    });

    describe(`Form render and manipulation tests - edit todo`, () => {

        const testTodo = {
            _id: "5cc08495bf3fd62d03f2f4c1",
            todoDescription: "Sample Todo 1",
            todoDateCreated: "2019-05-04T15:00:00.000Z",
            todoCompleted: false
        }

        beforeEach(() => {
            render(<TodoForm submitAction={mockSubmitAction} todo={testTodo} />);
        });

        test(`it should render the new value in the checkbox when the todoCompleted onChange function is activated`, () => {

            const completedCkbx = screen.getByRole(/checkbox/);
            expect(completedCkbx).not.toBeChecked();

            userEvent.click(completedCkbx);

            expect(completedCkbx).toBeChecked();

        });

        test('should should render the date created supplied when editing a todo', () => {

            const displayedDateCreated = `${new Date(testTodo.todoDateCreated).toLocaleDateString()} @ ${new Date(testTodo.todoDateCreated).toLocaleTimeString()}`;

            const dateCreated = screen.getByTitle(/tododatecreated/i);

            expect(dateCreated.textContent).toContain(displayedDateCreated);
        });

    });
});