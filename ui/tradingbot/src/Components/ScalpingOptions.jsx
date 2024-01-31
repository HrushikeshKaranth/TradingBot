import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'
import expiryDates from '../utils/expiryDates.json'

function ScalpingOptions() {

    let [expiryData, setExpryData] = useState(expiryDates.data)
    let [expiry, setExpiry] = useState('')
    let [index, setIndex] = useState('')
    let [StraddleSpread, setStraddleSpread] = useState(expiryDates.data[0].straddleSpread)
    const [feed, setFeed] = useState(null)
    const [straddle, setStraddle] = useState(null)
    let [price, setPrice] = useState(0)
    let [entryPrice, setEntryPrice] = useState(0)
    let [entryStrike, setEntryStrike] = useState('')
    let [currentStrike, setCurrentStrike] = useState(0)
    let [strikeDistance, setStrikeDistance] = useState(0)
    let [priceFeedLink, setPriceFeedLink] = useState('/pricefeednifty')
    let [qty, setQty] = useState(0)
    let [check, setCheck] = useState(0)
    let [orderCount, setOrderCount] = useState(2)
    let [isOrderPlaced, setIsOrderPlaced] = useState(false)
    let [isCE, setIsCE] = useState(true)
    let [strike, setStrike ]= useState(0)
    let [optionName, setOptionName] = useState()
    console.log(optionName);
    useEffect(() => {
        // entryStrike != currentStrike ? exitOrder() : console.log('Monitoring...! '+'[Order count - '+orderCount);
        entryPrice != price ? exitOrder() : console.log('Monitoring...! '+'[Order count - '+orderCount);
        // if (isOrderPlaced == true && entryStrike != currentStrike) {
        //     if (entryPrice - price < - StraddleSpread || entryPrice - price > StraddleSpread) {
        //         console.log('inside');
        //         setIsOrderPlaced(false)
        //         exitOrder();
        //     }
        //     else { console.log('Monitoring Straddle! In '+'[Order count - '+orderCount); }
        // }
        // else if (isOrderPlaced == false) {
            // console.log('outside');
        // }
        // else {
        //     console.log('Straddle`s Good! ' + '[Order Count - ' + orderCount + ']');
        // }
    }, [check])

    // useEffect(()=>{
    //     isCE?setOptionName({'option':index + expiry + 'C' + strike}):setOptionName({'option':index + expiry + 'P' + strike})
    // },[])
    // console.log(optionName);

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
        postOptionStrike();
        let feedIntervalId = setInterval(getPrice, 200)
        setFeed(feedIntervalId);
        console.log('Price Feed Started!');
    }
    function stopFeed() {
        clearInterval(feed)
        console.log('Price Feed Stopped ❌');
    }
    function getPrice() {
        axios.get('/getoptionfeed')
            .then((res) => {
                // console.log(res.data['lp'])
                setCurrentStrike(Math.round(res.data['lp'] / strikeDistance) * strikeDistance)
                setPrice(res.data['lp'])
            })
            .catch((err) => {
                console.log(err);
            })
    }


    function placeOrder() {
        console.log('Entering strike - ' + currentStrike);
        setEntryStrike(currentStrike)
        setEntryPrice(price)
        axios.post('/placeorder', { 'ce': index + expiry + 'P' + currentStrike, 'pe': index + expiry + 'C' + currentStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    startStraddle();
                    console.log('New order placed at - ' + currentStrike);
                    console.log('New order placed at - ' + price);
                    console.log('Order Count = ' + orderCount);
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
        axios.post('/exitorder', { 'ce': index + expiry + 'P' + entryStrike, 'pe': index + expiry + 'C' + entryStrike, 'qty': qty })
            .then((res) => {
                console.log(res);
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('order exited!');
                    console.log('Re-entering new strike!');
                    setIsOrderPlaced(true)
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
    }

    function closeOrder() {
        axios.post('/exitorder', { 'ce': index + expiry + 'P' + entryStrike, 'pe': index + expiry + 'C' + entryStrike, 'qty': qty })
            .then((res) => {
                console.log(res);
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('order exited!');
                    stopStraddle();
                }
                else {
                    alert('order exiting error❗❌');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // console.log(index + expiry + strike);

    function postOptionStrike(){
        let data = {}
        isCE?data = {'option':index + expiry + 'C' + strike}:data = {'option':index + expiry + 'P' + strike}
        setOptionName(data)
        // let data = index + expiry + 'P' + strike
        console.log(data);
        axios.post('/getoptiontoken',data)
        .then((res)=>{console.log(res);})
        .catch((err)=>{console.log(err);})
    }

    return (
        <div className='priceFeedSec'>
            <>Option Scalping</>
            <div className="sub_">
                <div className="priceFeedSettings">
                    <select name="Select Index"
                        onChange={(e) => {
                            setIndex(e.target.value);
                            if (e.target.value == 'NIFTY') { setExpiry(expiryData[0].date); setQty(expiryData[0].qty); setPriceFeedLink('/pricefeednifty'); setStrikeDistance(expiryData[0].strikeDistance); setStraddleSpread(expiryData[0].straddleSpread) }
                            else if (e.target.value == 'BANKNIFTY') { setExpiry(expiryData[1].date); setQty(expiryData[1].qty); setPriceFeedLink('/pricefeedbanknifty'); setStrikeDistance(expiryData[1].strikeDistance); setStraddleSpread(expiryData[1].straddleSpread) }
                            else if (e.target.value == 'FINNIFTY') { setExpiry(expiryData[2].date); setQty(expiryData[2].qty); setPriceFeedLink('/pricefeedfinnifty'); setStrikeDistance(expiryData[2].strikeDistance); setStraddleSpread(expiryData[2].straddleSpread) }
                            else if (e.target.value == 'MIDCPNIFTY') { setExpiry(expiryData[3].date); setQty(expiryData[3].qty); setPriceFeedLink('/pricefeedmidcap'); setStrikeDistance(expiryData[3].strikeDistance); setStraddleSpread(expiryData[3].straddleSpread) }
                            else { setExpiry(expiryData[4].date); setQty(expiryData[4].qty); setPriceFeedLink('/pricefeedsensex'); setStrikeDistance(expiryData[4].strikeDistance); setStraddleSpread(expiryData[4].straddleSpread) }
                        }}>
                        <option name="Select Index" selected disabled hidden >Index</option>
                        <option value="NIFTY">Nifty 50</option>
                        <option value="BANKNIFTY">Bank Nifty</option>
                        <option value="FINNIFTY">Fin Nifty</option>
                        <option value="MIDCPNIFTY">Midcap Nifty</option>
                        <option value="SENSEX">Sensex</option>
                    </select>
                    <span>
                        <input type="text" placeholder='Enter Strike' onChange={(e)=>setStrike(e.target.value)}/>
                        {/* <span>{isCE?<>CE</>:<>PE</>}</span>  */}
                        <button onClick={()=>setIsCE(true)}>CE</button> 
                        <button onClick={()=>setIsCE(false)}>PE</button>
                        {/* <button onClick={postOptionStrike}>Set Strike</button> */}
                    </span>
                    <button onClick={startFeed}>Start Feed</button>
                    <button onClick={stopFeed}>Stop Feed</button>
                </div>
            </div>
            <div className='sub_'>
                <div className="sub">
                    <span>{index}{' '}{strike}{' '}{isCE?'CE':'PE'}</span>
                    <span>Option Price: {price}</span>
                    {/* <span>Strike: {currentStrike}</span> */}
                </div>
            </div>
            <div className="sub_">
                <button onClick={placeOrder}>Enter</button>
                <button onClick={exitOrder}>Exit</button>
                <button onClick={closeOrder}>Close</button>
                <button onClick={startStraddle}>Start Scalping</button>
                <button onClick={stopStraddle}>Stop Scalping</button>
            </div>
        </div>)
}

export default ScalpingOptions