import os
from flask import Flask, render_template, send_from_directory

# Configure template_folder as the root folder so index.html is hosted at the root (for GitHub Pages compatibility)
app = Flask(__name__, template_folder='.')

@app.route('/')
def home():
    return render_template('index.html')

# Endpoint to handle downloads of resume and certifications
@app.route('/download/<path:filename>')
def download_file(filename):
    directory = os.path.join(app.root_path, 'static', 'assets')
    return send_from_directory(directory, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
