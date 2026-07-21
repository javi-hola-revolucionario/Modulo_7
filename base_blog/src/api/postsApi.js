import { supabaseUrl, supabaseKey } from "../utils/supabase";

const POST_API_URL = supabaseUrl ? `${supabaseUrl}/rest/v1/posts` : null;

function ensureConfig() {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY values to the environment.');
    }
}

function getHeaders() {
    ensureConfig();

    return {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
    };
}

// Get listar posts
export async function fetchPosts() {
    const response = await fetch(POST_API_URL, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok){
        throw new Error('Failed to fetch posts');
    }

    return response.json();
}

//post crear post
export async function createPost(postData) {
    const response = await fetch(POST_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData),
    });

    if (!response.ok){
        throw new Error('Failed to create posts');
    }

    return response.json();
}

// put actualizar post

    export async function updatePost(postId,postData) {
    const response = await fetch(`${POST_API_URL}?id=eq.${postId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(postData),
    });

    if (!response.ok){
        throw new Error('Failed to update posts');
    }

    return response.json();
    }

// delete eliminar post

    export async function deletePost(postId) {
    const response = await fetch(`${POST_API_URL}?id=eq.${postId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok){
        throw new Error('Failed to delete posts');
    }

    return response.json();
    }