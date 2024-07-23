from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import json
import ast
import re
from bson import ObjectId

# MongoDB connection
client = MongoClient('mongodb+srv://linkesvarun:JUF076PvImPU5eQt@clustertest.chekyvj.mongodb.net/sample_tester?tlsAllowInvalidCertificates=true')
db = client['sample_tester']

def safe_convert_genre_ids(x):
    if pd.isna(x):
        return []
    try:
        result = ast.literal_eval(x)
        if isinstance(result, list):
            return result
        elif isinstance(result, (int, float)):
            return [result]
        else:
            return []
    except (ValueError, SyntaxError):
        return [x] if isinstance(x, (int, float, str)) else []

def get_user_ratings(user_id, reviews_df, movies_df):
    user_reviews = reviews_df[reviews_df['user'] == user_id]
    user_ratings = pd.merge(user_reviews, movies_df, left_on='movie', right_on='_id')
    return user_ratings[['dbid', 'rating', 'title', 'genre_ids']]

def clean_user_preferred_genres(user_preferred_genres):
    return [genre for genre in user_preferred_genres if isinstance(genre, dict) and 'id' in genre]

def get_user_recommendations(user_id, cosine_sim, movies_df, reviews_df, user_movie_ratings, users_df):
    user = users_df[users_df['_id'] == user_id]
    if user.empty:
        return pd.DataFrame()

    user_preferred_genres = user['preferredGenres'].iloc[0]
    user_preferred_genres = clean_user_preferred_genres(user_preferred_genres)

    user_ratings = get_user_ratings(user_id, reviews_df, movies_df)

    movie_indices = movies_df.index
    movie_ratings = user_ratings.set_index('dbid').reindex(movie_indices, fill_value=0)['rating'].values

    content_scores = np.dot(cosine_sim, movie_ratings)

    movies_df['content_score'] = content_scores

    if not user_movie_ratings[str(user_id)].isna().all():
        similar_users = user_movie_ratings.corrwith(user_movie_ratings[str(user_id)])
        similar_users_df = pd.DataFrame(similar_users, columns=['correlation'])
        similar_users_df.dropna(inplace=True)
        similar_users_df = similar_users_df.sort_values('correlation', ascending=False)
    else:
        similar_users_df = pd.DataFrame(index=user_movie_ratings.index, columns=['correlation']).fillna(0)

    recommended_movies = movies_df.copy()

    user_genre_ids = [genre['id'] for genre in user_preferred_genres]

    def calculate_genre_score(movie_genres, user_genres):
        movie_genres = set(movie_genres)
        user_genres = set(user_genres)
        intersection = len(movie_genres & user_genres)
        union = len(movie_genres | user_genres)
        return intersection / union if union > 0 else 0

    recommended_movies['genre_score'] = recommended_movies['genre_ids'].apply(
        lambda x: calculate_genre_score(x, user_genre_ids)
    )

    recommended_movies['cf_score'] = recommended_movies['dbid'].apply(
        lambda x: similar_users_df['correlation'].get(x, 0)
    )

    recommended_movies['final_score'] = (
        recommended_movies['cf_score'] +
        recommended_movies['genre_score'] +
        recommended_movies['content_score']) / 3

    recommended_movies = recommended_movies.sort_values('final_score', ascending=False)

    return recommended_movies[['dbid', 'title', 'final_score']].head(10)

def prepare_data():
    # Fetch data from MongoDB
    movies_cursor = db.movies.find({})
    reviews_cursor = db.reviews.find({})
    users_cursor = db.users.find({})

    # Convert to DataFrames
    movies_df = pd.DataFrame(list(movies_cursor))
    reviews_df = pd.DataFrame(list(reviews_cursor))
    users_df = pd.DataFrame(list(users_cursor))

    # Convert ObjectId to string for easier handling
    movies_df['_id'] = movies_df['_id'].astype(str)
    reviews_df['_id'] = reviews_df['_id'].astype(str)
    reviews_df['user'] = reviews_df['user'].astype(str)
    reviews_df['movie'] = reviews_df['movie'].astype(str)
    users_df['_id'] = users_df['_id'].astype(str)

    movies_df['genre_ids'] = movies_df['genre_ids'].apply(safe_convert_genre_ids)
    movies_df['genres_str'] = movies_df['genre_ids'].apply(lambda x: ' '.join(map(str, x)))
    movies_df['content'] = movies_df['genres_str'] + ' ' + movies_df['overview'].fillna('')

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(movies_df['content'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    movie_reviews = pd.merge(reviews_df, movies_df, left_on='movie', right_on='_id')
    user_movie_ratings = movie_reviews.pivot_table(index='dbid', columns='user', values='rating')
    user_movie_ratings = user_movie_ratings.fillna(0)

    return movies_df, reviews_df, users_df, cosine_sim, user_movie_ratings