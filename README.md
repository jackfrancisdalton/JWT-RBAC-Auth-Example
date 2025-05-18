# Role Based Authentication with React and NestJS using JWT
This is an example repository, intended to provide a simple implementation of JWT in a React + Nest application.
As an example project all business logic and other complexity is kept to a bare minimum so readers can focus on the authentication flow  

--------------


# Relevant Concepts

## What is RBAC
Role-Based Access Control (RBAC) is a methodology for restricting system access to authorized users based on their roles. Instead of assigning permissions individually, roles—such as user, admin, or super-admin define a set of actions. Users are then assigned one or more roles, making it easier to manage permissions at scale.

## What is JWT
JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. A JWT consists of three parts:

1. Header: Specifies the signing algorithm (e.g., HS256).
2. Payload: Contains claims, such as sub (user ID) and roles.
3. Signature: Verifies that the token wasn’t tampered with.

Tokens are signed on the server and sent to the client. Clients include the token in subsequent requests (typically in `Authorization: Bearer <token>` header). That in turn means the server does not need to keep track of any state and can determine valid authentication state exclusively using the JWT token sent from the client.

--------------

# Technical Disclaimers
## No Reverse-Proxy
To keep things simple, we’re not using NGINX (or any reverse-proxy). The React client and NestJS backend communicate directly. A loose CORS policy (Access-Control-Allow-Origin: *) is enabled—do not use this in production.

## In-Memory Users Only
There is no database integration. A hardcoded in-memory user store is used, and any “registered” users are stored only for the lifetime of the running process. All data is lost when the backend restarts. 


--------------

# Implementation Overview

## App Overview
This repository contains two docker-ized containers:
1. frontend: a react + vite based client side application (uses nginx in prod mode to serve)
2. backend: a Nest based server side application 

It offers examples of the following behaviour:
1. User Registration with role assignment
2. User Login
3. Client side role based route access
4. Server side per-endpoint role restrictions (ie can do X as user, but must be staff to do Y)
5. Auto refreshing access token on failed request, and immediate retry

> Note: there are pre-defined users in the in-memory user array you can use to test behaviour


## Access Token and Refresh Token 

### Access Token

An access token is a *short lived (e.g., 5 minutes)* token that is sent on every API request in the Authorization header.

Why short lived? As the server side is exclusively going to depend on the access token to inform auth state and permissions, we need to deal with a couple of issues:
1. Stale Tokens: As the access token contains the user's roles, if that user were to gain/lose a role, the JWT on their client would no longer reflect the roles of that user. By using a short life on the token we can ensure that the tokens are regularly expired and refreshed meaning that we only have a limited time where incorrect roles are assigned.

2. Security Risks: Access tokens are stored in memory on the client side, as a result it is possible for malicious actors to access them. If they do we want to ensure that they have the shortest window possible to do damage. An access token with a 6 day life span gives hackers 6 days to impersonate the user. As a result shorter times are preferable. 

<!-- TODO add code link -->

### Refresh Token

A refresh token is a *long lived (e.g., 7 days)*. It exists so that when our access token expires, we have a mechanism for requesting a new access token (...known as refreshing the token, thus the name). 

As a refresh token is long lived and gives the holder the ability to generate as many access tokens as they need, care must be taken in how it is communicated and stored.
In this repository we take the approach of setting it in a HTTP-only cookie, which has the benefit of attaching it to all requests, whilst ensuring javascript cannot interact with it, mitigating issues like for example a chrome extension extracting the token for mallicious reasons

<!-- TODO: add code link -->

## Client Side Route Protection 
Once authenticated on the client side, a user has their access token contents extracted and stored in state. Note in particular that this includes their roles.
The repository then uses that information in the custom route guards `PublicOnlyRoute` & `PublicOnlyRoute`. This approach grants a few advantages:

1. We don't need to hit an API endpoint to determine if a user can access a page speeding up the UI and decreasing load on the server
2. We have a DRY easy to implement and understand way of defining page level access on the frontend

<!-- TODO add code link -->

## Server Side Role Permission Handling
On the server side we need a easy to read, quick to implement solution that restricts access to endpoints based on their role based requirements. For example a `/invoices/all` should only be available to a user with the "finance-team" role.

To achieve this I've implemented the following:
- Roles decorator: allows a user to decorate an endpoint with a specific role(s) requirement
- Roles Guard: when attached to a controller ensures any requests sent to an endpoint with a role decorator verifies the associated JWT token meets requirements and is valid

This approach keeps the code DRY, makes understanding the behaviour of the code easy, and makes implementation/adjustment of required roles easy.

## Client Side Auth Provider
The AuthProvider exists to centralise all authentication data and JWT handling in the application. That way components/pages can simply implement "useAuth()" to aquire relevant information and know that refreshing, Authorisation attachng, etc... is handled for them.  

### Graceful handling of access token expiration
When an access token expires (being short lived we expect this a lot), we will want the user to aquire a new one using their refresh token.
From a UX stand point we want to ensure this happens behind the scenes, for example:
1. client sends api request with expired access token
2. server responds with unauthorised
3. client requests a new access token
4. server returns a new accesss token generated from the user's refresh token
5. client recieves new access token and retries original request

All of this should occur without the user having any perception of the process. To achieve this we attach an intercepter to all axios responses that checks for any 401 cases.
If we find a 401 (signifying that the access token expired) we call the refresh endpoint, assign the newly provided access token, and then retry the original request.

#### Auto attaching Bearer
When defining API calls in our frontend application we know that most (if not all) will require the access token to be attached to the Authorization header.
This creates a conflict with DRY principles and can lead to bugs if a new implementation of an API request forgets to add it.

As an elegant way to resolve this wI've opted to use axios over fetch as it allows `intercepters` to be attached to a client. Intercepters allow us to hook into an API request before it is sent and attach the access token before it is sent off. Note that when doing this it is CRITICAL that the interceptor updates the token it is attaching to requests anytime we refresh the access token.


### Seperation of JWT payload and User Profile Data
When issueing JWT access tokens we ideally want them to be as small as possible. Why? 
1. Given their short life we expect to be issuing them frequently
2. Their payload might be stale, so we want to avoid extracing information that needs to be up to date, instead fetching that from an endpoint

As a result the Authprovider in this repository takes the approach of storing user ids and roles in the JWT, but having a seperate user profile endpoint that profile data is fetched from. The behaviour that results is that any user profile data that is updated is reflected immediatly, but if a user's role is updated it will not be reflected in site behaviour until a new access token is issued.