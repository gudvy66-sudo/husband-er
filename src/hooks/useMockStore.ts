
import { useState, useEffect } from 'react';

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    createdAt: string;
    views: number;
    comments: number;
    likes: number;
}

const INITIAL_POSTS: Post[] = [
    {
        id: 1,
        title: "와이프가 300만 원짜리 명품백 샀는데 저도 플스5 사도 될까요? (급)",
        content: "제목 그대로입니다. 와이프가 이번에 보너스 받았다고 가방을 질렀는데...",
        author: "익명의유부1",
        category: "urgent",
        createdAt: "2024-05-20",
        views: 1200,
        comments: 52,
        likes: 15
    },
    {
        id: 2,
        title: "비상금 들켰습니다... 베란다 타일 밑이었는데... 하...",
        content: "진짜 완벽하다고 생각했는데 청소하다가 걸렸네요. 어떻게 대처해야 할까요?",
        author: "비상금털림",
        category: "free",
        createdAt: "2024-05-21",
        views: 3400,
        comments: 89,
        likes: 42
    },
    {
        id: 3,
        title: "[후기] 로봇청소기인 척 하고 하루 종일 누워있었던 썰 푼다",
        content: "주말에 너무 피곤해서 로봇청소기 동선 방해 안 되게 굴러다녔더니...",
        author: "게으른남편",
        category: "free",
        createdAt: "2024-05-19",
        views: 5120,
        comments: 120,
        likes: 330
    }
];

export const useMockStore = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const savedPosts = localStorage.getItem('husband_er_posts');
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts));
        } else {
            setPosts(INITIAL_POSTS);
            localStorage.setItem('husband_er_posts', JSON.stringify(INITIAL_POSTS));
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever posts change
    const savePosts = (newPosts: Post[]) => {
        setPosts(newPosts);
        localStorage.setItem('husband_er_posts', JSON.stringify(newPosts));
    };

    const addPost = (post: Omit<Post, 'id' | 'views' | 'comments' | 'likes' | 'createdAt'>) => {
        const newPost: Post = {
            ...post,
            id: Date.now(), // Simple ID generation
            views: 0,
            comments: 0,
            likes: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };
        const updatedPosts = [newPost, ...posts];
        savePosts(updatedPosts);
    };

    const deletePost = (id: number) => {
        const updatedPosts = posts.filter(p => p.id !== id);
        savePosts(updatedPosts);
    };

    return { posts, addPost, deletePost, isLoaded };
};
