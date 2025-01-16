let posts = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'Content is required' });
        }

        const newPost = {
            id: posts.length + 1,
            content,
            createdAt: new Date().toISOString(),
        };

        posts.push(newPost);
        return res.status(201).json(newPost);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
