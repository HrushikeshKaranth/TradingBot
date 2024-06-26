from flask import Blueprint
from app.controllers.controller import login, logout, pricefeednifty, pricefeedmidcap, pricefeedfinnifty, pricefeedbanknifty, placeorder, exitorder, pricestream,setsession,placescalporderce,placescalporderpe,placescalporderlong,placescalpordershort,scalping,exitallorders,pricefeedsensex,getoptiontoken,getoptionfeed,placeorderud,closeshortgolong,enterorderlong,enterordershort,placeordersensex,closeshortgolongsensex,exitallorderssensex,enterordershortsensex,enterorderlongsensex
from app.controllers.scalpingController import placeorderoptb,placeorderopts,golongopt,goshortopt
from app.controllers.doubleFlyController import df_placeorder_buy,df_placeorder_sell,getPositions
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
routes.route('/pricefeedsensex', methods=['GET'])(pricefeedsensex)
routes.route('/pricestream', methods=['GET'])(pricestream)
routes.route('/getoptionfeed', methods=['GET'])(getoptionfeed)
routes.route('/placeorder', methods=['POST'])(placeorder)
routes.route('/placeordersensex', methods=['POST'])(placeordersensex)
routes.route('/exitorder', methods=['POST'])(exitorder)
routes.route('/placescalporderce', methods=['POST'])(placescalporderce)
routes.route('/placescalporderpe', methods=['POST'])(placescalporderpe)
routes.route('/placescalporderlong', methods=['POST'])(placescalporderlong)
routes.route('/placescalpordershort', methods=['POST'])(placescalpordershort)
routes.route('/scalping', methods=['POST'])(scalping)
routes.route('/exitallorders', methods=['GET'])(exitallorders)
routes.route('/exitallorderssensex', methods=['GET'])(exitallorderssensex)
routes.route('/getoptiontoken', methods=['POST'])(getoptiontoken)
routes.route('/placeorderoptb', methods=['POST'])(placeorderoptb)
routes.route('/placeorderopts', methods=['POST'])(placeorderopts)
routes.route('/placeorderud', methods=['POST'])(placeorderud)
routes.route('/golongopt', methods=['POST'])(golongopt)
routes.route('/goshortopt', methods=['POST'])(goshortopt)
routes.route('/closeshortgolong', methods=['POST'])(closeshortgolong)
routes.route('/closeshortgolongsensex', methods=['POST'])(closeshortgolongsensex)
routes.route('/enterorderlong', methods=['POST'])(enterorderlong)
routes.route('/enterorderlongsensex', methods=['POST'])(enterorderlongsensex)
routes.route('/enterordershort', methods=['POST'])(enterordershort)
routes.route('/enterordershortsensex', methods=['POST'])(enterordershortsensex)
routes.route('/df_placeorder_sell', methods=['POST'])(df_placeorder_sell)
routes.route('/df_placeorder_buy', methods=['POST'])(df_placeorder_buy)
routes.route('/getpositions', methods=['GET'])(getPositions)

