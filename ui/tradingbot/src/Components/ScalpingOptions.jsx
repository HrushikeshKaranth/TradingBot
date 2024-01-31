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
    let [price, setPrice] = useState(100)
    let [entryPrice, setEntryPrice] = useState(0)
    let [entryStrike, setEntryStrike] = useState('')
    let [currentStrike, setCurrentStrike] = useState(0)
    let [strikeDistance, setStrikeDistance] = useState(0)
    let [priceFeedLink, setPriceFeedLink] = useState('/pricefeednifty')
    let [qty, setQty] = useState(0)
    let [check, setCheck] = useState(0)
    let [check2, setCheck2] = useState(0)
    let [orderCount, setOrderCount] = useState(2)
    let [isOrderPlaced, setIsOrderPlaced] = useState(false)
    let [isCE, setIsCE] = useState(true)
    let [strike, setStrike ]= useState()
    let [optionName, setOptionName] = useState()
    let [scalpCheckInterval, setScalpCheckInterval] = useState(null)
    let [tradeCheckInterval, setTradeCheckInterval] = useState(null)
    let [entered, setentered] = useState(false)
    let [enteredLong, setEnteredLong] = useState(false)
    let [enteredShort, setEnteredShort] = useState(false)
    let [scalpEntryPrice, setScalpEntryPrice] = useState(0)
    let [scalpInterval, setScalpInterval] = useState()
    // console.log(optionName);

    useEffect(() => {
        if (price - entryPrice >= -1 && price - entryPrice <= 1) {
            stopScalping();
            console.log('Scalping initiated!');
            enterTrade();
        }
        else { console.log('Waiting for price to reach the entry price!'); }
    }, [check])

    function enterTrade() {
        if (entryPrice < price) {
            axios.post('/placeorderopts', { 'option':optionName, 'qty': qty })
                .then((res) => {
                    console.log(res);
                    if (res.data.stat == 'Ok') {
                        setentered(true)
                        setEnteredLong(false)
                        setEnteredShort(true)
                        let tradeCheckId = setInterval(tradeCheck, 300);
                        setTradeCheckInterval(tradeCheckId);
                        console.log('New order placed at - ' + price);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios.post('/placeorderoptb', { 'option':optionName, 'qty': qty })
                .then((res) => {
                    console.log(res);
                    if (res.data.stat == 'Ok') {
                        setentered(true)
                        setEnteredLong(true)
                        setEnteredShort(false)
                        let tradeCheckId = setInterval(tradeCheck, 300);
                        setTradeCheckInterval(tradeCheckId);
                        console.log('New order placed at - ' + price);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    useEffect(() => {
        if (entered == true && enteredLong == true && entryPrice < price) {
            stopTradeCheck();
            goShort();
        }
        else if (entered == true && enteredShort == true && entryPrice > price) {
            stopTradeCheck();
            goLong();
        }
        else {
            console.log('Monitoring trades...');
        }
    }, [check2])

    function goLong(){
        axios.post('/golongopt',{'option':optionName,'qty':qty*2})
        .then((res)=>{
            if(res.data.stat == 'Ok'){
                setEnteredLong(true);
                setEnteredShort(false);
                startTradeCheck()
                console.log(res);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    function goShort(){
        axios.post('/goshortopt',{'option':optionName,'qty':qty*2})
        .then((res)=>{
            if(res.data.stat == 'Ok'){
                setEnteredShort(true);
                setEnteredLong(false);
                startTradeCheck()
                console.log(res);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function startScalping() {
        let scalpIntervalId = setInterval(() => { setCheck(check = check + 1) }, 200);
        // setScalp(setInterval(scalping, 500))
        setScalpInterval(scalpIntervalId);
    }
    function stopScalping() {
        clearInterval(scalpInterval);
        // console.log('Scalping terminated!');
    }

    function tradeCheck() {
        setCheck2(check2 = check2 + 1);
    }
    function stopTradeCheck() {
        clearInterval(tradeCheckInterval);
        console.log('Trade monitor paused!');
    }
    function startTradeCheck() {
        let tradeCheckId = setInterval(tradeCheck, 300);
        setTradeCheckInterval(tradeCheckId);
    }
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

    function postOptionStrike(){
        let data = {}
        isCE?data = {'option':index + expiry + 'C' + strike}:data = {'option':index + expiry + 'P' + strike}
        setOptionName(data.option)
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
                    <input type="text" placeholder='Entry Price' onChange={(e)=>setEntryPrice(e.target.value)} />
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
                <button>Enter</button>
                <button>Exit</button>
                <button>Close</button>
                <button onClick={startScalping}>Start Scalping</button>
                <button onClick={stopScalping}>Stop Scalping</button>
            </div>
        </div>)
}

export default ScalpingOptions