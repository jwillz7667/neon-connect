import { BrowserRouter } from 'react-router-dom';
import { FUTURE_FLAGS } from '@/config/router';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter future={FUTURE_FLAGS}>
      <div className="min-h-screen bg-background">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
