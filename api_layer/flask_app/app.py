from flask import Flask, jsonify, request, abort

app = Flask(__name__)

_store = {
    1: {
        "id": 1,
        "name": "subtract",
        "description": "Calculates a-b and returns the result",
        "tags": ["math"],
    },
    2: {
        "id": 2,
        "name": "divide",
        "description": "Divides two numbers with float precision",
        "tags": ["math"],
    },
}


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "layer": "flask"})


@app.route("/operations", methods=["GET"])
def list_operations():
    return jsonify(list(_store.values()))


@app.route("/operations/<int:operation_id>", methods=["GET"])
def get_operation(operation_id):
    operation = _store.get(operation_id)
    if not operation:
        abort(404, description="Operation not registered")
    return jsonify(operation)


@app.route("/operations", methods=["POST"])
def register_operation():
    payload = request.get_json(force=True)
    operation_id = payload.get("id")
    if not operation_id or operation_id in _store:
        abort(400, description="Invalid or duplicate id")
    operation = {
        "id": operation_id,
        "name": payload.get("name"),
        "description": payload.get("description", ""),
        "tags": payload.get("tags", []),
    }
    _store[operation_id] = operation
    return jsonify(operation), 201


@app.route("/operations/<int:operation_id>", methods=["DELETE"])
def delete_operation(operation_id):
    if operation_id not in _store:
        abort(404, description="Operation not registered")
    _store.pop(operation_id)
    return "", 204
