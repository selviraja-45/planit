import { useState, useEffect } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap'

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => setResponse(data.message)) 
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>My App</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <h1>Welcome to My App</h1>

        <p>
          {response}
        </p>

        <Button variant="primary">Click Me</Button>
      </Container>
    </div>
  )
}

export default App
