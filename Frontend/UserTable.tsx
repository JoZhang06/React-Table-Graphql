import { useQuery, useMutation, Reference, StoreObject } from '@apollo/client';
import { useEffect, useState } from 'react';
import { client } from '../Backend/apolloclient';
import { GET_USERS, EDIT_USER, DELETE_USER } from '../Backend/graphqlQuery';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

//El user teble con las funcionalidades de los botones
function UserTable() {
  const { loading, error, data } = useQuery(GET_USERS, { client });

  const handleCreateUser = async (name: string, email: string) => {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation {
        createUser(name: "${name}", email: "${email}") {
          id
          name
          email
          createdAt
          updatedAt
        }
      }`,
      }),
    })
      .then((res) => res.text()) // parse the response manually
      .then((res) => {
        const data = JSON.parse(res); // parse the JSON manually
        console.log(data);
        name = "";
        email = "";
      })
      .catch((err) => console.error(err));
    window.location.reload();
  };


  const handleEditUser = async (id: number, name: string, email: string) => {
    try {
      const { data } = await editUser({
        variables: { id, name, email },
      });
      const user = data.editUser;
      const row = document.getElementById(`user-${user.id}`);
      if (row) {
        row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${new Date(parseInt(user.createdAt)).toLocaleString()}</td>
      <td>${new Date(parseInt(user.updatedAt)).toLocaleString()}</td>
      <td>
      <button onclick="showEditForm(${user.id}, '${user.name}', '${user.email}')">Editar</button>
      <button onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
`;

      }
    } catch (err) {
      console.error(err);
    }
  };

  const [deleteUser] = useMutation(DELETE_USER, {
    client,
    update(cache, { data: { deleteUser } }) {
      cache.modify({
        fields: {
          users(existingUsers = [], { readField }) {
            return existingUsers.filter(
              (userRef: Reference | StoreObject | undefined) => deleteUser.id !== readField("id", userRef)
            );
          },
        },
      });
    },
  });


  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showModifyUserForm, setShowModifyUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser] = useMutation(EDIT_USER, { client });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const users: User[] = data.users;

  const handleShowCreateUserForm = () => {
    setShowCreateUserForm(true);
  };

  const handleHideCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateUser(name, email);
    setName('');
    setEmail('');
    setShowCreateUserForm(false);
  };

  const handleModifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const { id, name, email } = selectedUser;
    await handleEditUser(id, name, email);
    setShowModifyUserForm(false);
  };

  return (
    <div>
      <br />
      <h3 className="neon-border">User Tables</h3>
      <br />
      <button onClick={handleShowCreateUserForm}>New user</button> {/* Agregar botón para mostrar el formulario */}
      <br />
      {showCreateUserForm && (
        <div id="modal-add" className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                title="Please enter a name"
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                title="Please enter a valid email address"
              />
              <button type="submit">Add user</button>
              <button id="cancel-button" type="button" onClick={handleHideCreateUserForm}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <br />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.createdAt.toString()}</td>
              <td>{user.updatedAt.toString()}</td>
              <td>
                <button className='blue-button' onClick={() => {
                  setSelectedUser(user);
                  setShowModifyUserForm(true);
                }}>Modify</button>
              </td>
              {showModifyUserForm && selectedUser && (
                <div id="modal-modify" className="modal-overlay">
                  <div className="modal-content">
                    <form onSubmit={handleModifyUser}>
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={selectedUser.name}
                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                        required
                        title="Please enter a name"
                      />
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        required
                        title="Please enter a valid email address"
                      />
                      <button type="submit">Save</button>
                      <button id="cancel-button" type="button" onClick={() => setShowModifyUserForm(false)}>
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}
              <td><button className="red-button" onClick={() => deleteUser({ variables: { id: user.id } })}> Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

