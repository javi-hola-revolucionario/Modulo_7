import { supabaseUrl, supabaseKey } from "../utils/supabase";

const POST_API_URL = `${supabaseUrl}/rest/v1/posts`;

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorizacion': `Bearer ${supabaseKey}`,
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

    export async function delete(postId) {
    const response = await fetch(`${POST_API_URL}?id=eq.${postId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok){
        throw new Error('Failed to delete posts');
    }

    return response.json();
    }