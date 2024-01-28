from flask import Blueprint
from app.controllers.controller import login, logout, pricefeednifty, pricefeedmidcap, pricefeedfinnifty, pricefeedbanknifty, placeorder, exitorder, pricestream,setsession,placescalporderce,placescalporderpe,placescalporderlong,placescalpordershort,scalping

# Creating routes Blueprint
routes = Blueprint('routes', __name__)
# -----

# for login
routes.route('/login', methods=['GET'])(login)
routes.route('/setsession', methods=['POST'])(setsession)
routes.route('/logout', methods=['GET'])(logout)
routes.route('/pricefeednifty', methods=['GET'])(pricefeednifty)
routes.route('/pricefeedbanknifty', methods=['GET'])(pricefeedbanknifty)
routes.route('/pricefeedfinnifty', methods=['GET'])(pricefeedfinnifty)
routes.route('/pricefeedmidcap', methods=['GET'])(pricefeedmidcap)
routes.route('/pricestream', methods=['GET'])(pricestream)
routes.route('/placeorder', methods=['POST'])(placeorder)
routes.route('/exitorder', methods=['POST'])(exitorder)
routes.route('/placescalporderce', methods=['POST'])(placescalporderce)
routes.route('/placescalporderpe', methods=['POST'])(placescalporderpe)
routes.route('/placescalporderlong', methods=['POST'])(placescalporderlong)
routes.route('/placescalpordershort', methods=['POST'])(placescalpordershort)
routes.route('/scalping', methods=['POST'])(scalping)
