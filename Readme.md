# AirbnbDemo MERN Project

AirbnbDemo is a server-rendered accommodation marketplace application built with Node.js, Express, MongoDB, Mongoose, EJS, Passport, Cloudinary, and Bootstrap. Users can browse listings, search by country, view listing details and maps, create accounts, publish properties, manage their own listings, and leave reviews with star ratings.

> Note: The repository is MERN-oriented, but this application uses EJS templates for its frontend rather than React. The project demonstrates a full-stack MVC application with a RESTful Express backend and server-rendered UI.

## Project Highlights

- Browse all accommodation listings in a responsive card layout.
- Search listings by country with `GET /listings?country=...`.
- View a listing's title, description, image, price, location, country, owner, reviews, rating, and map.
- Create, edit, and delete listings.
- Upload listing images to Cloudinary with Multer.
- Register users with username, email, and password.
- Log in and log out with Passport's local authentication strategy.
- Persist authenticated sessions in MongoDB with `connect-mongo`.
- Restrict listing changes to the listing owner.
- Add reviews for listings as an authenticated user.
- Restrict review deletion to the review author.
- Validate listing and review input with Joi and Mongoose rules.
- Display success and error feedback through flash messages.
- Geocode listing locations and display them with Leaflet and Geoapify.
- Use method override to submit `PUT` and `DELETE` operations from HTML forms.
- Provide responsive navigation, listing cards, review controls, map layout, footer, and loading shimmer styles.

## Technology Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- EJS and EJS-Mate
- Passport and Passport Local Mongoose
- Express Session
- Connect Mongo
- Connect Flash
- Joi
- Method Override
- Multer
- Cloudinary

### Frontend

- EJS server-rendered views
- Bootstrap
- Bootstrap Icons and Font Awesome
- Leaflet maps
- Geoapify geocoding and map tiles
- Custom CSS and browser-side JavaScript




### Run the application

