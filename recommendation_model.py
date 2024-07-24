from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import json
import os
from bson import ObjectId

# MongoDB connection
client = MongoClient(os.environ.get('MONGODB_URI',
                                    'mongodb+srv://linkesvarun:JUF076PvImPU5eQt@clustertest.chekyvj.mongodb.net/sample_tester?tlsAllowInvalidCertificates=true'))
db = client['sample_tester']
print(f"Connected to database: {db.name}")


def safe_convert_genre_ids(x):
    if isinstance(x, list):
        return [int(id['id']) if isinstance(id, dict) else int(id) for id in x if str(id).isdigit() or (isinstance(id, dict) and str(id.get('id', '')).isdigit())]
    if pd.isna(x) or x is None:
        return []
    if isinstance(x, (int, float)):
        return [int(x)]
    if isinstance(x, str):
        try:
            return [int(id) for id in json.loads(x) if str(id).isdigit()]
        except json.JSONDecodeError:
            return [int(x)] if x.isdigit() else []
    return []


def get_user_ratings(user_id):
    user_reviews = list(db.reviews.find({'user': user_id}))
    user_movies = list(db.movies.find({'_id': {'$in': [review['movie'] for review in user_reviews]}}))
    user_ratings = pd.DataFrame(user_reviews).merge(pd.DataFrame(user_movies), left_on='movie', right_on='_id')
    print(f"User ratings count: {len(user_ratings)}")
    return user_ratings[['dbid', 'rating', 'title', 'genre_ids']]


def clean_user_preferred_genres(user_preferred_genres):
    if isinstance(user_preferred_genres, list):
        return [genre for genre in user_preferred_genres if isinstance(genre, dict) and 'id' in genre]
    return []

def calculate_genre_score(movie_genres, user_genres):
    try:
        movie_genres = set(movie_genres)
        user_genres = set(user_genres)
        intersection = len(movie_genres & user_genres)
        union = len(movie_genres | user_genres)
        return intersection / union if union > 0 else 0
    except Exception as e:
        print(f"Error calculating genre score: {e}")
        print(f"movie_genres: {movie_genres}")
        print(f"user_genres: {user_genres}")
        return 0


def get_user_recommendations(user_id):
    user = db.users.find_one({'_id': user_id})
    if not user:
        print(f"User not found: {user_id}")
        return []

    print(f"User found: {user_id}")
    user_preferred_genres = clean_user_preferred_genres(user.get('preferredGenres', []))
    user_ratings = get_user_ratings(user_id)
    print(f"User ratings count: {len(user_ratings)}")

    chunk_size = 50
    top_recommendations = []

    total_movies = db.movies.count_documents({})
    print(f"Total movies in database: {total_movies}")

    for i in range(0, total_movies, chunk_size):
        movie_chunk = list(db.movies.find().skip(i).limit(chunk_size))

        if i == 0 and movie_chunk:
            print("Sample of raw MongoDB data:")
            print(json.dumps(movie_chunk[0], default=str, indent=2))

        chunk_df = pd.DataFrame(movie_chunk)
        print(f"Processing chunk {i // chunk_size + 1} with {len(chunk_df)} movies")

        if chunk_df.empty:
            continue

        chunk_df['genre_ids'] = chunk_df['genre_ids'].apply(safe_convert_genre_ids)
        chunk_df['genres_str'] = chunk_df['genre_ids'].apply(lambda x: ' '.join(map(str, x)))
        chunk_df['content'] = chunk_df['genres_str'] + ' ' + chunk_df['overview'].fillna('')

        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(chunk_df['content'])
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

        chunk_ratings = user_ratings.set_index('dbid').reindex(chunk_df['dbid'], fill_value=0)['rating'].values
        content_scores = np.dot(cosine_sim, chunk_ratings)
        chunk_df['content_score'] = content_scores

        user_genre_ids = [genre['id'] for genre in user_preferred_genres]

        chunk_df['genre_score'] = chunk_df['genre_ids'].apply(
            lambda x: calculate_genre_score(x, user_genre_ids)
        )

        chunk_df['final_score'] = (chunk_df['genre_score'] + chunk_df['content_score']) / 2
        chunk_recommendations = chunk_df[['dbid', 'title', 'final_score']].to_dict('records')

        top_recommendations.extend(chunk_recommendations)
        top_recommendations.sort(key=lambda x: x['final_score'], reverse=True)
        top_recommendations = top_recommendations[:10]  # Keep only top 10

    print(f"Generated {len(top_recommendations)} recommendations")
    return top_recommendations


def prepare_data():
    # This function is now a no-op, as we're processing data on-demand
    pass