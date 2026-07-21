import { supabaseUrl, supabaseKey } from "../utils/supabase";

const POST_API_URL = supabaseUrl ? `${supabaseUrl}/rest/v1/posts` : null;
const REST_HEADERS = {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
};

function ensureConfig() {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY values to the environment.');
    }
}

function getHeaders() {
    ensureConfig();
    return REST_HEADERS;
}

async function handleResponse(response, fallbackMessage) {
    if (!response.ok) {
        let detail = fallbackMessage;

        try {
            const errorData = await response.json();
            detail = errorData.message || errorData.error || detail;
        } catch {
            const text = await response.text();
            detail = text || detail;
        }

        throw new Error(`${fallbackMessage}: ${detail}`);
    }

    return response.json();
}

// Get listar posts
export async function fetchPosts() {
    const response = await fetch(POST_API_URL, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response, 'Failed to fetch posts');
}

//post crear post
export async function createPost(postData) {
    const payload = {
        title: postData.title,
        content: postData.content,
    };

    const response = await fetch(POST_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    return handleResponse(response, 'Failed to create posts');
}

// put actualizar post

export async function updatePost(postId, postData) {
    const payload = {
        title: postData.title,
        content: postData.content,
    };

    const response = await fetch(`${POST_API_URL}?id=eq.${postId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    return handleResponse(response, 'Failed to update posts');
}

// delete eliminar post

export async function deletePost(postId) {
    const response = await fetch(`${POST_API_URL}?id=eq.${postId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    return handleResponse(response, 'Failed to delete posts');
}