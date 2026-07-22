import { supabase } from "../utils/supabase";

const POST_TABLE = 'posts';

function ensureClient() {
    if (!supabase) {
        throw new Error('Supabase client is not configured.');
    }
}

export async function fetchPosts() {
    ensureClient();

    const { data, error } = await supabase.from(POST_TABLE).select('*').order('id', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    return data || [];
}

export async function createPost(postData) {
    ensureClient();

    const payload = {
        title: postData.title,
        content: postData.content,
    };

    const { data, error } = await supabase.from(POST_TABLE).insert(payload).select();

    if (error) {
        throw new Error(`Failed to create posts: ${error.message}`);
    }

    return data?.[0] || null;
}

export async function updatePost(postId, postData) {
    ensureClient();

    const payload = {
        title: postData.title,
        content: postData.content,
    };

    const { data, error } = await supabase.from(POST_TABLE).update(payload).eq('id', postId).select();

    if (error) {
        throw new Error(`Failed to update posts: ${error.message}`);
    }

    return data?.[0] || null;
}

export async function deletePost(postId) {
    ensureClient();

    const { error } = await supabase.from(POST_TABLE).delete().eq('id', postId);

    if (error) {
        throw new Error(`Failed to delete posts: ${error.message}`);
    }

    return true;
}