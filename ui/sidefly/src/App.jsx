import { useEffect } from "react";
import Login from "./Components/Login";
import "./Style/Style.css";
import axios from './Helpers/Axios'
import Sidefly from "./Components/Sidefly";
import SideflySensex from "./Components/SideflySensex";
import Ulti from "./Components/Ulti";
import SideflyManual from "./Components/SideflyManual";
import DoubleLots from "./Components/DoubleLots";
import OneSide from "./Components/OneSide";

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
    <div className="app">
      <div className="sub">
        <Login />
      </div>
      <div className="sub">
        {/* <Sidefly /> */}
        {/* <SideflySensex /> */}
        {/* <Ulti/> */}
        {/* <SideflyManual /> */}
        {/* <DoubleLots /> */}
        <OneSide />
      </div>
    </div>
  );
}

export default App;
