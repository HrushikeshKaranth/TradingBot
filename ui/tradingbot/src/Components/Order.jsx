import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'

export default function Order() {
    let [orderDetails, setOrderDetails] = useState({})
    
    function placeorder() {
        axios.post(`/placeorder`, orderDetails)
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
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
    return (
        <div>Order</div>
    )
}
