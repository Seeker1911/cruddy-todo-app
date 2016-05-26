$(() => {
  const API_URL = 'https://cruddy-todo-app.firebaseio.com/task'

  const addItemToTable = (item, id) => {
    const row = `<tr data-id="${id}">
      <td>${item.task}</td>
      <td>
        <button class="btn btn-success complete">Complete</button>
        <button class="btn btn-danger delete">Delete</button>
      </td>
    </tr>`

    $('tbody').append(row)
  }

  // READ: GET data from firebase and display in table
  $.get(`${API_URL}.json`)
    .done((data) => {
      if (data) {
        // for (id in data) {
        //   addItemToTable(data[id])
        // }

        Object.keys(data).forEach((id) => {
          addItemToTable(data[id], id)
        })
      }
      // TODO: handle completed tasks
    })

  // CREATE: form submit event to POST data to firebase
  $('.new form').submit(() => {
    // $.ajax({
    //   url: `${API_URL}.json`,
    //   method: 'POST',
    //   data: JSON.stringify({ task: 'I was posted!' })
    // })
    $.post(`${API_URL}.json`,
      JSON.stringify({ task: 'I was posted!' })
    )
    // TODO: Grab the form text
    // TODO: Make this not refresh the page
  })

  // DELETE: click event on delete to send DELETE to firebase
  $('tbody').on('click', '.delete', (e) => {
    const row =  $(e.target).closest('tr')
    const id = row.data('id')

    $.ajax({
      url: `${API_URL}/${id}.json`,
      method: 'DELETE'
    }).done(() => {
      row.remove()
    })
  })

  if (!'isLoggedIn') {
    $('.app').show()
    $('.login').hide()
  }

  // TODO:
  // UPDATE: click event on complete to send PUT/PATCH to firebase

  // AUTHENTICATION

  // Initialize firebase connection
  firebase.initializeApp({
    apiKey: "AIzaSyBanBIBt_Dc3Bj1qJEH4tMVL95OjBpLma8",
    authDomain: "cruddy-todo-app.firebaseapp.com",
    databaseURL: "https://cruddy-todo-app.firebaseio.com",
    storageBucket: "cruddy-todo-app.appspot.com",
  })

  // both return promise like object
  const login = (email, password) => (
    firebase.auth().signInWithEmailAndPassword(email, password)
  )

  const register = (user, password) => (
    firebase.auth().createUserWithEmailAndPassword(user, password)
  )

  $('.login form').submit((e) => {
    const form = $(e.target)
    const email = form.find('input[type="text"]').val()
    const password = form.find('input[type="password"]').val()

    login(email, password)
      .then((data) => {
        console.log(`${data.email} logged in`)
      })
      .catch(console.err)

    e.preventDefault()
  })

  $('input[value="Register"]').click((e) => {
    const form = $(e.target).closest('form')
    const email = form.find('input[type="text"]').val()
    const password = form.find('input[type="password"]').val()

    register(email, password)
      .then(() => login(email, password))
      .then(console.log)
      .catch(console.err)

    e.preventDefault()
  })
})
