
todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));

todoForm.author.addEventListener('input', (e) => validateField(e.target));
todoForm.author.addEventListener('blur', (e) => validateField(e.target));

todoForm.releaseDate.addEventListener('input', (e) => validateField(e.target));
todoForm.releaseDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let authorValid = true;
let releaseDateValid = true;

const api = new Api('http://localhost:5000/books');

function validateField(field) {

  const { name, value } = field;

  let = validationMessage = '';
  switch (name) {

    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'author': {
      if (value.length > 500) {
        authorValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        authorValid = true;
      }
      break;
    }
    case 'releaseDate': {
      if (value.length === 0) {
        releaseDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        releaseDateValid = true;
      }
      break;
    }
  }
  
  

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {

  e.preventDefault();
  if (titleValid && authorValid && releaseDateValid) {
    console.log('Submit');

    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    author: todoForm.author.value,
    releaseDate: todoForm.releaseDate.value,
    completed: false
  };



  
  

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');

  api.getAll().then((tasks) => {

    tasks.sort((a,b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

    todoListElement.innerHTML = '';


    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        

        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}


function renderTask({ id, title, author, releaseDate, completed }) {

  let html = ""

  if(completed == false){
    html = `
    <li class="select-none mt-2 py-2 border px-2 border-red-900 rounded-md">
      <div class="flex items-center my-15">
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <input type= "checkbox" onclick="completeTask(${id})" id="completed" name="completed">
        <label for="completed" class="mr-10 ml-3">Not finished</label>
        <div>
          <span>${releaseDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-indigo-500 text-xs text-black border border-black px-3 py-1 rounded-md ml-2">Remove</button>
        </div>
      </div>`;


  author &&

    (html += `
      <p class="ml-8 mt-2 text-lg font-bold italic">${author}</p>
  `);

  html += `
    </li>`;
  }else if(completed == true){
    html = `
    <li id="${id}" class="select-none mt-2 bg-green-100 py-2 border px-2 border-green-900 rounded-md">
      <div class="flex items-center my-15">
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <input type="checkbox" onclick="completeTask(${id})" id="completed" checked name="completed">
        <label for="completed" class="mr-10 ml-3">Finished</label>
        <div>
          <span>${releaseDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-indigo-500 text-xs text-black border border-black px-3 py-1 rounded-md ml-2">Remove</button>
        </div>
      </div>`;

  author &&

    (html += `
      <p class="ml-8 mt-2 text-lg font-bold italic">${author}</p>   
  `);

  html += `
    </li>`;
  }
 
  return html;
}

function deleteTask(id) {

  api.remove(id).then((result) => {

    renderList();
  });
}


function completeTask(id){
  api.update(id).then((result) => {renderList()})
}

renderList();