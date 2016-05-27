$(() => {
  const API_URL = 'https://cruddy-3ed9e.firebaseio.com'
  let token = null
  let userId = null

  const addItemToTable = (item, id) => {
    const row =$(`<tr data-id="${id}">
      <td>${item.task}</td>
      <td>
        <button class="btn btn-success complete">Complete</button>
        <button class="btn btn-danger delete">Delete</button>
      </td>
    </tr>`)

    $('tbody').append(row)
    if (item.completed) {
      row.css('text-decoration', 'line-through')
    }
  }

  const getTasks = () => {
    $.get(`${API_URL}/${userId}/task.json?auth=${token}`)
      .done((data) => {
        if (data) {
          // for (id in data) {
          //   addItemToTable(data[id])
          // }

          Object.keys(data).forEach((id) => {
            addItemToTable(data[id], id)
          })
        }
      })
  }

  // CREATE: form submit event to POST data to firebase
  $('.new form').submit((e) => {
    // $.ajax({
    //   url: `${API_URL}.json`,
    //   method: 'POST',
    //   data: JSON.stringify({ task: 'I was posted!' })
    // })

      const userInput = $('.userText').val();
    $.post(`${API_URL}/${userId}/task.json?auth=${token}`,
      JSON.stringify({ task: userInput, completed: false})
    )

    // TODO: Grab the form text
    // TODO: Make this not refresh the page
  })

  $('tbody').on('click', '.delete', (e) => {
    const row =  $(e.target).closest('tr')
    const taskId = row.data('id')

    $.ajax({
      url: `${API_URL}/${userId}/task/${taskId}.json?auth=${token}`,
      method: 'DELETE'
    }).done(() => {
      row.remove()
    })
  })

  $('tbody').on('click', '.complete', (e) => {
    const row =  $(e.target).closest('tr')
    const taskId = row.data('id')

    $.ajax({
      url: `${API_URL}/${userId}/task/${taskId}.json?auth=${token}`,
      method: 'PATCH',
      data: JSON.stringify({ completed: true })
    }).done(() => {
      row.css('text-decoration', 'line-through');
    })
  })
  firebase.initializeApp({
    apiKey: "AIzaSyDEst_M1pyP2ft_HrEzvRYjTNmyMXYVlVU",
    authDomain: "cruddy-3ed9e.firebaseapp.com",
    databaseURL: "https://cruddy-3ed9e.firebaseio.com",
    storageBucket: "cruddy-3ed9e.appspot.com",
  })

  // both return promise like objects
  const login = (email, password) => (
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
  )

  const register = (user, password) => (
    firebase.auth().createUserWithEmailAndPassword(user, password)
  )

  $('.login form').submit((e) => {
    const form = $(e.target)
    const email = form.find('input[type="text"]').val()
    const password = form.find('input[type="password"]').val()

    login(email, password)
      .then(console.log)
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

  $('.logout').click(() => {
    firebase.auth().signOut()
  })

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // logged in
      $('.login').hide()
      $('.app').show()

      $('.logged_in_user').text(user.email)

      userId = user.uid

      user.getToken()
        .then(t => token = t)
        .then(getTasks)

    } else {
      // logged out
      $('.app').hide()
      $('.login').show()
      $('tbody').empty()
    }
  })

})
