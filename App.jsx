import axios from "axios"; //Interact with RESTful APIs
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const[users, setUsers] = useState([]);
  const [filteredusers, setFilteredusers] = useState([]);
  const[isModelOpen, setIsModalOpen] = useState([]);
  const [userData, setUserData] = useState({name:"",age:"",city:""}); //fetch typing data

  const getAllUsers = async () =>{
    await axios.get("http://localhost:8000/users").then
    ((res)=>{
      setUsers(res.data); //initial data
      setFilteredusers(res.data); //filtered data
    });
  };
  useEffect(()=>{
    getAllUsers();
  },[]);
 
 //Search function 
  const handleSearchChange = (e)=>{
  const searchText =e.target.value.toLowerCase();
  const filteredUsers = users.filter((user)=>user.name.toLowerCase().includes(searchText)||user.city.toLowerCase().includes(searchText));
  setFilteredusers(filteredUsers);
}

//delete user function
  const handleDelete = async(id)=>{ //Is marked async because it contains asynchronous code (i.e., it will await a promise from axios.delete).
    const isConfirmed = window.confirm("Are you sure you want to delete this user?"); //A confirmation popup is shown to the user.
    if(isConfirmed){ //await pauses the function until the request is completed.
      await axios.delete(`http://localhost:8000/users/${id}`). //Sends an HTTP DELETE request to your backend at the given URL.
      then((res)=>{ //block runs after the request is successful (i.e., the user was deleted).
      setUsers(res.data); //res is the response returned from the server.
      setFilteredusers(res.data);
      });
    }
  };


//close modal
const closeModal= () =>{
  setIsModalOpen(false);
  getAllUsers();
}


//Add user details
const handleAddRecord = () =>{
  setUserData({name:"",age:"",city:""}); //empty state-erase previous data in modal
  setIsModalOpen(true); 

}

const handleData = (e)=>{ 
  setUserData({...userData, // keep existing fields unchanged
    [e.target.name]:e.target.value}); // update the changed field
};

const handleSubmit=async(e)=>{ //will handle asynchronous operations (axios calls using await).
  e.preventDefault();
  if(userData.id){
    await axios.patch(`http://localhost:8000/users/${userData.id}`,userData) //Sends a PATCH request to update the user with that id ,userData is sent as the request body to the backend
  .then((res)=>{
    console.log(res);
  })
  }else{
    await axios.post("http://localhost:8000/users",userData) // create a new user with the data in userData
  .then((res)=>{
    console.log(res);
  });
  }
  closeModal();
  setUserData({name:"",age:"",city:""});  //This clears the form by resetting userData to its initial blank state.
}

//update user
const handleUpdateRecord = (user)=>{
  setUserData(user);
  setIsModalOpen(true);
}

  return (
    <>
      <div className='container'>
        <h3>CRUD Application</h3>
        <div className='input-search'>
          <input type="search" placeholder="Search Text Here" onChange={handleSearchChange}/>
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredusers && filteredusers.map((user,index)=>{
              return(
                <tr key={user.id}>
                  <td>{index+1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td><button className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
                  <td><button  onClick={()=>handleDelete(user.id)} className='btn red'>Delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span> 
              <h2>{userData.id ? "User Record" :"Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" value={userData.age} name="age" id="age" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="city">city</label>
                <input type="text" value={userData.city} name="city" id="city" onChange={handleData}/>
              </div>
              <button className="btn green" onClick={handleSubmit}>{userData.id ? "Update User" :"Add User"}</button>
            </div>
          </div>
        )}
      </div>
      
    </>
  )
}

export default App;
