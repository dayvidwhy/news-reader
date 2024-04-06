import { A } from "@solidjs/router";

export default function NotFound() {
    return (
        <main class="container">
            <h1 class="">Not Found</h1>
            <p class="my-4">
                <A href="/" class="text-slate-600 hover:underline">
                    Home
                </A>
            </p>
        </main>
    );
}
