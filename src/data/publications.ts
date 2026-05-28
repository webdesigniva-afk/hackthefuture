import { toHTML } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import type { Lang } from "../i18n";
import { sanityClient, sanityImage } from "../sanity.client";
import {
	authorPublicationsQuery,
	authorBySlugQuery,
	authorsQuery,
	publicationBySlugQuery,
	publicationSlugsQuery,
	publicationsQuery,
	relatedPublicationsQuery,
} from "../sanity.queries";

export type PublicationType = "Article" | "Video" | "Image Essay";

export interface SanityImageAsset {
	_type: "image";
	asset?: {
		_ref?: string;
		_type?: "reference";
	};
	alt?: string;
}

export interface Author {
	id: string;
	slug: string;
	name: string;
	bio: string;
	role?: string;
	image?: SanityImageAsset;
}

export interface Category {
	id: string;
	slug: string;
	title: string;
	description?: string;
}

export interface Publication {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	type: PublicationType;
	typeLabel: string;
	contentType: "article" | "video" | "imageEssay";
	category: string;
	categorySlug?: string;
	categoryId?: string;
	author: string;
	authorName: string;
	authorBio?: string;
	date: string;
	publishedAt: string;
	image: string;
	imageUrl?: string;
	imageAlt: string;
	videoUrl?: string;
	tags: string[];
	edition: string;
	body: PortableTextBlock[];
	bodyHtml: string;
	gallery?: Array<{
		image: SanityImageAsset;
		url: string;
		alt: string;
	}>;
}

interface RawAuthor {
	_id: string;
	slug?: string;
	name?: string;
	shortBio?: string;
	role?: string;
	image?: SanityImageAsset;
}

interface RawCategory {
	_id: string;
	slug?: string;
	title?: string;
	description?: string;
}

interface RawPublication {
	_id: string;
	slug?: string;
	title?: string;
	excerpt?: string;
	featuredImage?: SanityImageAsset;
	contentType?: "article" | "video" | "imageEssay";
	publishedAt?: string;
	edition?: string;
	tags?: string[];
	videoUrl?: string;
	body?: PortableTextBlock[];
	gallery?: SanityImageAsset[];
	author?: RawAuthor;
	category?: RawCategory;
}

const typeLabels: Record<Publication["contentType"], PublicationType> = {
	article: "Article",
	video: "Video",
	imageEssay: "Image Essay",
};

function formatPublicationDate(date: string | undefined, lang: Lang) {
	if (!date) return "";

	return new Intl.DateTimeFormat(lang === "bg" ? "bg-BG" : "en", {
		month: "long",
		year: "numeric",
	}).format(new Date(date));
}

function imageUrl(image: SanityImageAsset | undefined, width: number, height: number) {
	if (!image?.asset?._ref) return undefined;

	return sanityImage(image).width(width).height(height).quality(82).url();
}

function portableTextToHtml(body: PortableTextBlock[] = []) {
	return toHTML(body, {
		components: {
			types: {
				image: ({ value }) => {
					const url = imageUrl(value as SanityImageAsset, 1200, 760);
					if (!url) return "";

					return `<figure><img src="${url}" alt="" loading="lazy" /></figure>`;
				},
			},
		},
	});
}

function normalizeAuthor(author: RawAuthor | undefined): Author {
	const slug = author?.slug ?? "unknown-author";
	const name = author?.name ?? "CATALIZATOR";

	return {
		id: author?._id ?? slug,
		slug,
		name,
		bio: author?.shortBio ?? author?.role ?? "",
		role: author?.role,
		image: author?.image,
	};
}

function normalizePublication(publication: RawPublication, lang: Lang): Publication {
	const author = normalizeAuthor(publication.author);
	const category = publication.category;
	const contentType = publication.contentType ?? "article";
	const typeLabel = typeLabels[contentType];
	const imageAlt = publication.featuredImage?.alt ?? publication.title ?? "Publication image";

	return {
		id: publication._id,
		slug: publication.slug ?? publication._id,
		title: publication.title ?? "Untitled publication",
		excerpt: publication.excerpt ?? "",
		type: typeLabel,
		typeLabel,
		contentType,
		category: category?.title ?? "Publication",
		categorySlug: category?.slug,
		categoryId: category?._id,
		author: author.slug,
		authorName: author.name,
		authorBio: author.bio,
		date: formatPublicationDate(publication.publishedAt, lang),
		publishedAt: publication.publishedAt ?? "",
		image: imageAlt,
		imageUrl: imageUrl(publication.featuredImage, 1600, 900),
		imageAlt,
		videoUrl: publication.videoUrl,
		tags: publication.tags ?? [],
		edition: publication.edition ?? "",
		body: publication.body ?? [],
		bodyHtml: portableTextToHtml(publication.body),
		gallery: publication.gallery
			?.map((image, index) => ({
				image,
				url: imageUrl(image, 1200, 900) ?? "",
				alt: image.alt ?? `${publication.title ?? "Publication gallery"} ${index + 1}`,
			}))
			.filter((item) => item.url),
	};
}

export async function getAuthors(_lang: Lang = "en") {
	const authors = await sanityClient.fetch<RawAuthor[]>(authorsQuery);
	return authors.map(normalizeAuthor);
}

export async function getPublications(lang: Lang = "en") {
	const publications = await sanityClient.fetch<RawPublication[]>(publicationsQuery);
	return publications.map((publication) => normalizePublication(publication, lang));
}

export async function getPublicationSlugs() {
	return sanityClient.fetch<Array<{ slug: string }>>(publicationSlugsQuery);
}

export async function getPublication(slug: string, lang: Lang = "en") {
	const publication = await sanityClient.fetch<RawPublication | null>(publicationBySlugQuery, { slug });
	return publication ? normalizePublication(publication, lang) : undefined;
}

export async function getAuthor(slug: string, lang: Lang = "en") {
	const author = await sanityClient.fetch<RawAuthor | null>(authorBySlugQuery, { slug });
	return author ? normalizeAuthor(author) : undefined;
}

export async function getPublicationsByAuthor(slug: string, lang: Lang = "en") {
	const publications = await sanityClient.fetch<RawPublication[]>(authorPublicationsQuery, { slug });
	return publications.map((publication) => normalizePublication(publication, lang));
}

export async function getRelatedPublications(publication: Publication, lang: Lang = "en") {
	if (!publication.categoryId) return [];

	const related = await sanityClient.fetch<RawPublication[]>(relatedPublicationsQuery, {
		slug: publication.slug,
		categoryId: publication.categoryId,
	});

	return related.map((item) => normalizePublication(item, lang));
}
