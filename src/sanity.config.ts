export const sanityConfig = {
	// Sanity project ID is configured here. Use SANITY_PROJECT_ID to point this clone at its own Sanity project.
	projectId: import.meta.env.SANITY_PROJECT_ID ?? "zxrcdwgj",
	// Sanity dataset is configured here. Override with SANITY_DATASET for non-production environments.
	dataset: import.meta.env.SANITY_DATASET ?? "production",
	apiVersion: "2026-05-16",
	useCdn: false,
};

