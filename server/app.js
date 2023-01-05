const express = require('express');
const app = express();

const fs = require('fs/promises');

const PORT = 5000;
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

app.get('/books', async (req, res) => {
  try {
    const books = await fs.readFile('./books.json');
    res.send(JSON.parse(books));
  } catch (error) {
    res.status(500).send({ error });
  }
});
app.post('/books', async (req, res) => {
  try {
    const task = req.body;
    const listBuffer = await fs.readFile('./books.json');
    const currentTasks = JSON.parse(listBuffer);
    let maxTaskId = 1;
    if (currentTasks && currentTasks.length > 0) {
      maxTaskId = currentTasks.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    const newTask = { id: maxTaskId + 1, ...task };
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

    await fs.writeFile('./books.json', JSON.stringify(newList));
    res.send(newTask);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/books/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./books.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
           await fs.writeFile(
        './books.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      res.send({ message: `Book with ${id} got removed` });
    } else {
      res.status(404).send({ error: 'No books to remove' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.patch('/pbooks/:id', async (req, res) => {
  try{
    const id = req.params.id;
    const listBuffer = await fs.readFile('./books.json');
    const currentTasks = JSON.parse(listBuffer);
    let index = 0;

    for (const task of currentTasks) {
      if(task.id == id) {
        break;
      }
      index = index + 1;
    }
    
    currentTasks[index].completed = !currentTasks[index].completed

    await fs.writeFile('./books.json', JSON.stringify(currentTasks));

    res.send({ message: `Book with ${id} changed to ${currentTasks[index].completed}` });

  }catch(error){
    res.status(500).send({ error: error.stack });
  }
})

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));