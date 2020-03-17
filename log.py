import logging

FORMAT = '%(asctime)-15s - 	%(levelname)-10s - %(message)s'
logging.basicConfig(format=FORMAT)

log = logging.getLogger()
log.setLevel(logging.DEBUG)