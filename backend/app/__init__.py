from flask import Flask
from flask_cors import CORS
from api_helper import ShoonyaApiPy

api = ShoonyaApiPy()

app = Flask(__name__)
CORS(app)

# Registering routes
from app.routes.routes import routes
app.register_blueprint(routes)
#-----