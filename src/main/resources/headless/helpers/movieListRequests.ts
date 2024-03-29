// Used by both backend and frontend (the movie-list part controller, and react4xp/entries/MovieList.jsx)

// <1>
export const buildQueryListMovies = () => `
query(
    $first:Int!,
    $offset:Int!,
    $sort:String!,
    $parentPathQuery:String!
) {
  guillotine {
    query(
        contentTypes: ["com.enonic.app.samples_react4xp:movie"],
        query: $parentPathQuery,
        first: $first,
        offset: $offset,
        sort: $sort
    ) {
      ... on com_enonic_app_samples_react4xp_Movie {
        _id
        displayName
        data {
          year
          description
          actor
          image {
            ... on media_Image {
              imageUrl(type: absolute, scale: "width(300)")
            }
          }
        }
      }
    }
  }
}`;

// <2>
export const buildParentPathQuery = (parentPath) => `_parentPath = '/content${parentPath}'`;


// Returns arrays unchanged.
// If the maybeArray arg is a non-array value, wraps it in a single-item array.
// If arg is falsy, returns an empty array.
const forceArray = maybeArray => {
    if (Array.isArray(maybeArray)) {
        return maybeArray;
    }
    return (maybeArray) ? [maybeArray] : [];
};

// <3>
// Adapts the output from the guillotine query to the MovieList props signature
export const extractMovieArray = responseData => responseData.data.guillotine.query
    .filter( movieItem => movieItem && typeof movieItem === 'object' && Object.keys(movieItem).indexOf('data') !== -1)
    .map(
        movieItem => ({
            id: movieItem._id,
            title: movieItem.displayName.trim(),
            imageUrl: movieItem.data.image.imageUrl,
            year: movieItem.data.year,
            description: movieItem.data.description,
            actors: forceArray(movieItem.data.actor)
                .map( actor => (actor || '').trim())
                .filter(actor => !!actor)
        })
    );

export default {};
