// App - Root component with React Router navigation and layout
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JournalProvider } from './context/JournalContext';
import { BottomNav, FAB } from './components';
import { Home, JournalOverview, NewEntry, EntryDetail } from './pages';

function App() {
  return (
    <JournalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<JournalOverview />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
        </Routes>

        {/* Global Navigation */}
        <BottomNav />
        <FAB />
      </BrowserRouter>
    </JournalProvider>
  );
}

export default App;
