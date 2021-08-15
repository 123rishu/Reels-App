import React, { useState, useEffect } from 'react';

let count = 0;

const UseEffect = () => {
    let [currTask, setCurrTask] = useState("");
    let [taskList, setTaskList] = useState([]);

    const handleAddTask = () => {
        let newTasksList = [...taskList, {id: Date.now(), task: currTask} ];
        setTaskList(newTasksList);
        setCurrTask("");
    }

    // useEffect(() => {
    //     console.log("I will execute after every render !!!");
    // }) // componentDidMount ,  componentDidUpdate ,componenetWillUnmount , state change hogi

    // useEffect(() => {
    //      console.log("I will run after first render !!!");
    // }, []); //componentDidMount

    useEffect(() => {
        console.log("I will run when the taskList updates !!!", count);
        count++;
        return function () {
          console.log("I am a cleanup function !!!!", count);
        };
      }, [taskList]); //componentDidMount

    return ( 
        <div className="tasks-container">

            <div className="task-input-box">

                <input 
                type="text"
                value={currTask}
                onChange={(e)=>{
                    setCurrTask(e.target.value);
                }}
                />

                <button onClick={handleAddTask}>Add Task</button>

            </div>

            <div className="tasks-list">

                {
                    taskList.map((curr) => {
                        return <div key={curr.id}>{curr.task}</div>  
                    })
                }

            </div>

        </div>
        );
}
 
export default UseEffect;