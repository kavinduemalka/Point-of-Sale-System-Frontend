import { BrowserRouter, Route ,Routes} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CategoryPage from './pages/Category';
import ItemsPage from './pages/Items';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/category' element={<CategoryPage />} />
        <Route path='/items' element={<ItemsPage />} />
      </Routes> 
   </BrowserRouter>
  );
}

export default App;
