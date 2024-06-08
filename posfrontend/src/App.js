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
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
  <AuthProvider>
   <BrowserRouter>
   <NavBarWrapper />
      <Routes>
        <Route element={<ProtectedRoute />} >
          <Route path='/category' element={<CategoryPage />} />
          <Route path='/items' element={<ItemsPage />} />
          <Route path='/stocks' element={<Stockspage />} />
          <Route path='/pos' element={<POSPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes> 
   </BrowserRouter>
   </AuthProvider>
  );
}

export default App;
