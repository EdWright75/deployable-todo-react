export default class TodoModel {
  constructor(todoDescription, todoDateCreated, todoCompleted, _id = null) {
    this.todoDescription = todoDescription;
    this.todoDateCreated = todoDateCreated;
    this.todoCompleted = todoCompleted;
    this._id = _id;
  }
}
