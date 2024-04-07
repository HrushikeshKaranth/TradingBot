from app import app, api
from flask import request, jsonify
from api_helper import ShoonyaApiPy
import time



def df_placeorder_sell():
    res = request.get_json()
    print(res['ce'])
    print(res['pe'])
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                           exchange='NFO', tradingsymbol=res['ce'],
                           quantity=res['qty'], discloseqty=0, price_type='MKT', price=0, trigger_price=0,
                           retention='DAY', remarks='order1')
    ord2 = api.place_order(buy_or_sell='S', product_type='M',
                           exchange='NFO', tradingsymbol=res['pe'],
                           quantity=res['qty'], discloseqty=0, price_type='MKT', price=0, trigger_price=0,
                           retention='DAY', remarks='order2')
    print(ord1)
    print(ord2)
    return jsonify(ord1, ord2)

def df_placeorder_buy():
    res = request.get_json()
    print(res['ce'])
    print(res['pe'])
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                           exchange='NFO', tradingsymbol=res['ce'],
                           quantity=res['qty'], discloseqty=0, price_type='MKT', price=0, trigger_price=0,
                           retention='DAY', remarks='order1')
    ord2 = api.place_order(buy_or_sell='S', product_type='M',
                           exchange='NFO', tradingsymbol=res['pe'],
                           quantity=res['qty'], discloseqty=0, price_type='MKT', price=0, trigger_price=0,
                           retention='DAY', remarks='order2')
    print(ord1)
    print(ord2)
    return jsonify(ord1, ord2)

def getPositions():
    res = api.get_positions()
    # print(res)
    mtm = 0
    pnl=0
    daymtm = 0
    for i in res:
        mtm += float(i['urmtom'])
        pnl += float(i['rpnl'])
        daymtm = mtm+pnl
    return jsonify(daymtm)
    # return jsonify(res)
