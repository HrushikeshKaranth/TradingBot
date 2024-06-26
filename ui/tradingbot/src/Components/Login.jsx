import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'

export default function Login() {

  let [msg, setMsg] = useState("");
  let [username, setUsername] = useState(localStorage.getItem("username"));
  let [isLogged, setIsLogged] = useState(false);

  // useEffect(()=>{
  //   localStorage.getItem("username")?setIsLogged(true):setIsLogged(false);
  //   localStorage.getItem("username")?setMsg(""):setMsg("Logged out! 🙂 ");
  //   return ()=>{
  //     localStorage.removeItem("username");
  //     localStorage.removeItem("userToken");
  //   }
  // },[])

  function login() {
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
      axios.get(`/login`)
        .then((res) => {
          console.log(res);
          if(res.status == 200){
            setUsername(res.data.uname)
            localStorage.setItem("username", res.data.uname)
            localStorage.setItem("userToken", res.data.susertoken)
            setMsg("");
            console.log("Login Successfull! 🙂");
            // setIsLogged(true);
          }
          else setMsg("");
        })
        .catch((err) => {
          console.log("Couldn't Login 😥");
          console.log(err.message);
          setMsg("Couldn't Login! - " + err.message + " 😥");
        })
    }
  }

  function logout() {
    axios.get(`/logout`)
      .then((res) => {
        console.log(res);
        if(res.status == 200){
          localStorage.removeItem("userToken");
          localStorage.removeItem("username");
          localStorage.clear()
          console.log("Logout Successful! 🙂");
          setMsg("Logged out! 🙂 ");
          setUsername(" ");
          // setIsLogged(false);
        }

      })
      .catch(() => {
        console.log("Couldn't Logout 😥");
        setMsg("Couldn't Logout 😥");
      })
  }

  return (
    <div className='loginSec'>
      <button onClick={login}>Login</button>
      <div className='msg'>
        {msg}{     }{username}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
