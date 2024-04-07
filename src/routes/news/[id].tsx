import { For } from "solid-js";
import { createAsync, cache, useParams } from "@solidjs/router";
import { fetchNewsStoryComments } from "~/utils/api";
import { formatUrl } from "~/utils/urls";
import { Comments } from "~/components/Comments";

const getNewsStoryComments = cache(fetchNewsStoryComments, "newsStoryComments");

export const route = {
    load: ({ params }: { params: {id: string }}) =>  getNewsStoryComments(params.id)
};

export default function NewsId() {
    const { id } = useParams();
    const newsStoryComments = createAsync(() => getNewsStoryComments(id));

    return (
        <main class="container mx-auto mt-2 flex-1 overflow-y-hidden flex flex-col">
            <div>
                <a href={newsStoryComments()?.story.url} target="_blank" class="text-2xl hover:underline">
                    {newsStoryComments()?.story.title}
                </a>
                <p>
                    <a href={newsStoryComments()?.story.url} target="_blank" class="text-xs text-slate-600 hover:underline">
                        {formatUrl(newsStoryComments()?.story.url)}
                    </a>
                </p>
                <p>
                    <span class="text-slate-500 text-xs">
                        {`${newsStoryComments()?.story.score}pts - `}
                    </span>
                    <span class="text-slate-500 text-xs">
                        {`By ${newsStoryComments()?.story.by}`}
                    </span>
                </p>
            </div>
            <div class="flex-1 overflow-y-auto">
                <div class="flex flex-col">
                    {<For each={newsStoryComments()?.kids?.kids}>{commentData => {
                        return <Comments {...commentData} />;
                    }}</For>}
                </div>
            </div>
        </main>
    );
};
