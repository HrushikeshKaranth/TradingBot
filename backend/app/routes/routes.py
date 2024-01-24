from flask import Blueprint
from app.controllers.controller import login, logout, pricefeednifty, pricefeedmidcap, pricefeedfinnifty, pricefeedbanknifty, placeorder

# Creating routes Blueprint
routes = Blueprint('routes', __name__)
# -----

# for login
routes.route('/login', methods=['GET'])(login)
routes.route('/logout', methods=['GET'])(logout)
routes.route('/pricefeednifty', methods=['GET'])(pricefeednifty)
routes.route('/pricefeedbanknifty', methods=['GET'])(pricefeedbanknifty)
routes.route('/pricefeedfinnifty', methods=['GET'])(pricefeedfinnifty)
routes.route('/pricefeedmidcap', methods=['GET'])(pricefeedmidcap)
routes.route('/placeorder', methods=['POST'])(placeorder)
