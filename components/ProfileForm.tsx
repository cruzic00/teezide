"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Link, FileText, Camera, Save, Loader2 } from "lucide-react";

type UserData = {
    email: string;
    role: string;
    username?: string;
    phone?: string;
    profilePicture?: string;
    createdAt: string;
};

export default function ProfileForm({ initialUser }: { initialUser: UserData }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: initialUser.username || "",
        phone: initialUser.phone || "",
        profilePicture: initialUser.profilePicture || "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            setMessage({ type: "success", text: "Profile updated successfully!" });
            router.refresh();
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white border border-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Left Column: Sidebar / Profile Overview */}
                <div className="w-full md:w-80 bg-white p-8 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col items-center text-center">
                    <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-800 shadow-xl">
                            <img
                                src={formData.profilePicture || "https://ui-avatars.com/api/?name=" + (formData.username || "User") + "&background=random"}
                                alt="Profile"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full border-4 border-neutral-950 shadow-sm">
                            <Camera size={16} className="text-black" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-black mb-1 tracking-tight">{formData.username || "Anonymous"}</h2>
                    <p className="text-neutral-400 text-sm mb-4">{initialUser.email}</p>

                    <div className="px-3 py-1 bg-neutral-800 rounded-full text-xs font-medium text-neutral-300 border border-neutral-700 uppercase tracking-wider">
                        {initialUser.role} Account
                    </div>

                    <div className="mt-8 w-full border-t border-neutral-800 pt-6">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-3">Member Since</p>
                        <p className="text-black text-sm">{new Date(initialUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="flex-1 p-8 md:p-10 bg-neutral-900/50">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-black mb-2">Profile Settings</h3>
                        <p className="text-black text-sm">Update your personal information and public profile.</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {message.type === 'success' ? <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" /> : <span className="h-2 w-2 rounded-full bg-red-500" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wide ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="johndoe"
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all hover:border-neutral-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wide ml-1">Phone</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all hover:border-neutral-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wide ml-1">Avatar URL</label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors">
                                    <Link size={18} />
                                </div>
                                <input
                                    type="url"
                                    name="profilePicture"
                                    value={formData.profilePicture}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all hover:border-neutral-600"
                                />
                            </div>
                            <p className="text-xs text-neutral-500 ml-1">Paste a direct link to an image (JPG, PNG, GIF)</p>
                        </div>

                        <div className="pt-4 flex justify-end border-t border-neutral-800 mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-white text-neutral-950 font-bold rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Save Changes</span>
                                        <Save size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
