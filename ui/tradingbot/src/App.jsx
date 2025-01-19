import { useEffect } from "react";
import Login from "./Components/Login";
import PriceFeed from './Components/PriceFeed'
import "./Style/Style.css";
import axios from './Helpers/Axios'
import Scalping from "./Components/Scalping";
import Straddle from "./Components/Straddle";
import ScalpingOptions from "./Components/ScalpingOptions";

function App() {
  useEffect(()=>{
    if(localStorage.getItem("userToken")){
      axios.post('/setsession', {"usertoken":localStorage.getItem("userToken")})
        .then((res) => {
          if(res.status === 200){
            console.log(res);
            console.log('session restarted');
          }
          else console.log('Error loggging in!');
        })
        .catch((err)=>{
          console.log(err);
          console.log('Error loggging in!');
        })
    }
    else{
      console.log('Please Login!');
    }
    return ()=>{
      console.log('Exiting app...');
    }
  })
  return (
    <div className="main">
      {/* Account Login */}
      <div className="auth">
        {/* <div className="sub"> */}
          <Login />
        {/* </div> */}
      </div>
      {/* Price Feed */}
      {/* <div className="feed">
        <div className="sub">
          <PriceFeed />
        </div>
      </div> */}
      <div className="feed">
        {/* Nifty 50 Price */}
        <div className="sub">
          <Straddle />
        </div>
      <div className="sub">
        <ScalpingOptions/>
      </div>
      {/* <div className="strat">
        <Scalping/>
      </div> */}
      </div>
      {/* Strategy section */}
    </div>
  );
}

export default App;
