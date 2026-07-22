import { supabaseUrl, supabaseKey } from "../utils/supabase";
const POSTS_API_URL = `${supabaseUrl}/rest/v1/posts`;

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
    };
}
    
// Get listar posts
export async function fetchPosts() {
    const response = await fetch(POSTS_API_URL, {
        method: 'GET',
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.error}`);
    }
    return response.json();
}

export async function createPost(postData) {
    const response = await fetch(POSTS_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData)
    });
    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.error.message}`);
    }
    return response.json();
}

export async function updatePost(postId, postData) {
    const response = await fetch(`${POSTS_API_URL}/${postId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(postData)
    });
    if (!response.ok) {
        throw new Error(`Failed to update post: ${response.error.message}`);
    }
    return response.json();
}
 
export async function deletePost(postId) {
    const response = await fetch(`${POSTS_API_URL}/${postId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.error.message}`);
    }
    return response.json();
}
 