from tornado.web import RequestHandler
from templates.loader import loader

class MainHandler(RequestHandler):
    def get(self):
        self.write(loader.load('dashboard.html').generate(**self.settings))