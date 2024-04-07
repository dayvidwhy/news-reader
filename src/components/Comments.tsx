import { For } from "solid-js";
import { format } from "date-fns";
import type { CommentTree } from "~/utils/api";

export const Comments = (commentData: CommentTree) => {
    return (
        <div class="m-2 pl-2 bg-slate-100 border-l border-slate-400">
            <p class="text-xs">
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
    );
};
