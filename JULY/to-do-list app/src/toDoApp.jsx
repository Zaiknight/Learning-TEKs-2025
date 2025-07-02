import { useState } from 'react'

function ToDoList(){
    const [tasks,setTasks] = useState([
        {
            title: "Do the dishes",
            deadline: "12pm",
            task: "Clean and then sort all dishes in thier places",
        },
    ])
    const [newTask,setNewTask] = useState(
        {
            title: "",
            deadline: "",
            task: "",
    })


    function handleInputChange(event){
        setNewTask({...newTask,[event.target.name]: event.target.value});
    }

    function addTask(){
        if (newTask.title.trim() !== "" || newTask.task.trim() !== ""){
            setTasks(tasks => [... tasks,newTask]);
            setNewTask(
                {
                    title: "",
                    deadline: "",
                    task: "",
                }
            );
        }
    }

    function removeTask(index){
        const updatedTasks = tasks.filter((_,i)=> i !== index);
        setTasks(updatedTasks);
    }

    function addChildTask(parentIndex){

    }

    return(
        <>
            <div className='to-do-list'>
                <h1>To-Do List</h1>
                
                <div>
                    <input
                        name="title"
                        type='text'
                        placeholder='Enter Task Title...'
                        value = {newTask.title}
                        onChange={handleInputChange}
                    /> 
                   <input
                        name="deadline"
                        type='text'
                        placeholder='Enter Task Deadline...'
                        value = {newTask.deadline}
                        onChange={handleInputChange}
                    />
                    <input                        
                        name="task"
                        type='text'
                        placeholder='Enter a Task...'
                        value = {newTask.task}
                        onChange={handleInputChange}
                    />

                    <button className='add' onClick={addTask}>Add</button>
                </div>

                <ol>
                    {tasks.map((task,index)=>
                        <li key={index}>
                            <span className='taskTitle'>{task.title}<button className='del' onClick={() => (removeTask(index))}>Delete</button></span>
                            <ul>
                                <li>
                                    <span className='task'>{task.task}</span>
                                </li>
                                <li>
                                    <span className='deadline'>Deadline: {task.deadline}</span>
                                </li>
                            </ul>
                        </li>
                    )}
                </ol>
            </div>
        </>
    );
}
export default ToDoList;