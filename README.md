# Shared React

A minimal setup for writing cross platform applications in React and React Native. 
This project is the example for our blog post A sensible approach to Cross platform development with React and React Native (Link coming soon).

# Motivations
This provides a bare bones setup that compliments writing for web and mobile with React and React Native whilst not requiring any dependencies other than react, react-router, react-native and lodash.
## Web Installation 

``npm i``


## Web Development
You'll need nodemon to run in development mode
```npm i nodemon -g```


```npm run dev```


## Web Build for production

```npm start```

This will deploy files to /build and splits your web code into 3 cache busted bundles
- Vendors: your node_modules.
- Components: your pages and app components.
- Main: anything else non presentational.

## Mobile Installation 
If you've never ran a React Native project before check the [Building Projects with Native Code guide](https://facebook.github.io/react-native/docs/getting-started.html).

``cd ./mobile && npm i``

## Running android 
```cd ./mobile && react-native run-android```

## Running ios 
```cd ./mobile && react-native run-ios```

## Project structure

**/common**

Any code that can be shared between web and mobile goes here.
For example State management, common utils, business logic and higher order components. 

**/mobile**
This is the root of your React Native project.
 
**/web**
This contains anything to do with the web frontend and will in no way touch anything to do with React Native. For example, the top level of web may look like: 

**/webpack**

Webpack configs are used in our package.json scripts to either bundle our app for development or deploy minified/cachebusted files to **/build** to be used in production.

## Syncing common code between web and mobile

running **/mobile/bin/common-watch.sh** will keep **/common** synced to **/mobile/common-mobile**. 
This is automatically executed when running the ios project.

<img src="http://g.recordit.co/j6A8lIxu6s.gif"/>
