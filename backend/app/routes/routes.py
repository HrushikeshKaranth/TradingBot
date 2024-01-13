from flask import Blueprint
from app.controllers.controller import login, logout, pricefeed

# Creating routes Blueprint
routes = Blueprint('routes', __name__)
# -----

# for login
routes.route('/login', methods=['GET'])(login)
routes.route('/logout', methods=['GET'])(logout)
routes.route('/pricefeed', methods=['GET'])(pricefeed)
