import { For } from "solid-js";
import { useLocation } from "@solidjs/router";

const links = [
    {
        href: "/",
        text: "Home",
    },
    {
        href: "/news",
        text: "News",
    },
];

export default function Nav() {
    const location = useLocation();
    const active = (path: string) =>
        path == location.pathname ? "border-slate-600" : "border-transparent hover:border-slate-600";
    return (
        <nav class="bg-slate-800">
            <ul class="container flex items-center p-2 text-slate-200">
                <For each={links}>{(link) => {
                    return (
                        <li class={`border-b-2 ${active(link.href)} mx-2`}>
                            <a href={link.href}>{link.text}</a>
                        </li>
                    );
                }}</For>
            </ul>
        </nav>
    );
}
