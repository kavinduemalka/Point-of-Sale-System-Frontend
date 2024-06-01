import { BrowserRouter, Route ,Routes} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CategoryPage from './pages/Category';
import ItemsPage from './pages/Items';
import Stockspage from './pages/Stocks';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/category' element={<CategoryPage />} />
        <Route path='/items' element={<ItemsPage />} />
        <Route path='/stocks' element={<Stockspage />} />
      </Routes> 
   </BrowserRouter>
  );
}

export default App;
