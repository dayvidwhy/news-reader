import { For } from "solid-js";
import { createAsync, cache } from "@solidjs/router";
import { fetchNewsStories } from "~/utils/api";
import { Story } from "~/components/Story";

const getNewsStories = cache(fetchNewsStories, "newsStories");

export const route = {
    load: () => getNewsStories()
};

export default function News() {
    const newsStories = createAsync(() => getNewsStories());
    return (
        <main class="container pt-2 mx-auto flex flex-col flex-1 overflow-y-auto">
            <h1 class="text-2xl">
                Top Stories
            </h1>
            <ul class="container flex flex-col">
                {<For each={newsStories()}>{(story) => (
                    <li class="m-2 bg-slate-100 p-2 flex flex-col border-b border-slate-400">
                        <Story {...story} />
                    </li>
                )}</For>}
            </ul>
        </main>
    );
}
