# React + TypeScript + Vite

# Ulta
This codebase was written to power Ulta, an assessment task that involved implementing user 
authentication with Twitter, sending a one-time password (OTP) to the user's Twitter 
account, and granting access to the application's dashboard upon successful OTP 
verification.


## Folder struture/organization
- src/assets: contains all images used in the application.
- src/components: contains all components sorted/grouped by functionality.
- src/pages contain all displayed pages in the application.
- src/services: contains API calls and redux methodologies.
- src/cofig: contains axios configuration(used in implementing global base url) and firebase configuration.
- src/styles: contains scss styles grouped into main, components, pages and abstracts(this contains mixins and variables).
- src/protected routes: contains implementation to protect routes and private pages.
- src/types: contains Typescript type declacrations.
- src/__tests__: contains all tests for components and pages.


## How to install
- run `git clone <insertThisRepoURL>` in your target directory from your command line
- run `npm install --legacy-peer-deps` to install all necessary dependencies

## How to use
- run `npm run dev` to start the application server.
- Open your web browser and visit http://localhost:4000 to access the application.

## How to test
- run `npm test` to test the application.

## How to deploy
- first run `npm run build` to make code production ready
- then deploy on a platform of your choice. This codease was deployed to Vercel, and you can find the live domain url in the website url space by your right of the repo.


## Challenges encountered
- CORS (Cross-Origin Resource Sharing) Issue

  I encountered a CORS issue while implementing Twitter's API request due to the use of a free Twitter developer account.

  Twitter API server deliberately does not include the necessary 'Access-Control-Allow-Origin' in its headers in responses. To permit requests from my domain, the server needs to include this header.

  Unfortunately, I was unable to test the actual request and receive valid responses because of CORS restrictions.

  Some of the implementation here relies on the object structure outlined in Twitter's documentation, presuming a successful API response.

  Please be aware that blind implementation without live API testing may lead to unanticipated issues when interacting with the Twitter API without CORS restrictions. 


## Recommendation
To test the actual functionality, kindly use a paid Twitter developer account to perform live API requests.

For any questions or further clarifications, feel free to reach out.


## Tools and libraries
Please see the package.json file for indept details of all tools and libraries.
- SASS
- Axios
- Redux
- Firebase
- oauth-signature
- React-icons


