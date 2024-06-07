import { BrowserRouter, Route ,Routes} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CategoryPage from './pages/Category';
import ItemsPage from './pages/Items';
import Stockspage from './pages/Stocks';
import POSPage from './pages/POS';
import CheckoutPage from './pages/Checkout';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarWrapper from './components/NewBar';

function App() {
  return (
   <BrowserRouter>
   <NavBarWrapper />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/category' element={<CategoryPage />} />
        <Route path='/items' element={<ItemsPage />} />
        <Route path='/stocks' element={<Stockspage />} />
        <Route path='/pos' element={<POSPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes> 
   </BrowserRouter>
  );
}

export default App;
