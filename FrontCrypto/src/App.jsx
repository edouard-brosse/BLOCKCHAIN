import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AppShell, Burger, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import { Text, Title } from '@mantine/core';
import Home from './pages/home';

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Router>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <div>
            <Text 
            size='xl'
            fw={900}
            variant="gradient"
            gradient={{ from: 'blue', to: 'green', deg: 0 }}
            >
               MY CRYPTO APP
            </Text>
          </div>
        </AppShell.Header>

        <AppShell.Navbar p="md">

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ScrollArea>
            <div style={{ marginBottom: 10 }}>
              <Link to="/">Home</Link>
            </div>
          </ScrollArea>
        </div>

        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </AppShell.Main>
      </AppShell>

      
    </Router>
  );
}

export default App
