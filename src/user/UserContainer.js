import {useEffect, useState} from "react"
import UserForm from "./UserForm";
import UserList from './UserList';
import AnimalContainer from '../animal/AnimalContainer';

const SERVER_URL = "http://localhost:8080";

const UserContainer = () => {
    
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState([])

    const [userToUpdate, setUserToUpdate] = useState(null);

    const fetchAPI = async ()  => {
        const response = await fetch("http://localhost:8080/users");
        const data = await response.json();
        
        setUsers(data);
    }

    useEffect(() => {
        fetchAPI()
    } ,[])
  

    const deleteUser = (id) => {
        fetch(`${SERVER_URL}/users/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        })
    
        const newUsers = users.filter((user) => user.id !== id);
        setUsers(newUsers);
    };

    const postUser = (newUser) => {
        fetch(`${SERVER_URL}/users`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then((response) => {
                setUsers([...users, response]);
            });
    };
    
    const updateUser = (updatedUser) => {
        fetch(`${SERVER_URL}/users/${updatedUser.id}?name=${updatedUser.name}`, {
            method: "PATCH",
            headers: {"Content-Type" : "application/json"}
        })
        .then((response) => response.json())
        .then((jsonData) => {
            const usersToKeep = users.filter((user) => user.id !== updatedUser.id)
            setUsers([...usersToKeep, jsonData]);
        });
        setUserToUpdate(null);
    };
    
    const saveUser = (user) => {
        user.id ? updateUser(user) : postUser(user);
    }

    const selectUserForEditing = (user) => {
        setUserToUpdate(user) 
    }

    const currentUserOptions = users.map((user) => {
        return (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        );
      });

      const handleCurrentUserChange = (event) => {
        const currentUserId = parseInt(event.target.value);
        const selectedUser = users.find(user => {
            return user.id === currentUserId;
        });
        setCurrentUser(selectedUser)
      }
    
    return (  
        <>
            <nav>
                <select name="currentUser" onChange={handleCurrentUserChange} >
                    <option disabled-value="select-current-user">Select a user</option>
                    {currentUserOptions}
                </select>
            </nav>

            <h1>Create new user</h1>
            <UserForm saveUser={saveUser}       
            userToUpdate ={userToUpdate}/>
            <UserList    
                users={users}
                deleteUser={deleteUser} 
                selectUserForEditing = {selectUserForEditing}
            />
            
            <AnimalContainer currentUser={currentUser}/>
        </>
    );
}
 
export default UserContainer;