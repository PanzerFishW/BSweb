import os
from flask import Flask, send_from_directory, abort

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Главная страница
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

# Страница "Наши домики"
@app.route('/houses')
@app.route('/houses/')
def houses():
    return send_from_directory(BASE_DIR, 'houses.html')

# Статика (CSS, JS, изображения) – стандартная папка
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'static'), filename)

# Фоновые изображения (используются в CSS как ../../backgrounds/...)
@app.route('/backgrounds/<path:filename>')
def backgrounds(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'backgrounds'), filename)

# Любые другие файлы в корне (например, robots.txt, favicon.ico)
@app.route('/<path:filename>')
def root_files(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if os.path.isfile(filepath):
        return send_from_directory(BASE_DIR, filename)
    abort(404)

# Запуск сервера
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 80))
    app.run(host='0.0.0.0', port=port)