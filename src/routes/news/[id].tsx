import { For, Show } from "solid-js";
import { createAsync, cache, useParams } from "@solidjs/router";
import { fetchNewsStoryComments } from "~/utils/api";
import { Story } from "~/components/Story";
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
            <Show when={newsStoryComments()?.story}>
                {/* The Show condition asserts this is not null.
                // @ts-ignore */}
                <Story {...newsStoryComments().story} />
            </Show>
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
