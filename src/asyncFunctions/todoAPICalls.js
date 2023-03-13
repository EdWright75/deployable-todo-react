import axios from 'axios';

export const getTodos = async () => {
    try {
        const res = await axios.get(process.env.REACT_APP_TODOSURL);
        if (Array.isArray(res.data) && res.data?.length > 0) return { todos: res.data, status: res.status };
        throw new Error(`There are no todos to retrieve, please add one`);
    } catch (e) {
        return {
            todos: [],
            status: e.response?.status ?? 204,
            error: {
                type: `get`,
                message: `Data not available from the server: ${e.message ?? e.response.message}`
            }
        }
    }
}

export const submitTodo = async todo => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_TODOSURL}/add`, todo);
        return { todo: res.data, status: res.status };
    }
    catch (e) {
        return {
            status: e.response?.status,
            error: {
                type: `post`,
                message: e.response?.message
            }
        };
    }
}

export const updateTodo = async todo => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_TODOSURL}/todo/${todo._id}`, todo);
        return { todo: res.data, status: res.status };
    }
    catch (e) {
        return {
            status: e.response?.status,
            error: {
                type: `put`,
                message: e.response?.message
            }
        };
    }
}