from flask import Flask, request, jsonify
from recommendation_model import get_user_recommendations, prepare_data

app = Flask(__name__)

# Load and prepare data
movies_df, reviews_df, users_df, cosine_sim, user_movie_ratings = prepare_data()


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    recommendations = get_user_recommendations(user_id, cosine_sim, movies_df, reviews_df, user_movie_ratings, users_df)

    return jsonify(recommendations.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True)