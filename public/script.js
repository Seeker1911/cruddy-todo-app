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
      if (data) {
        // for (key in data) {
        //   addItemToTable(data[key])
        // }

        Object.keys(data).forEach((key) => {
          addItemToTable(data[key])
        })
      }
    })

  // CREATE: form submit event to POST data to firebase
  $('form').submit(() => {
    // $.ajax({
    //   url: API_URL,
    //   method: 'POST',
    //   data: JSON.stringify({ task: 'I was posted!' })
    // })
    $.post(API_URL,
      JSON.stringify({ task: 'I was posted!' })
    )
    // TODO: Grab the form text
    // TODO: Make this not refresh the page
  })
})
