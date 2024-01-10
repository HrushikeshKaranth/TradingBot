import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'

export default function Login() {

  let [msg, setMsg] = useState("");
  let [username, setUsername] = useState(localStorage.getItem("username"));
  let [isLogged, setIsLogged] = useState(false);

  useEffect(()=>{
    localStorage.getItem("username")?setIsLogged(true):setIsLogged(false);
    localStorage.getItem("username")?setMsg(""):setMsg("Logged out! 🙂 ");

  },[])

  function login() {
    axios.get(`/login`)
      .then((res) => {
        console.log(res);
        if(res.status == 200){
          setUsername(res.data.uname)
          localStorage.setItem("username", res.data.uname)
          localStorage.setItem("userToken", res.data.susertoken)
          setMsg("");
          console.log("Login Successfull! 🙂");
          setIsLogged(true);
        }
        else setMsg("");
      })
      .catch((err) => {
        console.log("Couldn't Login 😥");
        console.log(err);
        setMsg("Couldn't Login 😥");
      })
  }

  function logout() {
    axios.get(`/logout`)
      .then((res) => {
        console.log(res);
        if(res.status == 200){
          localStorage.removeItem("userToken");
          localStorage.clear()
          console.log("Logout Successfull! 🙂");
          setMsg("Logged out! 🙂 ");
          setUsername(" ");
          setIsLogged(false);
        }

      })
      .catch(() => {
        console.log("Couldn't Logout 😥");
        setMsg("Couldn't Logout 😥");
      })
  }

  return (
    <>
      {isLogged?<></>:<button onClick={login}>Login</button>}
      <div className='msg'>
        {msg}{     }{username}
      </div>
      {isLogged?<button onClick={logout}>Logout</button>:<></>}
    </>
  )
}
