import axiosMock from 'axios';

import * as api from '../asyncFunctions/todoAPICalls';

import sampleTodos from '../sampleTodos.json';

jest.mock('axios');

describe('External Data Tests', () => {

    const testError = { message: `Test Error` };
    let functionResult;

    describe('getTodos tests', () => {

        describe('Normal data returned', () => {

            const expectedReturn = { todos: sampleTodos, status: 200 };
            const resolvedRequestWithData = { data: sampleTodos, status: 200 };

            beforeEach(async () => {
                axiosMock.get.mockResolvedValueOnce(resolvedRequestWithData);
                functionResult = await api.getTodos();
            });

            test('should make a get request via axios', () => {
                expect(axiosMock.get).toHaveBeenCalledTimes(1);
                expect(axiosMock.get).toHaveBeenCalledWith(process.env.REACT_APP_TODOSURL);
            });

            test('should return sample todos when valid data is returned from server', () => {
                expect(functionResult).toStrictEqual(expectedReturn);
            });
        });

        describe('Empty array returned', () => {

            test('should call return an empty array and no todos error message when empty array is returned from server', async () => {

                const returnedError = {
                    todos: [],
                    status: 204,
                    error: {
                        type: `get`,
                        message: `Data not available from the server: There are no todos to retrieve, please add one`
                    }
                };

                axiosMock.get.mockResolvedValueOnce({ data: [], status: 204 });
                functionResult = await api.getTodos();

                expect(functionResult).toStrictEqual(returnedError);
            });
        });

        describe('Error returned', () => {

            test('should return appropriate error message when error is returned from server', async () => {

                const message = `Data not available from the server: ${testError.message}`;
                const expectedReturn = {
                    todos: [],
                    status: 400,
                    error: {
                        type: `get`,
                        message
                    }
                };

                axiosMock.get.mockRejectedValueOnce({ response: { status: 400, message: `Test Error` } });
                functionResult = await api.getTodos();

                expect(functionResult).toStrictEqual(expectedReturn);
            });
        });
    });

    describe('submitTodo tests', () => {
        const testNewTodo = { ...sampleTodos[0] };
        delete testNewTodo._id;

        describe('Base Request', () => {

            beforeEach(() => {
                api.submitTodo(testNewTodo);
            });

            test('should have made a post request to axios', () => {
                expect(axiosMock.post).toHaveBeenCalledTimes(1);
            });

            test('should make a request to the "/add" url with the todo to add', () => {
                expect(axiosMock.post).toHaveBeenCalledWith(
                    `${process.env.REACT_APP_TODOSURL}/add`,
                    testNewTodo);
            });
        });

        describe('Successful POST requests', () => {

            test('should return "Todo added" with 201 status on success', async () => {
                const expectedResponse = { data: testNewTodo, status: 201 };
                const expectedReturn = { todo: testNewTodo, status: 201 };

                axiosMock.post.mockResolvedValueOnce(expectedResponse);
                functionResult = await api.submitTodo(testNewTodo);

                expect(functionResult).toStrictEqual(expectedReturn);
            });
        });

        describe('Unsuccessful POST requests', () => {

            test('should return an error property in the response when unsuccessful POST is made', async () => {
                const expectedResponse = { response: { status: 400, message: testError.message } };
                const expectedReturn = { status: 400, error: { type: `post`, message: testError.message } };

                axiosMock.post.mockRejectedValueOnce(expectedResponse);
                functionResult = await api.submitTodo(testNewTodo);

                expect(functionResult).toStrictEqual(expectedReturn);
            });
        });
    });

    describe('updateTodo tests', () => {
        const testUpdatedTodo = { ...sampleTodos[0] };
        testUpdatedTodo.todoDescription = `Updated description`;

        describe('Base Request', () => {

            beforeEach(() => {
                api.updateTodo(testUpdatedTodo);
            });

            test('should have made a put request to axios', () => {
                expect(axiosMock.put).toHaveBeenCalledTimes(1);
            });

            test('should make a put request to the "/todo/_id" url with the updated todo', () => {
                expect(axiosMock.put).toHaveBeenCalledWith(
                    `${process.env.REACT_APP_TODOSURL}/todo/${testUpdatedTodo._id}`,
                    testUpdatedTodo);
            });
        });

        describe('Successful PUT requests', () => {

            test('should return 201 status and todo on update success', async () => {

                const expectedResponse = { data: testUpdatedTodo, status: 201 };
                const expectedReturn = { todo: testUpdatedTodo, status: 201 };

                axiosMock.put.mockResolvedValueOnce(expectedResponse);
                functionResult = await api.updateTodo(testUpdatedTodo);

                expect(functionResult).toStrictEqual(expectedReturn);
            });

        });

        describe('Unsuccessful PUT requests', () => {

            test('should return error when unsuccessful PUT is made', async () => {

                const expectedResponse = { response: { status: 400, message: testError.message } };
                const expectedReturn = { status: 400, error: { type: `put`, message: testError.message } };

                axiosMock.put.mockRejectedValueOnce(expectedResponse);
                functionResult = await api.updateTodo(testUpdatedTodo);

                expect(functionResult).toStrictEqual(expectedReturn);
            });
        });
    });
});