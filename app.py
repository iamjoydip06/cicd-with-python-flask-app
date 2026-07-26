from flask import Flask, request, jsonify, render_template
from datetime import datetime

app = Flask(__name__)

notes = []
next_id = 1


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)


@app.route('/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    note = next((n for n in notes if n['id'] == note_id), None)
    if note is None:
        return jsonify({'error': 'Note not found'}), 404
    return jsonify(note)


@app.route('/notes', methods=['POST'])
def create_note():
    global next_id
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400

    note = {
        'id': next_id,
        'title': data['title'],
        'content': data.get('content', ''),
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    next_id += 1
    notes.append(note)
    return jsonify(note), 201


@app.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    note = next((n for n in notes if n['id'] == note_id), None)
    if note is None:
        return jsonify({'error': 'Note not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    if 'title' in data:
        note['title'] = data['title']
    if 'content' in data:
        note['content'] = data['content']
    note['updated_at'] = datetime.now().isoformat()

    return jsonify(note)


@app.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    global notes
    note = next((n for n in notes if n['id'] == note_id), None)
    if note is None:
        return jsonify({'error': 'Note not found'}), 404

    notes = [n for n in notes if n['id'] != note_id]
    return jsonify({'message': 'Note deleted'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
