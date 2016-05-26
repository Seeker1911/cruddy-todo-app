$(() => {
  const API_URL = 'https://cruddy-todo-app.firebaseio.com/task.json'

  const addItemToTable = (item) => {
    const row = `<tr>
      <td>${item.task}</td>
      <td>
        <button class="btn btn-success">Complete</button>
        <button class="btn btn-danger">Delete</button>
      </td>
    </tr>`

    $('tbody').append(row)
  }

  // READ: GET data from firebase and display in table
  $.get(API_URL)
    .done((data) => {
      // for (key in data) {
      //   addItemToTable(data[key])
      // }
      Object.keys(data).forEach((key) => {
        addItemToTable(data[key])
      })
    })
})
