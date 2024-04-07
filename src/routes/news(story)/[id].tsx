import { For } from "solid-js";
import { createAsync, cache, useParams } from "@solidjs/router";
import { format } from "date-fns";
import type { NewsStory } from "../news";

interface NewsComments {
    by: string;
    id: number;
    kids: number[] | undefined;
    parent: number;
    text: string;
    time: number;
    type: string;
};

interface CommentTree {
    comment: NewsComments;
    kids: CommentTree[] | undefined;
};

const getNewsStoryComments = cache(async (id): Promise<{
    kids: CommentTree | undefined;
    story: NewsStory;
}> => {
    "use server";
    console.log(id);
    const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const storyDetails = await story.json();

    const getChildComments = async (commentId: number): Promise<CommentTree> => {
        const comment = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
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
}, "newsStoryComments");

export const route = {
    load: () =>  getNewsStoryComments(useParams().id)
};

const renderComment = (commentData: CommentTree) => {
    return (
        <div class="m-2 pl-2 bg-slate-100 border-l border-slate-400">
            <p>
                <span>{`By ${commentData.comment.by}`}</span>
                <span>{`at ${format(new Date(commentData.comment.time), "pp").toLowerCase()}`}</span>
                <span>{commentData.comment.id}</span>
            </p>
            <p class="text-xs">
                {commentData.comment.text}
            </p>
            <div class="pl">
                {<For each={commentData.kids}>{renderComment}</For>}
            </div>
        </div>
    );
};

export default function NewsId() {
    const { id } = useParams();
    const newsStoryComments = createAsync(() => getNewsStoryComments(id));

    return (
        <main class="container mx-auto mt-2">
            <a href={newsStoryComments() && newsStoryComments()?.story.url} class="text-2xl hover:underline">
                {newsStoryComments() && newsStoryComments()?.story.title}
            </a>
            <div class="flex flex-col">
                {newsStoryComments() && newsStoryComments()?.kids?.kids?.map(renderComment)}
            </div>
        </main>
    );
};
