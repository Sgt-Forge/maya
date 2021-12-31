from multiprocessing import Process, Event, Manager
from flask import Flask, Response, request
from flask_cors import CORS
from celery import Celery
import animations
import redis
import tasks
import time
import random
import board
import neopixel
import signal
import json
import pixel_matrix

EXIT_EVENT=Event()

random.seed()
app = Flask(__name__)
CORS(app)

listen = ['default']
redis_url = 'redis://localhost:6379/0'
conn = redis.from_url(redis_url)
# Initialize Celery
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

def push(color_data):
    conn.lpush('QUEUE', color_data)


def logMessage(message):
    print('==========', ' [ ', message, ' ] ', '==========', '\n')

threads = []
def light_controller():
    logMessage('Starting Light Controller')
    while True:
        message = conn.rpop('QUEUE')
        if message is not None:
            data = message.decode('utf-8')
            json_dump = json.loads(data)
            logMessage(data)
            color = json_dump['color'].lstrip('#')
            color = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
            conn.mset({'color': bytes(color) })
            if json_dump['animation'] == 'new_color':
                logMessage('Received New Color')
                continue
                
            logMessage('Received New Animation')
            if len(threads) > 0:
                for t in threads:
                    t.terminate()

            animation = animations.animations_map[json_dump['animation']]

            logMessage('animation')
            logMessage(animation)
            logMessage('color')
            logMessage(color)

            bounce_process = Process(target=animation, args=(color,), daemon=True)
            bounce_process.start()
            threads.append(bounce_process)
        if EXIT_EVENT.is_set():
            logMessage('Terminate light controller with EXIT EVENT')
            for t in threads:
                t.terminate()
            animations.fill((0, 0, 0))
            break
    return
            


@celery.task
def add_color_to_queue(color_data):
    push(color_data)


@app.route('/animation', methods=['POST', 'OPTIONS'])
def set_animation():
    if request.method == 'OPTIONS':
        return Response(status=200)
    content = request.json
    jsonStuff = json.dumps(content)
    response = Response(jsonStuff, status=200, mimetype='application/json')
    logMessage('jsonStuff')
    logMessage(jsonStuff)
    add_color_to_queue.delay(jsonStuff)
    return response


def signal_handler(signum, frame):
    logMessage('SIGINT detected. EXIT_EVENT set')
    EXIT_EVENT.set()


def runApp():
    app.run(port=5000, host='0.0.0.0')

if __name__ == '__main__':
    logMessage('Start Main')
    signal.signal(signal.SIGINT, signal_handler)
    flask_process = Process(target=runApp, daemon=True)
    flask_process.start()

    light_controller()
    flask_process.terminate()
    logMessage('Terminating Main')
    exit