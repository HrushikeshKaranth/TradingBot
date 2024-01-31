from app import app, api
from flask import request, jsonify
from api_helper import ShoonyaApiPy
import logging
import pyotp
import pandas as pd
import time

tokenValue = ''

def placeorderoptb():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['option'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    print(ord1)
    return jsonify(ord1)

def placeorderopts():
    res = request.get_json()
    print(res)
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                            exchange='NFO', tradingsymbol=res['option'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    # ord2 = api.place_order(buy_or_sell='S', product_type='M',
    #                         exchange='NFO', tradingsymbol=res['pe'], 
    #                         quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
    #                         retention='DAY', remarks='order2')
    # print(ord1)
    print(ord1)
    return jsonify(ord1)

def golongopt():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['option'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')

    print(ord1)
    return jsonify(ord1)

def goshortopt():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                            exchange='NFO', tradingsymbol=res['option'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    print(ord1)
    return jsonify(ord1)


def exitallorders():
    a=api.positions()
    a=pd.DataFrame(a)
    for i in a.itertuples():
        if int(i.netqty)<0: 
            api.place_order(buy_or_sell='B', product_type='M', exchange='NFO', tradingsymbol=i.tysm,  quantity=int(i.netqty), discloseqty=0,price_type='MKT', price=0, trigger_price=None, retention='DAY', remarks='my_order_001')
        if int(i.netqty)>0: 
            api.place_order(buy_or_sell='S', product_type='M', exchange='NFO', tradingsymbol=i.tysm,  quantity=int(i.netqty), discloseqty=0,price_type='MKT', price=0, trigger_price=None,retention='DAY', remarks='my_order_002')
    return jsonify(a)


def getoptiontoken():
    res = request.get_json()
    token = api.searchscrip('NFO', res['option'])
    global tokenValue
    tokenValue = repr(int(token['values'][0]['token']))
    # data = api.get_quotes(exchange='NFO', token=tokenValue)
    return jsonify(tokenValue)

def getoptionfeed():
    data = api.get_quotes(exchange='NFO', token=tokenValue)
    return jsonify(data)
    # global tokenValue
    # print (tokenValue)
    # print(data)