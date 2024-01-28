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
  let [expiry, setExpiry] = useState('')
  let [index, setIndex] = useState('')
  const [feed, setFeed] = useState(null)
  let [orderNum, setOrderNum] = useState({})
  let [entryStrike, setEntryStrike] = useState('')
  const [straddle, setStraddle] = useState(null)
  let [check, setCheck] = useState(0)
  let count = null
  let [orderCount, setOrderCount] = useState(0)
  // let [scalpEntryPrice, setScalpEntryPrice] = useState(0)
  // let [scalpStrikePrice, setScalpStrikePrice] = useState(0)

  useEffect(() => {
    entryStrike != niftyStrike ? exitOrder() : console.log('Straddle is good!');
  }, [check])


  function straddleCheck() {
    setCheck(check = check + 1)
  }

  function startStraddle() {
    // count = setInterval(straddleCheck, 1000)
    let straddleIntervalId = setInterval(straddleCheck, 500)
    setStraddle(straddleIntervalId);
    console.log('Straddle started ✔');
  }
  function stopStraddle() {
    clearInterval(straddle);
    // clearInterval(count);
    console.log('Straddle stopped ❌');
  }

  function startFeed() {
    // clearInterval(feed);
    let feedIntervalId = setInterval(pricestream, 500)
    setFeed(feedIntervalId);
    console.log('Price Feed Started!');
    // feed = setInterval(PriceFeed, 1000);
  }
  function stopFeed() {
    // clearInterval(feed);
    clearInterval(feed)
    console.log('Price Feed Stopped ❌');
    // setFeed(0)
    // feed = 0;
  }

  function pricestream() {
    axios.get('/pricestream')
      .then((res) => {
        // console.log(res);

        // setEntryStrike(Math.round(res.data[0] / 50) * 50)
        setNiftyStrike(Math.round(res.data[0] / 50) * 50)
        setNifty(res.data[0])

        setNiftyBankStrike(Math.round(res.data[1] / 100) * 100)
        setNiftyBank(res.data[1])

        setNiftyFinStrike(Math.round(res.data[2] / 50) * 50)
        setNiftyFin(res.data[2])

        setMidcapStrike(Math.round(res.data[3] / 25) * 25)
        setMidcap(res.data[3])
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function PriceFeed() {
    axios.get('/pricefeednifty')
      .then((res) => {
        // console.log(res.data['lp'])
        setNiftyStrike(Math.round(res.data['lp'] / 50) * 50)
        setNifty(res.data['lp'])
      })
      .catch((err) => {
        console.log(err);
      })

    axios.get('/pricefeedbanknifty')
      .then((res) => {
        // console.log(res.data['lp'])
        setNiftyBankStrike(Math.round(res.data['lp'] / 100) * 100)
        setNiftyBank(res.data['lp'])
      })
      .catch((err) => {
        console.log(err);
      })

    axios.get('/pricefeedfinnifty')
      .then((res) => {
        // console.log(res.data['lp'])
        setNiftyFinStrike(Math.round(res.data['lp'] / 50) * 50)
        setNiftyFin(res.data['lp'])
      })
      .catch((err) => {
        console.log(err);
      })

    axios.get('/pricefeedmidcap')
      .then((res) => {
        // console.log(res.data['lp'])
        setMidcapStrike(Math.round(res.data['lp'] / 25) * 25)
        setMidcap(res.data['lp'])
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function placeOrder() {
    console.log('Entering strike - ' + niftyStrike);
    setEntryStrike(niftyStrike)
    axios.post('/placeorder', { 'ce': index + expiry + 'P' + niftyStrike, 'pe': index + expiry + 'C' + niftyStrike })
      .then((res) => {
        // console.log(res);
        if (res.data[0].stat && res.data[1].stat == 'Ok') {
          startStraddle();
          console.log('New order placed at - ' + niftyStrike);
          console.log('Order Count = ' + orderCount);
          // console.log(niftyStrike);
          // console.log(entryStrike);
          // setOrderNum({ 'ord1': res.data[0].norenordno, 'ord2': res.data[0].norenordno })
        }
        else {
          alert('Order placing error❗❌')
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function exitOrder() {
    stopStraddle();
    console.log('Exiting strike - ' + entryStrike);
    axios.post('/exitorder', { 'ce': index + expiry + 'P' + entryStrike, 'pe': index + expiry + 'C' + entryStrike })
      .then((res) => {
        console.log(res);
        if (res.data[0].stat && res.data[1].stat == 'Ok') {
          console.log('order exited!');
          // setOrderNum({ 'ord1': res.data[0].norenordno, 'ord2': res.data[0].norenordno })
          console.log('Re-entering new strike!');
          placeOrder();
          setOrderCount(orderCount = orderCount + 2)
        }
        else {
          alert('order exiting error❗❌');
        }
      })
      .catch((err) => {
        console.log(err);
      })
    // // let data = {'ord1': orderNum.ord1, 'ord2': orderNum.ord2}
    // axios.post('/exitorder', {'ord1': orderNum.ord1, 'ord2': orderNum.ord2})
    // .then((res)=>{
    //   console.log(res);
    //   if (res.data[0].stat && res.data[1].stat == 'Ok') {
    //     console.log('order exited!');
    //     // setOrderNum({'ord1':res.data[0].norenordno, 'ord2':res.data[0].norenordno})
    //   }
    //   else{
    //     alert('Order exiting error❗❌')
    //   }
    // })
    // .catch((err)=>{
    //   console.log(err);
    // })
  }

  function closeOrder() {
    axios.post('/exitorder', { 'ce': index + expiry + 'P' + entryStrike, 'pe': index + expiry + 'C' + entryStrike })
      .then((res) => {
        console.log(res);
        if (res.data[0].stat && res.data[1].stat == 'Ok') {
          console.log('order exited!');
          setOrderNum({ 'ord1': res.data[0].norenordno, 'ord2': res.data[0].norenordno })
          stopStraddle();
          // stopFeed();
        }
        else {
          alert('order exiting error❗❌');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (

    <div className='priceFeedSec'>
      <div className="sub_">
        <div className="priceFeedSettings">
          <button onClick={startFeed}>Start Feed</button>
          <button onClick={stopFeed}>Stop Feed</button>
          <select name="Select Index" onChange={(e) => { setIndex(e.target.value) }}>
            <option name="Select Index" selected disabled hidden >Index</option>
            <option value="NIFTY">Nifty 50</option>
            <option value="BANKNIFTY">Bank Nifty</option>
            <option value="FINNIFTY">Fin Nifty</option>
            <option value="MIDCPNIFTY">Midcap Nifty</option>
          </select>
          <select name='expiry' onChange={(e) => { setExpiry(e.target.value) }}>
            <option value="Select Expiry" defaultValue disabled hidden >Expiry</option>
            <option value="25JAN24">25 Jan 2024</option>
            <option value="01FEB24">01 Feb 2024</option>
            <option value="08FEB24">08 Feb 2024</option>
            <option value="15FEB24">15 Feb 2024</option>
            <option value="22FEB24">22 Feb 2024</option>
          </select>
        </div>
      </div>
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
      <div className="sub_">
        <button onClick={placeOrder}>Place</button>
        <button onClick={exitOrder}>Exit</button>
        <button onClick={closeOrder}>Close</button>
        <button onClick={startStraddle}>Start Straddle</button>
        <button onClick={stopStraddle}>Stop Straddle</button>
      </div>
      {/* <div className="sub_">
        <div className='scalpingSec'>
          <div>Scalping</div>
          <div>
            <input type="text" placeholder='Entry Price'
              onChange={(e) => { setScalpEntryPrice(e.target.value); setScalpStrikePrice(Math.round(e.target.value / 50) * 50); }} />
          </div>
          <div>
            <button>Long</button>
            <button>Short</button>
          </div>
        </div>
      </div> */}
    </div>
  )
}
