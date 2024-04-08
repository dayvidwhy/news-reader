import { NewsStory } from "~/utils/api";
import { A } from "@solidjs/router";
import { formatWhenDateWas } from "~/utils/dates";
import { formatUrl } from "~/utils/urls";

export const Story = (newsStoryData: NewsStory) => {
    return (
        <>
            <a class="text-xl hover:text-slate-800 hover:underline" target="_blank" href={newsStoryData.url}>{newsStoryData.title}</a>
            <a href={newsStoryData.url} target="_blank" class="text-xs text-slate-600 hover:underline">
                {formatUrl(newsStoryData.url)}
            </a>
            <p class="text-slate-500 text-xs">
                <span>
                    {`${newsStoryData.score}pts - `}
                </span>
                <span>
                    {formatWhenDateWas(newsStoryData.time)}
                </span>
                <span>
                    {" - "}
                </span>
                <A href={`/news/${newsStoryData.id}`} class="hover:underline">
                    {`${newsStoryData.descendants || "0"} ${newsStoryData.descendants !== 1 ? "comments" : "comment"}`}
                </A>
            </p>
        </>
    );
};
