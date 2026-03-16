"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Something went wrong!
                </h2>
                <div className="bg-red-50 p-4 rounded-lg mb-6 text-left overflow-auto max-h-48 scrollbar-thin">
                    <p className="font-mono text-xs text-red-800 break-words whitespace-pre-wrap">
                        {error.message || "Unknown client-side error"}
                    </p>
                    {error.stack && (
                        <pre className="font-mono text-[10px] text-red-700 mt-2 whitespace-pre-wrap border-t border-red-200 pt-2">
                            {error.stack}
                        </pre>
                    )}
                </div>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-neutral-800 transition"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
