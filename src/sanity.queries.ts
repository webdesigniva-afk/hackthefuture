// Reusable GROQ queries live in this file. Add new publication fields by projecting them in
// publicationFields, then exposing the field on the Publication type in src/data/publications.ts.
const publicationFields = `
	_id,
	title,
	"slug": slug.current,
	excerpt,
	featuredImage,
	contentType,
	publishedAt,
	edition,
	tags,
	videoUrl,
	body,
	gallery,
	"author": author->{
		_id,
		name,
		"slug": slug.current,
		shortBio,
		role,
		image
	},
	"category": category->{
		_id,
		title,
		"slug": slug.current,
		description
	}
`;

export const publicationsQuery = `
	*[_type == "publication" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
	| order(publishedAt desc) {
		${publicationFields}
	}
`;

export const publicationSlugsQuery = `
	*[_type == "publication" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] {
		"slug": slug.current
	}
`;

export const publicationBySlugQuery = `
	*[_type == "publication" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
		${publicationFields}
	}
`;

export const relatedPublicationsQuery = `
	*[
		_type == "publication" &&
		defined(slug.current) &&
		defined(publishedAt) &&
		publishedAt <= now() &&
		slug.current != $slug &&
		category._ref == $categoryId
	]
	| order(publishedAt desc)[0...3] {
		${publicationFields}
	}
`;

export const authorsQuery = `
	*[_type == "author" && defined(slug.current)] | order(name asc) {
		_id,
		name,
		"slug": slug.current,
		shortBio,
		role,
		image
	}
`;

export const authorBySlugQuery = `
	*[_type == "author" && slug.current == $slug][0] {
		_id,
		name,
		"slug": slug.current,
		shortBio,
		role,
		image
	}
`;

export const authorPublicationsQuery = `
	*[
		_type == "publication" &&
		defined(slug.current) &&
		defined(publishedAt) &&
		publishedAt <= now() &&
		author->slug.current == $slug
	]
	| order(publishedAt desc) {
		${publicationFields}
	}
`;
