import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../asyncFunctions/todoAPICalls'); // This needs to be here for the Amplify Tests to work...

import App from '../App';
import * as api from '../asyncFunctions/todoAPICalls';

import sampleTodos from '../sampleTodos.json';



describe('App Tests', () => {

  afterEach(() => jest.resetAllMocks());

  describe('App pre and after data return render Tests', () => {

    const expectedReturn = ({ todos: [], status: 204, error: { type: `get`, message: `Deliberate Get Error` } });

    test('should render "Data is loading" on initial render', async () => {
      api.getTodos.mockImplementation(() => { });
      render(<MemoryRouter><App /></MemoryRouter>);
      expect(await screen.findByText(/data is loading/i)).toBeInTheDocument();

    });

    test('should render "No Todos" message if empty array returned from server', async () => {
      api.getTodos.mockImplementation(() => expectedReturn);
      render(<MemoryRouter><App /></MemoryRouter>);
      const getErrorRender = await screen.findAllByText(`There was a problem getting the todos: ${expectedReturn.error.message}`);
      expect(getErrorRender.length).toBeGreaterThan(0);
    });

    test('should close the get error modal on click', async () => {
      api.getTodos.mockImplementation(() => expectedReturn);
      render(<MemoryRouter><App /></MemoryRouter>);
      const closeModal = await screen.findByText(/close/i);
      userEvent.click(closeModal);

      expect(closeModal).not.toBeInTheDocument();
    });

    test('should remove the post error modal when post error is reset', async () => {
      api.getTodos.mockImplementation(() => { return { todos: sampleTodos } });
      api.submitTodo.mockImplementation(() => { return { status: 400, error: { type: `post`, message: `Post error` } } });
      render(<MemoryRouter><App /></MemoryRouter>);
      const addLink = screen.getByText(/add todo/i);
      userEvent.click(addLink);
      const descInput = screen.getByPlaceholderText(/todo description/i);
      userEvent.type(descInput, sampleTodos[0].todoDescription);
      const submitButton = screen.getByDisplayValue(/submit/i)
      userEvent.click(submitButton);

      const closeModal = await screen.findByText(/close/i);
      userEvent.click(closeModal);

      expect(closeModal).not.toBeInTheDocument();
    });

    test('should remove the put error modal when put error is reset', async () => {
      api.getTodos.mockImplementation(() => { return { todos: sampleTodos } });
      api.updateTodo.mockImplementation(() => { return { status: 400, error: { type: `put`, message: `Put error` } } });
      render(<MemoryRouter><App /></MemoryRouter>);

      const editLinks = await screen.findAllByText(/edit/i);
      // userEvent.click(editLinks[0]);
      await fireEvent.click(editLinks[0]);
      screen.debug()
      // const submitButton = await screen.findByDisplayValue(/submit/i);
      // expect(submitButton).toBeInTheDocument();
      // userEvent.click(submitButton);

      // const closeModal = await screen.findByText(/close/i);
      // userEvent.click(closeModal);

      // expect(closeModal).not.toBeInTheDocument();
    });
  });

  describe('Submit todo and update todo render tests', () => {

    describe('handler call tests', () => {
      test('should call submitTodo in App when adding a new todo', async () => {

        render(<MemoryRouter><App /></MemoryRouter>);

        const addLink = screen.getByText(/add todo/i);
        fireEvent.click(addLink);   // fireEvent wraps the act(() =>) which await waitFor(()=>) wraps

        const descInput = await screen.findByPlaceholderText(/todo description/i);
        userEvent.type(descInput, sampleTodos[0].todoDescription);

        const submitButton = screen.getByDisplayValue(/submit/i)
        fireEvent.click(submitButton);

        await screen.findByText(/todo added/i);  // Need this to let the component settle

        expect(api.submitTodo).toHaveBeenCalledTimes(1);
        expect(api.submitTodo).toHaveBeenCalledWith({
          todoDescription: sampleTodos[0].todoDescription,
          todoDateCreated: expect.any(String),
          todoCompleted: false,
          _id: null
        });
      });

      xtest('should call updateTodo in App when updating a new todo', async () => {

        const expectedReturn = { todos: sampleTodos };

        api.getTodos.mockImplementation(() => expectedReturn);
        api.updateTodo.mockImplementation(() => { return { todo: sampleTodos[2], status: 201 } });

        render(<MemoryRouter><App /></MemoryRouter>);

        const editLinks = await screen.findAllByText(/edit/i);
        fireEvent.click(editLinks[0]);
        // const submitButton = await screen.findByDisplayValue(/submit/i)
        // userEvent.click(submitButton);

        // await screen.findByText(/todo updated/i);

        // expect(api.updateTodo).toHaveBeenCalledTimes(1);
        // expect(api.updateTodo).toHaveBeenCalledWith(sampleTodos[2]);
      });

      xtest('should close the create modal after updating a todo', async () => {
        const expectedReturn = { todos: sampleTodos };

        api.getTodos.mockImplementation(() => expectedReturn);
        api.updateTodo.mockImplementation(() => { return { todo: sampleTodos[2], status: 201 } });

        render(<MemoryRouter><App /></MemoryRouter>);

        const editLinks = await screen.findAllByText(/edit/i);
        // userEvent.click(editLinks[0]);
        fireEvent.click(editLinks[0]);
        // const submitButton = await screen.findByDisplayValue(/submit/i)
        // userEvent.click(submitButton);

        // const closeModal = await screen.findByText(/close/i);
        // userEvent.click(closeModal);

        // expect(closeModal).not.toBeInTheDocument();
      });

      xtest('should close the create modal after adding a todo', async () => {
        const expectedReturn = { todos: sampleTodos };

        api.getTodos.mockImplementation(() => expectedReturn);
        api.submitTodo.mockImplementation(() => { return { todo: sampleTodos[2], status: 201 } });

        render(<MemoryRouter><App /></MemoryRouter>);

        const editLinks = await screen.findAllByText(/edit/i);
        userEvent.click(editLinks[0]);
        
        const submitButton = await screen.findByDisplayValue(/submit/i);
        userEvent.click(submitButton);

        const closeModal = await screen.findByText(/close/i);
        userEvent.click(closeModal);

        expect(closeModal).not.toBeInTheDocument();
      });
    });

    describe('submit/update error tests', () => {

      test('should render post error message', async () => {

        api.submitTodo.mockImplementation(() => { return { error: { type: `post`, message: `Post error` } } });
        render(<MemoryRouter><App /></MemoryRouter>);

        const addLink = screen.getByText(/add todo/i);
        userEvent.click(addLink);
        const descInput = screen.getByPlaceholderText(/todo description/i);
        userEvent.type(descInput, sampleTodos[0].todoDescription);
        const submitButton = screen.getByDisplayValue(/submit/i)
        userEvent.click(submitButton);

        const postErrors = await screen.findAllByText(/there was a problem adding the todo: post error/i);

        expect(postErrors.length).toBeGreaterThan(0);
      });

      xtest('should render a Put error message', async () => {
        const expectedReturn = { todos: sampleTodos };

        api.getTodos.mockImplementation(() => expectedReturn);
        api.updateTodo.mockImplementation(() => { return { error: { type: `put`, message: `Put error` } } });

        render(<MemoryRouter><App /></MemoryRouter>);

        const editLinks = await screen.findAllByText(/edit/i);
        fireEvent.click(editLinks[0]);
        const submitButton = await screen.findByDisplayValue(/submit/i)
        userEvent.click(submitButton);

        const putError = await screen.findByText(/there was a problem updating the todo: put error/i);

        expect(putError).toBeInTheDocument();
      });
    });
  });
});