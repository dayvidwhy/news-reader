import { A } from "@solidjs/router";
import { createAsync, cache } from "@solidjs/router";
import { format } from "date-fns";

export interface NewsStory {
    title: string;
    url: string;
    id: number;
    score: number;
    time: number;
    descendants: number;
};

const getNewsStories = cache(async (): Promise<NewsStory[]> => {
    "use server";
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const storyIds = await response.json();

    const storiesDetails = await Promise.all(storyIds.map((id: number) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<NewsStory>(async (resolve): Promise<void> => {
            const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const storyDetails = await story.json();
            resolve(storyDetails);
        });
    }));
    return storiesDetails;
}, "newsStories");

export const route = {
    load: () => getNewsStories()
};

export default function News() {
    const newsStories = createAsync(() => getNewsStories());
    return (
        <main class="container pt-2 mx-auto">
            <h1 class="text-2xl">
                Top Stories
            </h1>
            <ul class="container flex flex-col">
                {newsStories() && newsStories()?.map((story) => (
                    <li class="m-2 bg-slate-100 p-2 flex flex-col border-b border-slate-400">
                        <a class="text-xl hover:text-slate-800 hover:underline" href={story.url}>{story.title}</a>
                        <p>
                            <span class="text-slate-500 pr-1 text-xs">
                                {`${story.score}pts - `}
                            </span>
                            <span class="text-slate-500 text-xs">
                                {format(new Date(story.time), "pp").toLowerCase()}
                            </span>
                            <A href={`/news/${story.id}`} class="text-slate-500 text-xs pl-1 hover:underline">
                                {`${story.descendants || "0"} ${story.descendants !== 1 ? "comments" : "comment"}`}
                            </A>
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
