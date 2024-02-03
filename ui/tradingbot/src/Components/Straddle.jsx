import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'
import expiryDates from '../utils/expiryDates.json'

function Straddle() {

    let [expiryData, setExpryData] = useState(expiryDates.data)
    let [expiry, setExpiry] = useState('')
    let [index, setIndex] = useState('')
    let [StraddleSpread, setStraddleSpread] = useState(expiryDates.data[0].straddleSpread)
    const [feed, setFeed] = useState(null)
    const [straddle, setStraddle] = useState(null)
    let [price, setPrice] = useState(0)
    let [upStrike, setUpStrike] = useState(0)
    let [downStrike, SetDownStrike] = useState(0)
    let [entryPrice, setEntryPrice] = useState(0)
    let [entryStrike, setEntryStrike] = useState('')
    let [currentStrike, setCurrentStrike] = useState(0)
    let [strikeDistance, setStrikeDistance] = useState(0)
    let [priceFeedLink, setPriceFeedLink] = useState('/pricefeednifty')
    let [qty, setQty] = useState(0)
    let [check, setCheck] = useState(0)
    let [orderCount, setOrderCount] = useState(2)
    let [isOrderPlaced, setIsOrderPlaced] = useState(false)
    let [isUpStrikePlaced, setIsUpStrikePlaced] = useState(false)
    let [isDownStrikePlaced, setIsDownStrikePlaced] = useState(false)
    let [isStrikePlaced, setIsStrikePlaced] = useState(false)

    useEffect(() => {
        if (isOrderPlaced == true && entryStrike != currentStrike) {
            if (entryPrice - price < - StraddleSpread || entryPrice - price > StraddleSpread) {
                console.log('inside');
                setIsOrderPlaced(false)
                exitOrder();
            }
            else { console.log('Monitoring Straddle! In '+'[Order count - '+orderCount); }
        }
        else if (isOrderPlaced == false) {
            // console.log('outside');
            entryStrike != currentStrike ? exitOrder() : console.log('Monitoring Straddle! Out '+'[Order count - '+orderCount);
        }
        else {
            console.log('Straddle`s Good! ' + '[Order Count - ' + orderCount + ']');
        }
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
        let feedIntervalId = setInterval(getPrice, 500)
        setFeed(feedIntervalId);
        console.log('Price Feed Started!');
    }
    function stopFeed() {
        clearInterval(feed)
        console.log('Price Feed Stopped ❌');
    }

    useEffect(()=>{
        setCurrentStrike(Math.round(price / strikeDistance) * strikeDistance)
        setUpStrike(currentStrike+50)
        SetDownStrike(currentStrike-50)
        
    },[price])
    function getPrice() {
        axios.get(priceFeedLink)
            .then((res) => {
                // console.log(res.data['lp'])
                setPrice(res.data['lp'])
                // setCurrentStrike(Math.round(res.data['lp'] / strikeDistance) * strikeDistance)
                // setUpStrike(Math.round(res.data['lp'] / strikeDistance) * strikeDistance)
                // SetDownStrike(Math.round(res.data['lp'] / strikeDistance) * strikeDistance)
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
                    // startStraddle();
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
    function placeUpStrike() {
        console.log('Entering strike - ' + upStrike);
        // setEntryStrike(currentStrike)
        if(isStrikePlaced == true){
            axios.post('/placescalporderlong', { 'pe': index + expiry + 'P' + upStrike, 'ce': index + expiry + 'C' + downStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    // startStraddle();
                    console.log('Entered Strike - ' + upStrike);
                    console.log('Exited Strike - ' + downStrike);
                    // console.log('New order placed at - ' + price);
                    console.log('Order Count = ' + orderCount);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {console.log(err);})
        }
        else{
            axios.post('/placeorderud', { 'opt': index + expiry + 'P' + upStrike, 'qty': qty })
            .then((res) => {
                if (res.data.stat == 'Ok') {
                    // startStraddle();
                    setIsStrikePlaced(true)
                    console.log('Entered Strike - ' + upStrike);
                        // console.log('New order placed at - ' + price);
                        console.log('Order Count = ' + orderCount);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {console.log(err);})
        }
        // setEntryPrice(price)
    }
    function placeDownStrike() {
        console.log('Entering strike - ' + downStrike);
        // setEntryStrike(currentStrike)
        if(isStrikePlaced == true){
            axios.post('/placescalpordershort', { 'ce': index + expiry + 'P' + downStrike, 'pe': index + expiry + 'C' + upStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    // startStraddle();
                    console.log('Entered Strike - ' + downStrike);
                    console.log('Exited Strike - ' + upStrike);
                    // console.log('New order placed at - ' + price);
                    console.log('Order Count = ' + orderCount);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {console.log(err);})
        }
        else{
            axios.post('/placeorderud', { 'opt': index + expiry + 'C' + downStrike, 'qty': qty })
            .then((res) => {
                if (res.data.stat == 'Ok') {
                    // startStraddle();
                    setIsStrikePlaced(true)
                    console.log('Entered Strike - ' + downStrike);
                        // console.log('New order placed at - ' + price);
                        console.log('Order Count = ' + orderCount);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {console.log(err);})
        }
    }

    function exitOrder() {
        stopStraddle();
        console.log('Exiting strike - ' + entryStrike);
        axios.post('/exitorder', { 'pe': index + expiry + 'P' + entryStrike, 'ce': index + expiry + 'C' + entryStrike, 'qty': qty })
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

    return (
        <div className='priceFeedSec'>
            <>Straddle</>
            <div className="sub_">
                <div className="priceFeedSettings">
                    <button onClick={startFeed}>Start Feed</button>
                    <button onClick={stopFeed}>Stop Feed</button>
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
                </div>
            </div>
            <div className='sub_'>
                <div className="sub">
                    <span>{index}: {price}</span>
                    <span>UP: {upStrike}</span>
                    <span>Strike: {currentStrike}</span>
                    <span>Down: {downStrike}</span>
                </div>
            </div>
            <div className="sub_">
                <button onClick={placeOrder}>Place</button>
                <button onClick={exitOrder}>Exit</button>
                <button onClick={closeOrder}>Close</button>
                <button onClick={startStraddle}>Start Straddle</button>
                <button onClick={stopStraddle}>Stop Straddle</button>
                <button onClick={placeUpStrike}>Up Strike</button>
                <button onClick={placeDownStrike}>Down Strike</button>
            </div>
        </div>)
}

export default Straddle