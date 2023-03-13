import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';

import './css/AddEditTodo.css';
import TodoForm from './TodoForm';
import TodoModel from './utils/Todo.model';
import Modal from './utils/Modal';


const AddEditTodo = ({ submitAction, data }) => {

    const [todo, setTodo] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();
    const { _id } = useParams();

    useEffect(() => {
        if (!_id) return setTodo({});
        const todoToEdit = data?.find(currentTodo => currentTodo._id === _id);
        if (todoToEdit) return setTodo(todoToEdit);
        setTodo({ error: `Todo could not be found` });
    }, [_id, data]);

    useEffect(() => {
        if (submitted) navigate("/");
    }, [submitted, navigate]);

    const submitTodo = (todoDescription, todoDateCreated, todoCompleted) => {
        const todoToSubmit = new TodoModel(todoDescription, new Date(todoDateCreated).toISOString(), todoCompleted, _id);
        submitAction(todoToSubmit);
        setSubmitted(true);
    }

    return (
        <>
            {todo?.error && <Modal handleClose={() => setTodo({})} message={todo.error} />}
            <div className="addEditTodo row">
                <h3>{_id ? `Edit` : `Add`}&nbsp;Todo</h3>
            </div>
            <TodoForm submitAction={submitTodo} todo={todo?.error ? {} : todo} />
        </>
    );
}

AddEditTodo.propTypes = {
    submitAction: PropTypes.func.isRequired,
    todos: PropTypes.arrayOf(
        PropTypes.exact({
            _id: PropTypes.string,
            todoDescription: PropTypes.string,
            todoDateCreated: PropTypes.string,
            todoCompleted: PropTypes.bool
        })
    )
}

export default AddEditTodo;
