import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;
const supabase = createClient(supabaseUrl, publicKey);
                           

export default async function mediaUpload(file) {
		if (!file) {
			throw new Error("No file selected");
		}

		const timestamp = new Date().getTime();
		const fileName = `${timestamp}_${file.name}`;

		const { error: uploadError } = await supabase.storage
			.from("images")
			.upload(fileName, file, {
				upsert: false,
				cacheControl: "3600",
			});

		if (uploadError) {
			throw new Error(uploadError.message || "Upload failed");
		}

		const { data: publicData, error: publicError } = supabase.storage
			.from("images")
			.getPublicUrl(fileName);

		if (publicError) {
			throw new Error(publicError.message || "Failed to get public URL");
		}

		return publicData.publicUrl;
}
