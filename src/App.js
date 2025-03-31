import './App.css';
import DataTable from './components/table';
import { Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <DataTable />
      </Container>
    </div>
  );
}

export default App; 