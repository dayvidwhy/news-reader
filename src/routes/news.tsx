import { For } from "solid-js";
import { A } from "@solidjs/router";
import { createAsync, cache } from "@solidjs/router";
import { formatWhenDateWas } from "~/utils/dates";
import { fetchNewsStories } from "~/utils/api";

const getNewsStories = cache(fetchNewsStories, "newsStories");

export const route = {
    load: () => getNewsStories()
};

const formatUrl = (url: string) => {
    try {
        const formattedUrl = new URL(url).hostname;
        return `(${formattedUrl})`;
    } catch (error) {
        return "";
    }
};

export default function News() {
    const newsStories = createAsync(() => getNewsStories());
    return (
        <main class="container pt-2 mx-auto">
            <h1 class="text-2xl">
                Top Stories
            </h1>
            <ul class="container flex flex-col">
                {<For each={newsStories()}>{(story) => (
                    <li class="m-2 bg-slate-100 p-2 flex flex-col border-b border-slate-400">
                        <a class="text-xl hover:text-slate-800 hover:underline" target="_blank" href={story.url}>{story.title}</a>
                        <a href={story.url} target="_blank" class="text-xs text-slate-600 hover:underline">
                            {formatUrl(story.url)}
                        </a>
                        <p class="text-slate-500 text-xs">
                            <span>
                                {`${story.score}pts - `}
                            </span>
                            <span>
                                {formatWhenDateWas(story.time)}
                            </span>
                            <span>
                                {" - "}
                            </span>
                            <A href={`/news/${story.id}`} class="hover:underline">
                                {`${story.descendants || "0"} ${story.descendants !== 1 ? "comments" : "comment"}`}
                            </A>
                        </p>
                    </li>
                )}</For>}
            </ul>
        </main>
    );
}
