from flask import Flask, request, jsonify
from recommendation_model import get_user_recommendations, prepare_data

app = Flask(__name__)

try:
    # Load and prepare data
    movies_df, reviews_df, users_df, cosine_sim, user_movie_ratings = prepare_data()
except Exception as e:
    print(f"Error during data preparation: {e}")
    movies_df, reviews_df, users_df, cosine_sim, user_movie_ratings = None, None, None, None, None


@app.route('/recommend', methods=['POST'])
def recommend():
    if any(v is None for v in [movies_df, reviews_df, users_df, cosine_sim, user_movie_ratings]):
        return jsonify({"error": "Data preparation failed. Please check the logs."}), 500

    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        recommendations = get_user_recommendations(user_id, cosine_sim, movies_df, reviews_df, user_movie_ratings,
                                                   users_df)
        return jsonify(recommendations.to_dict(orient='records'))
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return jsonify({"error": "Failed to generate recommendations"}), 500


if __name__ == '__main__':
    app.run(debug=True)