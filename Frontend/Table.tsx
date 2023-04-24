import React, { useEffect, useState } from "react";
import { getUserData } from `controllers\getData.js`;
import { deleteUser } from `../controllers/delete`;
import { updateUser } from `../controllers/update`;

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData();
      setUsers(userData);
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    const userData = await getUserData();
    setUsers(userData);
  };

  const handleUpdateUser = async (id: number, name: string, email: string) => {
    await updateUser(id, name, email);
    const userData = await getUserData();
    setUsers(userData);
  };

  return (
    <div>
      <br />
      <h3 className="neon-border">User Tables</h3>
      <br />
      <button id="open-modal-add">New user</button>
      <br />
      <div id="modal-add">
        <div className="modal-content">
          <form id="add-user-form">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required title="Please enter a name" />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required title="Please enter a valid email address" />
            <button type="submit">Add user</button>
            <button id="cancel-button" type="button">
              Cancel
            </button>
          </form>
        </div>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(parseInt(user.createdAt)).toLocaleDateString()}</td>
              <td>{new Date(parseInt(user.updatedAt)).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleUpdateUser(user.id, user.name, user.email)}>Update</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default UserTable;
