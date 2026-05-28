import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityConfig } from "./sanity.config";

export const sanityClient = createClient(sanityConfig);

const builder = createImageUrlBuilder(sanityClient);

export function sanityImage(source: Parameters<typeof builder.image>[0]) {
	return builder.image(source).auto("format").fit("crop");
}
