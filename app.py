from flask import Flask, request, jsonify
from recommendation_model import get_user_recommendations

app = Flask(__name__)


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        recommendations = get_user_recommendations(user_id)
        return jsonify(recommendations)
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return jsonify({"error": "Failed to generate recommendations"}), 500


if __name__ == '__main__':
    app.run(debug=True)