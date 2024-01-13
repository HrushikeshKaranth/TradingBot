import React, { useEffect } from 'react'
import axios from '../Helpers/Axios'

export default function PriceFeed() {
  useEffect(()=>{
    axios.get('/pricefeed')
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err);
    })
  },[])
  return (
    <div className='sub_'>
      <div className="sub">
        Nifty: 
      </div>
      <div className="sub">
        Nifty Bank: 
      </div>
      <div className="sub">
        Nifty Fin: 
      </div>
      <div className="sub">
        Nifty Midcap: 
      </div>
    </div>
  )
}
