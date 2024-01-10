// import PriceFeed from './Components/PriceFeed'
import Login from "./Components/Login";
import Logout from "./Components/Logout";

function App() {

  return (
    <div className="main">
      {/* Account Login */}
      <div className="sub">
        <Login />
      </div>
      <div className="sub">
        <Logout />
      </div>
      {/* Price Feed */}
      <div className="sub">
        {/* Nifty 50 Price */}
        <div className="sub1">

        </div>
        {/* Nifty Bank Price */}
        <div className="sub1">

        </div>
        {/* Nifty Fin Price */}
        <div className="sub1">

        </div>
        {/* Nifty Midcap Price */}
        <div className="sub1">

        </div>
      </div>
      {/* Strategy section */}
      <div className="sub">

      </div>
    </div>
  );
}

export default App;
