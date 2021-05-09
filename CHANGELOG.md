# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] (2021-05-09)

### Changed

- Support for Node.js version `10.x.x` has been dropped.

## [2.0.0] (2018-02-23)

### Changed

- Only the template being rendered (and the partials it uses) will be removed from the cache; rather than purging the entire view directory, which can be slow.
- Template functions will no longer be passed a `render` function.

### Removed

- Removed the `rendererForPartials` engine option.

## [1.0.0] (2017-05-16)

The initial public release.
