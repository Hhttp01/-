import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Shop from './components/Shop';
import Cart from './components/Cart';
import AdminSidebar from './components/AdminSidebar';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import { auth } from './utils/firebase';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('shop');
  const [adminTab, setAdminTab] = useState('products');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(()=>{
    const initAuth = async()=>{
      try {
        if(typeof __initial_auth_token!=='undefined' && __initial_auth_token){
          await signInWithCustomToken(auth,__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch(e){ console.error(e); }
    }
    initAuth();
    const unsubscribe = onAuthStateChanged(auth,setUser);
    return ()=>unsubscribe();
  },[]);

  return (
    <div className="min-h-screen">
      <Header setView={setView} setIsCartOpen={setIsCartOpen}/>
      {view==='shop' && <Shop user={user} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>}
      {view==='admin' && (
        <div className="flex">
          <AdminSidebar adminTab={adminTab} setAdminTab={setAdminTab} setView={setView}/>
          {adminTab==='products' && <AdminProducts />}
          {adminTab==='orders' && <AdminOrders />}
        </div>
      )}
      {isCartOpen && <Cart user={user} setIsCartOpen={setIsCartOpen}/>}
    </div>
  );
}

export default App;
