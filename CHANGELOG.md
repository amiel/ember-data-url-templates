# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for relationship urlTemplates (#36)

## [0.3.1] - 2017-07-06

### Added

- Automatic support for attributes from the snapshot (#34)
- Automatic support for relationship ids from the snapshot (#34)
- Acceptance Tests!!!

## [0.3.0] - 2017-06-19

### Fixed

- Clear null and remove undefined values from query parameters (#23)

### Changed

- Update ember-cli to 2.13.2

## [0.2.0] - 2016-09-27

### Fixed

- Prevent double query params (#19)

## [0.1.1] - 2016-04-29

### Fixed

- Don't double URI-encode IDs (#14)

### Changed

- Pull uri-templates from npm instead of Bower (#18)

## [0.1.0] - 2015-12-18

### Added

- Ensures that the native urlSegments isn't overwritten (#5)
- Fall back to original buildURL if no template is found (#6)

### Changed

- Update ember-cli (#9)

### Removed

- Remove support for Ember Data 1.0.0-beta.17 (ad3e03a6ddf38a1efa2afc668fd31b1dac806343)
- Remove re-implentation of default pathForType() (#10)

