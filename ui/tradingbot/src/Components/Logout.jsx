import React, { useState } from 'react'
import axios from '../Helpers/Axios'

export default function Logout() {
    let [msg, setMsg] = useState("");

    function logout() {
      axios.get(`/logout`)
        .then((res) => {
          console.log(res);
          console.log("Logout Successfull! 🙂");
          setMsg("Logout Successfull! 🙂");
        })
        .catch(() => {
          console.log("Couldn't Logout 😥");
          setMsg("Couldn't Logout 😥");
        })
    }
  
    return (
      <>
        <button onClick={logout}>Logout</button>
        <div className='msg'>
          {msg}
        </div>
      </>
    )
}
