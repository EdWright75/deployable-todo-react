import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './Components/Header';
import Footer from './Components/Footer';
import AllTodos from './Components/AllTodos';
import AddEditTodo from './Components/AddEditTodo';
import Modal from './Components/utils/Modal';
import NotFound from './Components/utils/NotFound';

import { getTodos, submitTodo, updateTodo } from './asyncFunctions/todoAPICalls.js';

import './Components/css/df.css';

function App() {

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState({ type: ``, message: ``, modalShown: false })
  const [createUpdateStatus, setCreateUpdateStatus] = useState(``);

  const getTodosHandler = async () => {
    const externalDataCallResult = await getTodos();
    console.log(externalDataCallResult.error);
    if (externalDataCallResult?.error) {
      const errorObject = { ...externalDataCallResult.error, modalShown: false };
      errorObject.message = `There was a problem getting the todos: ${externalDataCallResult.error.message}`;
      setError(errorObject);
    }

    const todos = externalDataCallResult?.todos ? externalDataCallResult.todos : [];

    setTodos(todos);
  }

  useEffect(() => {
    getTodosHandler();
  }, []);

  const submitTodoHandler = async todo => {
    const externalDataCallResult = await submitTodo(todo);
    if (externalDataCallResult?.error) {

      const errorObject = { ...externalDataCallResult.error, modalShown: false };
      errorObject.message = `There was a problem adding the todo: ${externalDataCallResult.error.message}`;

      return setError(errorObject);
    }
    setCreateUpdateStatus(`Todo Added`);
    getTodosHandler();
  }

  const updateTodoHandler = async todo => {
    const externalDataCallResult = await updateTodo(todo);

    if (externalDataCallResult?.error) {

      const errorObject = { ...externalDataCallResult.error, modalShown: false };
      errorObject.message = `There was a problem updating the todo: ${externalDataCallResult.error.message}`;

      return setError(errorObject);
    }
    setCreateUpdateStatus(`Todo Updated`);
    getTodosHandler();
  }

  const handleModalClose = () => {
    setError({ ...error, modalShown: true });
  }

  return (
    <>
      {error.type && !error.modalShown && <Modal handleClose={handleModalClose} message={error.message} />}
      {createUpdateStatus && <Modal handleClose={() => setCreateUpdateStatus(``)} message={createUpdateStatus} />}
      <div className="container">
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<AllTodos data={{ todos, error: error.message }} />} />
            <Route path="/add" element={<AddEditTodo submitAction={submitTodoHandler} />} />
            <Route path="/edit/:_id" element={<AddEditTodo submitAction={updateTodoHandler} data={todos} />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
