import './App.css';
// import state stuff
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function App() {
  // react state (for form fields)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState("");
  const [ctc, setCtc] = useState(0);
  const [newCtc, setNewCtc] = useState(0);
  
  // react state for employee list
  const [employeeList, setEmployeeList] = useState([]);
  const [notification, setNotification] = useState({ message: "", isVisible: false });

  const addEmployee = () => {
    Axios.post('http://localhost:3001/create/', 
      { 
        name: name, 
        email: email,
        age: age, 
        position: position, 
        ctc: ctc})
      .then(() => {
        // array destructuring 
        setEmployeeList([...employeeList, { name: name, email: email, age: age, position: position, ctc: ctc }]);
        setNotification({ message: "Added Employee ", isVisible: true });
      });
  };

  const getEmployees = () => {
    Axios.get('http://localhost:3001/employees').then((response) => {
      setEmployeeList(response.data);
    });
  };

  const updateCtc = (id) => {
    console.log("Updating employee with ID:", id, "New CTC:", newCtc);
    Axios.put('http://localhost:3001/update', { ctc: newCtc, id: id })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.error("Error updating CTC:", err.response || err);
        });       
  };
  

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
      setEmployeeList(employeeList.filter((val) => val.id !== id));
    });
  };  

  useEffect(() => {
    // hide notification after 30 seconds
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification({ message: "", isVisible: false });
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="App">
      <div className="infoo">
        
        <div className="notification" 
          style={{ display: notification.isVisible ? 'block' : 'none' }}>
          {notification.message}
        </div>

        <label> Name </label>
        <input type="text" onChange={(event) => {
          setName(event.target.value);
        }} />

        <label> Email </label>
        <input type="text" onChange={(event) => {
          setEmail(event.target.value);
        }} />

        <label> Age </label>
        <input type="number" onChange={(event) => {
          setAge(event.target.value);
        }} />

        <label> Position </label>
        <input type="text" onChange={(event) => {
          setPosition(event.target.value);
        }} />

        <label> CTC </label>
        <input type="number" onChange={(event) => {
          setCtc(event.target.value);
        }} />

        <button onClick={addEmployee}>Add Employee</button>
        <hr></hr>
      </div>

      <div className="emplBtn">
        <button onClick={getEmployees}>Show Employees</button>
      </div>

      {/* <div className='empNameBox'>
        {employeeList.map((val) => {
          return (
            <div key={val.id} className='empName'> 
              <span className='listBox'>
                <br></br>Name: {val.name}
                <br></br>EMail: {val.email}
                <br></br>Age: {val.age}
                <br></br>Position: {val.position}
                <br></br>CTC: {val.ctc}
                <div>
                  <input type='number' placeholder='2000...'
                    onChange={(event) => {
                      setNewCtc(event.target.value);
                    }}
                  />
                  <button onClick={() => {updateCtc(val.id)}}>Update</button>
                  <button onClick={() => {
                    if (window.confirm('Are you sure you want to delete this employee?')) {
                      deleteEmployee(val.id);  // Ensure val.id is being passed correctly
                    }
                  }}>Delete</button>
                </div> 
              </span>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}

export default App;

