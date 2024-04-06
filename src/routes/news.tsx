import { A } from "@solidjs/router";
import { createAsync, cache } from "@solidjs/router";

const getNewsStories = cache(async () => {
    "use server";
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const storyIds = await response.json();

    const storiesDetails = await Promise.all(storyIds.map((id: number) => {
        return new Promise<{
            title: string;
            url: string;
            id: number;
        // eslint-disable-next-line no-async-promise-executor
        }>(async (resolve): Promise<void> => {
            const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const storyDetails = await story.json();
            resolve({
                title: storyDetails.title,
                url: storyDetails.url,
                id: storyDetails.id
            });
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
        <main class="container">
            <h1>
                News
            </h1>
            <ul class="container mx-auto">
                {newsStories() && newsStories()?.map((story) => (
                    <li class="my-4">
                        <h1>{story.title}</h1>
                        <p>{story.url}</p>
                        <A href={`/news/${story.id}`}>{story.id}</A>
                    </li>
                ))}
            </ul>
        </main>
    );
}
