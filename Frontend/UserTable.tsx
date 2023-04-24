import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const client = new ApolloClient({
  uri: 'http://localhost:4000', // la URL del servidor GraphQL
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const users: User[] = data.users;

  // renderiza la tabla con los datos de los usuarios
  
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user: User) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {/* <td>${new Date(parseInt(user.createdAt)).toLocaleString()}</td>
            <td>${new Date(parseInt(user.updatedAt)).toLocaleString()}</td> */}
            <td>{user.createdAt.toString()}</td>
            <td>{user.updatedAt.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable