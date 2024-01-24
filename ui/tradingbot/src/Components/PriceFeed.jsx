import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'

export default function PriceFeed() {

  let [nifty, setNifty] = useState('')
  let [niftyStrike, setNiftyStrike] = useState('')
  let [niftyBank, setNiftyBank] = useState('')
  let [niftyBankStrike, setNiftyBankStrike] = useState('')
  let [niftyFin, setNiftyFin] = useState('')
  let [niftyFinStrike, setNiftyFinStrike] = useState('')
  let [midcap, setMidcap] = useState('')
  let [midcapStrike, setMidcapStrike] = useState('')
  useEffect(()=>{
    setInterval(() => {
      PriceFeed();
    }, 1000);
  },[])

  function PriceFeed(){
    axios.get('/pricefeednifty')
    .then((res)=>{
      // console.log(res.data['lp'])
      setNiftyStrike(Math.round(res.data['lp']/50)*50)
      setNifty(res.data['lp'])
    })
    .catch((err)=>{
      console.log(err);
    })

    axios.get('/pricefeedbanknifty')
    .then((res)=>{
      // console.log(res.data['lp'])
      setNiftyBankStrike(Math.round(res.data['lp']/100)*100)
      setNiftyBank(res.data['lp'])
    })
    .catch((err)=>{
      console.log(err);
    })

    axios.get('/pricefeedfinnifty')
    .then((res)=>{
      // console.log(res.data['lp'])
      setNiftyFinStrike(Math.round(res.data['lp']/50)*50)
      setNiftyFin(res.data['lp'])
    })
    .catch((err)=>{
      console.log(err);
    })

    axios.get('/pricefeedmidcap')
    .then((res)=>{
      // console.log(res.data['lp'])
      setMidcapStrike(Math.round(res.data['lp']/25)*25)
      setMidcap(res.data['lp'])
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  return (
    <div className='sub_'>
      <div className="sub">
        <span>Nifty: {nifty}</span>
        <span>Strike: {niftyStrike}</span>
      </div>
      <div className="sub">
        <span>Nifty Bank: {niftyBank}</span>
        <span>Strike: {niftyBankStrike}</span>
      </div>
      <div className="sub">
        <span>Nifty Fin: {niftyFin}</span>
        <span>Strike: {niftyFinStrike}</span>
      </div>
      <div className="sub">
        <span>Nifty Midcap: {midcap}</span>
        <span>Strike: {midcapStrike}</span>
      </div>
    </div>
  )
}
