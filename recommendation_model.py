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


def safe_convert_genre_ids(x):
    if isinstance(x, list):
        return x
    if pd.isna(x):
        return []
    if isinstance(x, (int, float)):
        return [int(x)]
    if isinstance(x, str):
        try:
            return json.loads(x)
        except json.JSONDecodeError:
            return [x]
    return []


def get_user_ratings(user_id):
    user_reviews = list(db.reviews.find({'user': user_id}))
    user_movies = list(db.movies.find({'_id': {'$in': [review['movie'] for review in user_reviews]}}))
    user_ratings = pd.DataFrame(user_reviews).merge(pd.DataFrame(user_movies), left_on='movie', right_on='_id')
    return user_ratings[['dbid', 'rating', 'title', 'genre_ids']]


def clean_user_preferred_genres(user_preferred_genres):
    if isinstance(user_preferred_genres, list):
        return [genre for genre in user_preferred_genres if isinstance(genre, dict) and 'id' in genre]
    return []


def get_user_recommendations(user_id):
    user = db.users.find_one({'_id': user_id})
    if not user:
        return []

    user_preferred_genres = clean_user_preferred_genres(user.get('preferredGenres', []))
    user_ratings = get_user_ratings(user_id)

    # Process movies in chunks
    chunk_size = 1000
    all_recommendations = []

    for chunk in db.movies.find().batch_size(chunk_size):
        chunk_df = pd.DataFrame(list(chunk))

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

        def calculate_genre_score(movie_genres, user_genres):
            movie_genres = set(movie_genres)
            user_genres = set(user_genres)
            intersection = len(movie_genres & user_genres)
            union = len(movie_genres | user_genres)
            return intersection / union if union > 0 else 0

        chunk_df['genre_score'] = chunk_df['genre_ids'].apply(
            lambda x: calculate_genre_score(x, user_genre_ids)
        )

        chunk_df['final_score'] = (chunk_df['genre_score'] + chunk_df['content_score']) / 2

        all_recommendations.extend(chunk_df[['dbid', 'title', 'final_score']].to_dict('records'))

    all_recommendations.sort(key=lambda x: x['final_score'], reverse=True)
    return all_recommendations[:10]


def prepare_data():
    # This function is now a no-op, as we're processing data on-demand
    pass