```powershell
npm install
node app.js

## Application Architecture

The main application follows an MVC-style structure:

```text
app.js                         Express application and middleware setup
Models/                        Mongoose models
Routes/                        Listing, review, and user route modules
controller/                    Listing, review, and user business logic
views/                         EJS pages, layouts, and reusable includes
public/                        CSS, ratings styles, and browser JavaScript
utils/                         Express error and async wrapper utilities
init/                          Seed data and database initialization scripts
cloudconfig.js                 Cloudinary and Multer configuration
middleware.js                  Authentication, authorization, and validation middleware
schema.js                      Joi validation schemas
```

## User Workflows

### Guest browsing

Visitors can open the listings index, search by country, inspect a listing, view its owner and reviews, and see the listing location on a map. Guests are redirected to login when they try to access protected actions.

### Account workflow

Users can sign up, log in with Passport local authentication, remain signed in through a MongoDB-backed session, and log out. After login, the application restores the originally requested protected URL.

### Listing owner workflow

An authenticated user can open the new-listing form, upload an image, create a listing, edit their own listing, optionally replace its image, and delete it. Authorization middleware prevents other users from editing or deleting the listing.

### Review workflow

An authenticated user can submit a comment and a rating from 1 to 5. Review authors can delete their own reviews. Reviews are associated with listings and users through MongoDB references and are populated when a listing is displayed.

## Routes and API Surface

HTML forms use `method-override` to send `PUT` and `DELETE` requests.

### Listings

| Method   | Endpoint             | Description                                           | Access              |
| -------- | -------------------- | ----------------------------------------------------- | ------------------- |
| `GET`    | `/listings`          | Render all listings, optionally filtered by `country` | Public              |
| `GET`    | `/listings/new`      | Render the create-listing form                        | Authenticated users |
| `POST`   | `/listings`          | Validate, upload, and create a listing                | Authenticated users |
| `GET`    | `/listings/:id`      | Render listing details, reviews, owner, and map       | Public              |
| `GET`    | `/listings/:id/edit` | Render the edit form                                  | Listing owner       |
| `PUT`    | `/listings/:id`      | Validate and update listing data and image            | Listing owner       |
| `DELETE` | `/listings/:id`      | Delete a listing and associated reviews               | Listing owner       |

### Reviews

| Method   | Endpoint                          | Description                                    | Access              |
| -------- | --------------------------------- | ---------------------------------------------- | ------------------- |
| `POST`   | `/listings/:id/reviews`           | Validate and add a review to a listing         | Authenticated users |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete a review and unlink it from its listing | Review author       |

### Users

| Method | Endpoint  | Description                                  |
| ------ | --------- | -------------------------------------------- |
| `GET`  | `/signup` | Render the registration form                 |
| `POST` | `/signup` | Create an account and log the user in        |
| `GET`  | `/login`  | Render the login form                        |
| `POST` | `/login`  | Authenticate through Passport Local Strategy |
| `GET`  | `/logout` | End the current session                      |

## Data Models and Relationships

### Listing model

The listing model stores:

- `title`
- `description`
- `image.url`
- `image.filename`
- `price`
- `location`
- `country`
- `owner`, a reference to `User`
- `reviews`, an array of references to `Review`
- `category`, restricted to `mountains`, `arctic`, `farms`, or `desserts`

Listing pages populate the owner and review authors. A Mongoose `findOneAndDelete` hook removes reviews associated with a deleted listing.

### Review model

The review model stores:

- `comment`
- `rating`, constrained from 1 to 5
- `createdAt`
- `author`, a reference to `User`

### User model

Users use `passport-local-mongoose`, which provides username/password authentication fields, password hashing, authentication helpers, serialization, and deserialization. The custom user schema also stores a required email address.

The relationships are:

```text
User 1 ---- many Listing       Listing.owner
User 1 ---- many Review        Review.author
Listing 1 - many Review        Listing.reviews
```

## Authentication and Authorization

- Passport Local Strategy authenticates users through `User.authenticate()`.
- Passport serializes and deserializes users for session-based login.
- Express Session stores session data in MongoDB through `connect-mongo`.
- `currUser` is exposed to every EJS view for conditional navigation.
- `isLoggedIn` protects authenticated routes and preserves the original URL.
- `savedRedirectUrl` sends a user back to their original destination after login.
- `isOwner` protects listing edit and delete operations.
- `isReviewAuthor` protects review deletion.
- The navbar changes between signup/login controls and logout controls based on authentication state.

## Validation and Error Handling

The application combines Joi request validation, Mongoose schema constraints, custom errors, and centralized Express error handling.

Listing validation covers:

- Required title, description, location, and country strings.
- Rejection of numbers in title, location, and country fields.
- Non-negative listing prices.
- Optional listing image data.

Review validation covers:

- Required review comment.
- Rating values from 1 through 5.

Error-handling features include:

- `ExpressError` for consistent status codes and messages.
- `wrapAsync` for forwarding rejected async controller promises.
- A 404 fallback for unknown routes.
- A central error middleware that renders `views/listings/error.ejs`.
- Flash messages for successful and failed operations.
- Redirects when listings cannot be found.

## Image Uploads and Maps

Listing images are uploaded with Multer and stored in Cloudinary using the `Airbnbdema_dev` folder. Cloudinary accepts PNG, JPG, and JPEG images. The stored URL and filename are saved in the listing document.

The listing detail page uses Leaflet and Geoapify to geocode the listing location and render a map with a marker. The Geoapify API key is passed to the rendered page through an environment variable.

## Frontend Features

- Reusable EJS boilerplate layout.
- Reusable navbar, flash-message, and footer includes.
- Responsive listing cards and navigation.
- Listing search form for country filtering.
- Static category navigation strip with horizontal scrolling.
- Tax-label toggle that changes the displayed price label.
- Bootstrap form validation feedback and required-field validation.
- Star rating controls styled through `public/css/ratings.css`.
- Listing image shimmer/loading state removed after image load.
- Responsive reviews and map layout.
- CDN-loaded Bootstrap, Font Awesome, and Leaflet assets.




## Local Setup

### Requirements

- Node.js and npm
- MongoDB running locally or a MongoDB connection string
- A Cloudinary account for image uploads
- A Geoapify API key for maps


### Router and cookies example

`router-express-implementation/index.js` runs on port `3000` and demonstrates:

- Express routing with `GET`, `POST`, and `DELETE` handlers.
- Cookie parsing and signed cookies.
- User routes: `/users`, `/users/:id`, `POST /users`, and `DELETE /users`.
- Post routes: `/posts` and `/posts/:id`.
- Cookie routes: `/setCookies`, `/getCookies`, `/setSignedCookie`, and `/verify`.

### Session example

`router-express-implementation/session.js` also runs on port `3000` and demonstrates:

- Express sessions.
- Flash messages.
- Request counting at `/reqcount`.
- Registration through `/register?name=...`.
- EJS rendering through `/hello`.


## Portfolio Summary

This project demonstrates practical full-stack development with Express and MongoDB: modular routing, MVC organization, authentication, authorization, sessions, file uploads, cloud storage, relational document references, validation, error handling, server-rendered views, and responsive frontend behavior. It is a strong foundation for extending the application with React, automated tests, production security hardening, advanced search, image cleanup, and deployment automation.
