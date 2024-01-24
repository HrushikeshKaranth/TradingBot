import { useEffect } from "react";
import Login from "./Components/Login";
import PriceFeed from './Components/PriceFeed'
import "./Style/Style.css";

function App() {
  useEffect(()=>{
    return ()=>{
      localStorage.removeItem("username");
      localStorage.removeItem("userToken");
    }
  })
  return (
    <div className="main">
      {/* Account Login */}
      <div className="auth">
        <div className="sub">
          <Login />
        </div>
      </div>
      {/* Price Feed */}
      <div className="feed">
        {/* Nifty 50 Price */}
        <div className="sub">
          <PriceFeed />
        </div>
      </div>
      {/* Strategy section */}
      <div className="strat">

      </div>
    </div>
  );
}

export default App;
