import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Header } from "./componets/Header";
import { Tasks } from "./componets/Tasks";
import { AddTask } from "./componets/AddTask";
import { Footer } from "./componets/Footer";
import { About } from "./componets/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTask = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTask()
  }, [])

  // Fetch task from server

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task

  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    // const id = Math.floor(Math.random()  * 10000) +1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
    const data = await res.json()

    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }
  //Toggle Reminder

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()


    setTasks(
      tasks.map((task) =>
        task.id === id ? {
          ...task, reminder:
            data.reminder
        } : task
      )
    )
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() =>
          setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Route path='/' exact render={(props) =>
        (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? (<Tasks tasks={tasks}
              onDelete={deleteTask}
              onToggle={toggleReminder} />) :
              ('No Task Pending')}
          </>
        )} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
