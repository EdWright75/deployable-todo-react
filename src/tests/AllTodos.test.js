import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllTodos from '../Components/AllTodos';
import sampleTodos from '../sampleTodos.json';

describe('AllTodos tests', () => {

  test(`it should render a loading message before the todos are available`, async () => {
    const noData = { todos: [], error: `` };
    render(<MemoryRouter > <AllTodos data={noData} /></MemoryRouter >);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  test(`it should render an error message if todos are not going to be available`, async () => {
    const errorData = { todos: [], error: `Error` };
    render(<MemoryRouter ><AllTodos data={errorData} /></MemoryRouter>);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test(`it should render the correct number of Todo components based on the todo array supplied`, async () => {
    const todoData = { todos: sampleTodos, error: `` };
    render(<MemoryRouter ><AllTodos data={todoData} /></MemoryRouter>);

    const rows = await screen.findAllByText(/Sample Todo/i);
    expect(rows.length).toBe(4);
  });

  test(`it should render a single row when no todos are returned from the server without an error`, async () => {
    render(<MemoryRouter ><AllTodos data={{ todos: [], error: `There are no todos previously stored` }} /></MemoryRouter>);

    const rows = await screen.findByText(/there are no todos previously stored/i);
    expect(rows).toBeInTheDocument();
  });
});