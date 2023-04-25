import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';


interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

const GET_USERS = gql`
  query GetUsers { 
    users {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

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
  };

  const handleEditUser = async (id: number, name: string, email: string) => {
    try {
      const user = await editUser(id, name, email);
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
  

  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showModifyUserForm, setShowModifyUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
              {showModifyUserForm && (
                <div id="modal-modify" className="modal-overlay">
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
                      <button type="submit">Save changes</button>
                      <button id="cancel-button" type="button" onClick={() => {
                        setShowModifyUserForm(false);
                        setSelectedUser(null);
                      }}>
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <td><button className="red-button"> Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

