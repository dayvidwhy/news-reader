import { For } from "solid-js";
import { createAsync, cache, useParams } from "@solidjs/router";
import { fetchNewsStoryComments } from "~/utils/api";
import { Comments } from "~/components/Comments";

const getNewsStoryComments = cache(fetchNewsStoryComments, "newsStoryComments");

export const route = {
    load: ({ params }: { params: {id: string }}) =>  getNewsStoryComments(params.id)
};

export default function NewsId() {
    const { id } = useParams();
    const newsStoryComments = createAsync(() => getNewsStoryComments(id));

    return (
        <main class="container mx-auto mt-2">
            <a href={newsStoryComments()?.story.url} class="text-2xl hover:underline">
                {newsStoryComments()?.story.title}
            </a>
            <p>
                <span class="text-slate-500 text-xs">
                    {`${newsStoryComments()?.story.score}pts - `}
                </span>
                <span class="text-slate-500 text-xs">
                    {`By ${newsStoryComments()?.story.by}`}
                </span>
            </p>
            <div class="flex flex-col">
                {<For each={newsStoryComments()?.kids?.kids}>{commentData => {
                    return <Comments {...commentData} />;
                }}</For>}
            </div>
        </main>
    );
};
