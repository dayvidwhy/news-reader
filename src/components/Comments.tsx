import { For, Show, createSignal } from "solid-js";
import { format } from "date-fns";
import type { CommentTree } from "~/utils/api";

export const Comments = (commentData: CommentTree) => {
    const [visibile, setVisibile] = createSignal(true);
    return (
        <div class="m-2 pl-2 pt-2 bg-slate-100 border-l border-slate-200 flex">
            <div class="flex flex-col justify-start text-center">
                <button class="px-1 w-5 bg-slate-200 mr-1" onClick={[() => setVisibile((prev) => !prev), null]}>
                    {visibile() ? "-" : "+"}
                </button>
            </div>
            <Show when={visibile()}>
                <div>
                    <p class="text-xs text-wrap break-words">
                        {commentData.comment.text}
                    </p>
                    <p class="text-slate-500 text-xs">
                        <span>{`By ${commentData.comment.by}`}</span>
                        <span class="pl-1">{`at ${format(new Date(commentData.comment.time), "pp").toLowerCase()}`}</span>
                    </p>
                    <div class="pl">
                        {<For each={commentData.kids}>{Comments}</For>}
                    </div>
                </div>
            </Show>
        </div>
    );
};
