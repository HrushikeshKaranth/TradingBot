import React, { useState } from 'react'
import axios from '../Helpers/Axios'

export default function Login() {

  let [msg, setMsg] = useState("");

  function login() {
    axios.get(`/login`)
      .then((res) => {
        console.log(res);
        console.log("Login Successfull! 🙂");
        setMsg("Login Successfull! 🙂");
      })
      .catch(() => {
        console.log("Couldn't Login 😥");
        setMsg("Couldn't Login 😥");
      })
  }

  return (
    <>
      <button onClick={login}>Login</button>
      <div className='msg'>
        {msg}
      </div>
    </>
  )
}
