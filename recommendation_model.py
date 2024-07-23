from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import json
import ast
import re

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

def clean_user_preferred_genres(user_preferred_genres_str):
    cleaned_str = re.sub(r"ObjectId\('.*?'\)", '"ObjectId"', user_preferred_genres_str)
    cleaned_str = cleaned_str.replace("'", '"')
    return cleaned_str

def get_user_recommendations(user_id, cosine_sim, movies_df, reviews_df, user_movie_ratings, users_df):
    user = users_df[users_df['_id'] == user_id]
    if user.empty:
        return pd.DataFrame()

    user_preferred_genres_str = user['preferredGenres'].iloc[0]

    try:
        cleaned_str = clean_user_preferred_genres(user_preferred_genres_str)
        user_preferred_genres = json.loads(cleaned_str)
    except (ValueError, SyntaxError) as e:
        print(f"Error converting user_preferred_genres: {e}")
        return pd.DataFrame()

    if not isinstance(user_preferred_genres, list) or not all(isinstance(item, dict) for item in user_preferred_genres):
        print("Invalid format for user_preferred_genres.")
        return pd.DataFrame()

    user_ratings = get_user_ratings(user_id, reviews_df, movies_df)

    movie_indices = movies_df.index
    movie_ratings = user_ratings.set_index('dbid').reindex(movie_indices, fill_value=0)['rating'].values

    content_scores = np.dot(cosine_sim, movie_ratings)

    movies_df['content_score'] = content_scores

    if not user_movie_ratings[user_id].isna().all():
        similar_users = user_movie_ratings.corrwith(user_movie_ratings[user_id])
        similar_users_df = pd.DataFrame(similar_users, columns=['correlation'])
        similar_users_df.dropna(inplace=True)
        similar_users_df = similar_users_df.sort_values('correlation', ascending=False)
    else:
        similar_users_df = pd.DataFrame(index=user_movie_ratings.index, columns=['correlation']).fillna(0)

    recommended_movies = movies_df.copy()

    user_genre_ids = [genre['id'] for genre in user_preferred_genres]

    def calculate_genre_score(movie_genres, user_genres):
        if isinstance(movie_genres, str):
            movie_genres = json.loads(movie_genres)
        if isinstance(user_genres, str):
            user_genres = json.loads(user_genres)
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
    movies_df = pd.read_csv('movies.csv', engine='python')
    reviews_df = pd.read_csv('reviews.csv')
    users_df = pd.read_csv('users.csv')

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