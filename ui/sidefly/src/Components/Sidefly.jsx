import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'
import expiryDates from '../Utils/expiryDates.json'

function Sidefly() {

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
    let [orderCount, setOrderCount] = useState(3)
    let [isOrderPlaced, setIsOrderPlaced] = useState(false)
    let [isUpStrikePlaced, setIsUpStrikePlaced] = useState(false)
    let [isDownStrikePlaced, setIsDownStrikePlaced] = useState(false)
    let [isStrikePlaced, setIsStrikePlaced] = useState(false)

    // useEffect(() => {
    //     if (isOrderPlaced == true && entryStrike != currentStrike) {
    //         if (entryPrice - price < - StraddleSpread || entryPrice - price > StraddleSpread) {
    //             console.log('inside');
    //             setIsOrderPlaced(false)
    //             exitOrder();
    //         }
    //         else { console.log('Monitoring Straddle! In '+'[Order count - '+orderCount); }
    //     }
    //     else if (isOrderPlaced == false) {
    //         entryStrike != currentStrike ? exitOrder() : console.log('Monitoring Straddle! Out '+'[Order count - '+orderCount);
    //     }
    //     else {
    //         console.log('Straddle`s Good! ' + '[Order Count - ' + orderCount + ']');
    //     }
    // }, [check])

    // useEffect(() => {
    //     if (isOrderPlaced == true && entryStrike - price < - StraddleSpread) {
    //         placeDownStrike();
    //     }
    //     else if (isOrderPlaced == true && entryStrike - price > StraddleSpread) {
    //             placeUpStrike();
    //     }
    //     else {
    //         console.log('All Good! ' + '[Order Count - ' + orderCount + ']');
    //     }
    // }, [check])

    // console.log(entryStrike);
    // console.log(upStrike);
    // console.log(downStrike);
    useEffect(()=>{
        if(localStorage.getItem("entryStrike") != null){
            setEntryStrike(localStorage.getItem("entryStrike"));
            startFeed();
        } 
        else setEntryStrike(0)
    },[])

    function reloadCheck(){
        if(price < entryStrike){
            setIsOrderPlaced(true)
            setIsDownStrikePlaced(true)
            setIsUpStrikePlaced(false)
            console.log('Down strike was placed - '+entryStrike+' PE');
        }
        else if(price > entryStrike){
            setIsOrderPlaced(true)
            setIsUpStrikePlaced(true)
            setIsDownStrikePlaced(false)
            console.log('Up strike was placed - '+entryStrike+' CE');
        }
        // else {console.log('Cannot determine direction!');}
    }

    useEffect(() => {
        if (isDownStrikePlaced == false && price < entryStrike) {
            if (entryStrike - price > StraddleSpread) {
                // console.log('Going Short...');
                // setIsDownStrikePlaced(true)
                placeDownStrike();
            }
            else{
                console.log('Monitoring PUT Side...');
            }
            // else { console.log('Monitoring Straddle! In '+'[Order count - '+orderCount); }
        }
        else if (isUpStrikePlaced == false && price > entryStrike) {
            // console.log('outside');
            if (entryStrike - price < - StraddleSpread) {
                // setIsUpStrikePlaced(true)
                // console.log('Going Long...');
                placeUpStrike();
            }
            else{
                console.log('Monitoring CALL Side...');
            }
            // entryStrike != currentStrike ? exitOrder() : console.log('Monitoring Straddle! Out '+'[Order count - '+orderCount);
        }
        else{console.log('Monitoring...! [Order count - '+orderCount+']');}
    }, [check])


    function straddleCheck() {
        setCheck(check = check + 1)
    }

    function startStraddle() {
        // count = setInterval(straddleCheck, 1000)
        let straddleIntervalId = setInterval(straddleCheck, 300)
        setStraddle(straddleIntervalId);
        // console.log('Straddle started ✔');
    }
    function stopStraddle() {
        clearInterval(straddle);
        // clearInterval(count);
        // console.log('Straddle stopped ❌');
    }

    function startFeed() {
        let feedIntervalId = setInterval(getPrice, 500)
        setFeed(feedIntervalId);
        console.log('Price Feed started ✔');
    }
    function stopFeed() {
        clearInterval(feed)
        console.log('Price Feed Stopped ❌');
    }

    useEffect(() => {
        setCurrentStrike(Math.round(price / strikeDistance) * strikeDistance)
        // setUpStrike(Math.round(price / strikeDistance) * strikeDistance +50)
        // SetDownStrike(Math.round(price / strikeDistance) * strikeDistance -50)
        setUpStrike(Number(currentStrike)+strikeDistance)
        SetDownStrike(currentStrike-strikeDistance)
    }, [price,entryStrike])

    useEffect(() => {
        if(isDownStrikePlaced == false && isUpStrikePlaced == false && isOrderPlaced == true) {
            enterOrder();
            // console.log('Straddle`s Good! ' + '[Order Count - ' + orderCount + ']');
        }
    }, [entryStrike ,isOrderPlaced])

    function getPrice() {
        axios.get(priceFeedLink)
            .then((res) => {
                // console.log(res.data['lp'])
                setPrice(res.data['lp'])
                // setCurrentStrike(Math.round(res.data['lp'] / strikeDistance) * strikeDistance)
            })
            .catch((err) => {
                console.log(err);
            })
    }


    function placeOrder() {
        // console.log('Entering strike - ' + currentStrike);
        setEntryStrike(currentStrike)
        localStorage.setItem("entryStrike", currentStrike)
        // setUpStrike(currentStrike + 50)
        // SetDownStrike(currentStrike - 50)
        // console.log('Strike - '+currentStrike + ' Up - '+ upStrike+ ' Down - '+ downStrike);
        // setEntryPrice(price)
        axios.post('/placeorder', { 'ce': index + expiry + 'C' + upStrike, 'pe': index + expiry + 'P' + downStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    // setEntryStrike(currentStrike)
                    // setUpStrike(currentStrike+50)
                    // SetDownStrike(currentStrike-50)
                    console.log('New order placed at - ' + currentStrike);
                    setIsOrderPlaced(true);
                    // startStraddle();
                    // console.log('New order placed at - ' + price);
                    // console.log('Order Count = ' + orderCount);
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
        stopStraddle();
        // setUpStrike(currentStrike+50)
        // console.log('Entering strike - ' + upStrike);
        axios.post('/closeshortgolong', { 'sell': index + expiry + 'P' + entryStrike, 'buy': index + expiry + 'C' + entryStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    setIsDownStrikePlaced(false)
                    setIsUpStrikePlaced(true)
                    startStraddle();
                    // console.log('Entered Strike - ' + upStrike);
                    // console.log('Exited Strike - ' + downStrike);
                    console.log('Sold - ' + entryStrike + ' PE');
                    console.log('Bought - ' + entryStrike +' CE');
                    setOrderCount(orderCount= orderCount+1)
                    // console.log('Order Count = ' + orderCount);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => { console.log(err); })
        }
        
        function placeDownStrike() {
            stopStraddle()
            // SetDownStrike(currentStrike-50)
            // console.log('Entering strike - ' + downStrike);
            axios.post('/closeshortgolong', { 'sell': index + expiry + 'C' + entryStrike, 'buy': index + expiry + 'P' + entryStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    setIsDownStrikePlaced(true)
                    setIsUpStrikePlaced(false)
                    startStraddle();
                    console.log('Sold - ' + entryStrike + ' CE');
                    console.log('Bought - ' + entryStrike +' PE');
                    setOrderCount(orderCount= orderCount+1);
                    // console.log('Order Count = ' + orderCount);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => { console.log(err); })

    }

    function exitOrder() {
        stopStraddle();
        axios.post('/exitallorders')
            .then((res) => {
                localStorage.removeItem('entryStrike')
                console.log(res);
                console.log('All order exited!');
                
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function enterOrder() {
        stopStraddle();
        // setUpStrike(Number(currentStrike)+Number(50));
        // console.log('Up strike - '+upStrike);
        // SetDownStrike(Number(currentStrike)-Number(50));
        // console.log('Down strike - '+downStrike);
        if (price < entryStrike) {
            // console.log('Entering Strike - ' + downStrike);
            axios.post('/enterordershort', { 'pe': index + expiry + 'P' + entryStrike, 'qty': qty })
                .then((res) => {
                    // console.log(res);
                    if (res.data.stat == 'Ok') {
                        console.log('PUT entered at ' + entryStrike);
                        setIsOrderPlaced(true)
                        setIsDownStrikePlaced(true)
                        startStraddle();
                    }
                    else {
                        alert('order exiting error❗❌');
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else if (price > entryStrike) {
            // console.log('Entering Strike - ' + upStrike);
            axios.post('/enterorderlong', { 'ce': index + expiry + 'C' + entryStrike, 'qty': qty })
                .then((res) => {
                    // console.log(res);
                    if (res.data.stat == 'Ok') {
                        console.log('CALL entered at ' + entryStrike);
                        setIsOrderPlaced(true)
                        setIsUpStrikePlaced(true)
                        startStraddle();
                    }
                    else {
                        alert('order exiting error❗❌');
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else { console.log('No entries!'); }
    }

    return (
        <div className='priceFeedSec'>
            {/* <>Sidefly</> */}
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
                    {/* <span>UP: {upStrike}</span> */}
                    <span>Current Strike: {currentStrike}</span>
                    <span>Entry Strike: {entryStrike}</span>
                    <span>Up Strike: {upStrike}</span>
                    <span>Down Strike: {downStrike}</span>
                    {/* <span>Down: {downStrike}</span> */}
                </div>
            </div>
            <div className="sub_">
                <button onClick={placeOrder}>Place</button>
                <button onClick={exitOrder}>Exit</button>
                {/* <button onClick={closeOrder}>Close</button> */}
                <button onClick={startStraddle}>Start</button>
                <button onClick={stopStraddle}>Stop</button>
                <button onClick={reloadCheck}>Check</button>

                {/* <button onClick={placeUpStrike}>Up Strike</button> */}
                {/* <button onClick={placeDownStrike}>Down Strike</button> */}
            </div>
        </div>)
}

export default Sidefly