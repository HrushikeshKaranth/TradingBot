from app import app
from waitress import serve

if __name__ == "__main__":
    print('Server running...')
    # app.run(host='localhost', port=5000, debug=True)
    serve(app, host='localhost', port=5000)
    print('Server stopped...')

