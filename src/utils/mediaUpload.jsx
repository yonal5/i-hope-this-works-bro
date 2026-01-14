import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;
const supabase = createClient(supabaseUrl, publicKey);


export default function mediaUpload(file) {
	return new Promise(async (resolve, reject) => {
		if (!file) {
			reject("No file selected");
			return;
		}

		try {
			const timestamp = new Date().getTime();
			const fileName = `${timestamp}_${file.name}`;

			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(fileName, file, {
					upsert: false,
					cacheControl: "3600",
				});

			if (uploadError) {
				reject(uploadError.message || "Upload failed");
				return;
			}

			const { data: publicData, error: publicError } = supabase.storage
				.from("images")
				.getPublicUrl(fileName);

			if (publicError) {
				reject(publicError.message || "Failed to get public URL");
				return;
			}

			resolve(publicData.publicUrl);
		} catch (err) {
			reject(err.message || "An error occured");
		}
	});
}
