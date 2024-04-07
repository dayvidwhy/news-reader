import { createAsync, cache, useParams } from "@solidjs/router";
import { format } from "date-fns";
import { NewsStory } from "../news";

interface NewsComments {
    by: string;
    id: number;
    kids: number[];
    parent: number;
    text: string;
    time: number;
    type: string;
};

const getNewsStoryComments = cache(async (id): Promise<{
    kids: NewsComments[];
    story: NewsStory;
}> => {
    "use server";
    console.log(id);
    const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const storyDetails = await story.json();

    const storyComments = await Promise.all(storyDetails.kids.map((commentId: number) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<NewsComments>(async (resolve): Promise<void> => {
            const comment = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
            const commentDetails = await comment.json();
            resolve(commentDetails);
        });
    }));
    return {
        story: storyDetails,
        kids: storyComments
    };
}, "newsStoryComments");

export const route = {
    load: () => {
        const { id } = useParams();
        getNewsStoryComments(id);
    }
};

export default function NewsId() {
    const { id } = useParams();
    const newsStoryComments = createAsync(() => getNewsStoryComments(id));
    return (
        <main class="container mx-auto mt-2">
            <h1 class="text-2xl">
                {newsStoryComments() && newsStoryComments()?.story.title}
            </h1>
            <div class="flex flex-col">
                {newsStoryComments() && newsStoryComments()?.kids.map((comment) => {
                    return (
                        <div class="m-2 p-2 bg-slate-100">
                            <p>
                                <span>
                                    By {comment.by}
                                </span>
                                <span>
                                    at {format(new Date(comment.time), "pp").toLowerCase()}
                                </span>
                            </p>
                            <p class="text-xs">
                                {comment.text}
                            </p>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};
