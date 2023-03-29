from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from wsgi import app

http_server = HTTPServer(WSGIContainer(app))
http_server.listen(5000)  # Replace with the port number you want to use
IOLoop.instance().start()
