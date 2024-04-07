interface NewsComments {
    by: string;
    id: number;
    kids: string[] | undefined;
    parent: number;
    text: string;
    time: number;
    type: string;
};

export interface NewsStory {
    title: string;
    url: string;
    id: number;
    kids: string[] | undefined;
    score: number;
    time: number;
    descendants: number;
};

export interface CommentTree {
    comment: NewsComments;
    kids: CommentTree[] | undefined;
};

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export const fetchNewsStories = async (): Promise<NewsStory[]> => {
    "use server";
    const response = await fetch(`${BASE_URL}/topstories.json`);
    const storyIds = await response.json();

    const storiesDetails = await Promise.all(storyIds.map(fetchNewsStory));
    return storiesDetails;
};

export const fetchNewsStory = async (id: string): Promise<NewsStory> => {
    "use server";
    const story = await fetch(`${BASE_URL}/item/${id}.json`);
    return await story.json();
};

export const fetchNewsStoryComments = async (id: string): Promise<{
    kids: CommentTree | undefined;
    story: NewsStory;
}> => {
    "use server";
    const storyDetails = await fetchNewsStory(id);

    const getChildComments = async (commentId: number): Promise<CommentTree> => {
        const comment = await fetch(`${BASE_URL}/item/${commentId}.json`);
        const commentDetails = await comment.json();

        return {
            comment: commentDetails,
            kids: commentDetails.kids ? await Promise.all(commentDetails.kids.map((childCommentId: number) => getChildComments(childCommentId))) : undefined
        };
    };

    return {
        kids: storyDetails.kids ? await getChildComments(storyDetails.id) : undefined,
        story: storyDetails
    };
};
