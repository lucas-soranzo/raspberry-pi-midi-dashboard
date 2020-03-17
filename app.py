import sys
import asyncio
import os

import tornado.ioloop
import tornado.web

from handlers.main import MainHandler

from log import log

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

def make_app():
    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
    }
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/static/(.*)", tornado.web.StaticFileHandler,dict(path=settings['static_path'])),
    ], **settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    log.info('Starting')
    tornado.ioloop.IOLoop.current().start()