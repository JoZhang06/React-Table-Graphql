import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Table from '../Frontend/UserTable.tsx'
import './App.css'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Table />
    </ApolloProvider>
  );
}

export default App;
