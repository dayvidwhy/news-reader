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
            <a href={newsStoryComments() && newsStoryComments()?.story.url} class="text-2xl hover:underline">
                {newsStoryComments() && newsStoryComments()?.story.title}
            </a>
            <p>
                <span class="text-slate-500 text-xs">
                    {`${newsStoryComments() && newsStoryComments()?.story.score}pts - `}
                </span>
                <span class="text-slate-500 text-xs">
                    {`By ${newsStoryComments() && newsStoryComments()?.story.by}`}
                </span>
            </p>
            <div class="flex flex-col">
                {newsStoryComments() && newsStoryComments()?.kids?.kids?.map((commentData => {
                    return <Comments {...commentData} />;
                }))}
            </div>
        </main>
    );
};
