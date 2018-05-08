# A sensible approach to Cross platform development with React and React Native

The ability to develop simultaneously for Android, iOS and recently Windows Phone is often advertised as the biggest selling point for businesses considering adopting React Native. Arguably an even bigger and often overlooked opportunity this tech stack brings is the ability to extend this cross platform ecosystem to web with React. 

The end goal here is to be in a position where you can achieve and sustain feature parity with your web and mobile apps, written by a single team and have the ability to write new features and fix bugs simultaneously with a single codebase. 

This guide sets out an approach to building and maintaining a codebase that sensibly maximises shared functionality across all platforms. It concentrates solely on React/React Native so that you don't get bogged down with dependencies and state management systems like Redux and Mobx.

# Project structure

This may seem like an overly obvious place to start but it's important to set out a clear project structure with cross platform in mind so that you and your team know where everything lives.

**/common**

As the name states, any code that can be shared between web and mobile goes here. Whilst we want to maximise code sharing, it's important to be pragmatic and to not overfit code just to get a bit of reuse. Above all, our applications must be easy to understand and follow. By our rule of thumb, a module can be here if all the following requirements are met:

1. It does not depend on any modules which are not supported by web, mobile or node.
2. It is platform agnostic and never contains code that checks which platform is executing it.
3. It does not contain any markup anything presentational.
4. Its functionality does not make assumptions that can hinder UX differences between web and mobile.

With these rules in mind , some examples of of common modules include:

 - Your application's API calls.
 - State management (Redux, MobX etc).
 - Environment config / constants.
 - Common utility functions.
 - Application business logic.
 - Higher order components.

**/mobile**

This is the root of your React Native project, to keep things tidy we store our app structure under **/mobile/app**

 - **/styles**: contains all your project styles with a single file to store our config / style variables such as colours and font sizes.
 - **/components**: contains all your project components, generally these components mostly just care about presentation and are stateless.
 - **/pages**: keeping pages separate from the component folder makes them easier to find.
 - **/project**: contains any none-presentational but specific config to mobile e.g. our routes, polyfills and mobile constants.
 
**/web**
This contains anything to do with the web frontend and will in no way touch anything to do with React Native. For example, the top level of web may look like: 

 - **/images, /fonts**: and all your other static asset folders
 - **/styles**: contains all your project styles, most likely from a preprocessor such as Sass or LESS.
 - **/components**: contains all your project components, generally these components mostly just care about presentation and are stateless.
 - **/pages**: keeping pages separate from the component folder makes them easier to find.
 - **/project**: contains any none-presentational but specific config to web e.g. our routes, polyfills and web constants.

**/webpack**

Webpack takes our js, styles and other resources and bundles them into static assets, all of our build config is self contained in this folder. 

Rather than going too much into detail here, our webpack configs are used in our package.json scripts to either bundle our app for development or deploy minified/cachebusted files to **/build** to be used in production.

## Syncing common code between web and mobile
For this approach to work a key part is being able to sync common code so that they are usable in web and mobile and can be updated from a single location. 

Since the [React Native packager doesn’t support symlinks](https://github.com/facebook/metro/issues/1) we need an alternative. Even if it did support symlinks, we needed a more **reliable** way keep the mobile common folder up to date without bloating web/mobile with dependencies such as gulp-watch. Making use of [wix's wml library](https://github.com/wix/wml) we wrote a simple bash script that launches with xcode and ensures only one intance of this is running.

```
#!/bin/sh

pidfile=./file-watch.pid

# If the pid file exists we must already be running
if ! ln -s "pid=$$" "$pidfile"; then
  echo "Already running. Exiting." >&2
  exit 0
fi

 # remove pid if we exit normally or are terminated
  trap "rm -f $pidfile" 0 1 3 15
  npm install -g wml
  watchman watch ../../src/js/common
  wml add ../../src/js/common ../common
  wml start
```

We add a script phase to our xcode build

```
PROJECTDIR="${PROJECT_DIR}"
osascript -e "tell app \"Terminal\" to do script \"cd $PROJECTDIR/../bin && sh ../bin/common-watch.sh && exit\""
```

<img src="http://g.recordit.co/j6A8lIxu6s.gif"/>

## Web and mobile Polyfilling
To help maximise the code we reuse in our common layer, there are certain web and mobile features we might want to make available on each platform so that we don't have to worry where we use them.

On web we added the following react native features to our existing pollyfil:

1. AppState - sometimes we may want to know whether the browser tabs are active in the same way that apps are active.
2. AsyncStorage - Without worrying about syntax differences we can easily local storage app state and bootstrap it to our application on a shared layer.
3. Clipboard - having this allows us to manage the clipboard in a common place such as a higher order component.
4. NetInfo - this allows us to write cross platform functionality that utilises the user's internet connectivity.

With the help of [react-native-web](https://github.com/necolas/react-native-web) we wrapped up these modules in a simple package which can be found on our [here](https://github.com/SolidStateGroup/polyfill-react-native).

##Dumb and smart components
When looking solely at our app components, using Dan Abramov's pattern of [smart and dumb components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) is generally a good way to separate our dumb **/mobile**, **/web** components and smart **/common** components. 

Our dumb components are primarily concerned with how things look and rarely deal with state unless it's to do with UI rather than data. These components shouldn't need to care about dependencies such as flux actions or stores.

Our smart components on the other hand don't usually contain markup, they deal with data and how things work and pass those results down to dumb components as props.

## Client APIs
In order to increase what we can do in our common layer, both web and mobile expose a global API that perform similar tasks in their own way. Common code doesn't have to worry about how each platform deals with the requests, examples of this may include:

- Recording analytic events when flux actions are called ```API.recordEvent(Constants.FOO_CLICKED)```

- Social auth via a higher order component ```API.auth.google().then(this.onLogin)```

Even in cases that are not used by common, this is quite a good idea to keep syntax familiar between platforms.


## Base modules
As well as sharing modules across platforms we also split some of our modules into parts that are unlikely to change, for example our main mobile stylesheet looks like this:

```
import baseStyles from './base/baseStyleVariables'
export default Object.assign(
    {}, baseStyles,
    {
        //    Project specific styles and overrides
    }
);
```

## Tying it all together
Our github project [shared-react](https://github.com/SolidStateGroup/shared-react) provides a solid example of the above principles in an easy to understand way.

### Web entry flow
The entry point main.js which kicks off the following
1 - Polyfills React Native APIs we wish to use, in our case AppState, AsyncStorage, Clipboard and NetInfo.
2 - Our API is assigned to global scope and exposes a single function ```recordEvent(eventName)```.
3 - Imports our main style.scss, in development this supports scss hot reloading. In production this is extracted and inserted as a css link in the html head.
4 - Initialises the project routes defined in ```routes.js``` and renders the results within ```<div id="app"></div>```

### Mobile entry flow
The entry point index.js which kicks off the following
1 - Polyfills any web APIs we wish to use, in our case we don't need any but in other instances we may use something such as [react-native-fetch-blob](https://github.com/joltup/react-native-fetch-blob).
2 - Our API is assigned to global scope and exposes a single function ```recordEvent(eventName)```.2 - Our API is assigned to global scope and exposes a single function ```recordEvent(eventName)```.
3 - Uses react-native-globals to assign components like View to global scope such as View.
4 - Exposes a few base components such H1-H6 and Flex and initialises a global stylesheet.
5 - Registers our ExampleScreen using AppRegistry. We don't use a router in our example like on web as there are quite a few different and popular options in React Native. 

### The example application
Our web and mobile include 1 page/screen that  store and retrieve a single field.

They use an example higher order component which uses AsyncStorage to do the heavy lifting and passes down the following props:

```
   <WrappedComponent
                    instructions={instructions} //Instructions to the user
                    isLoading={isLoading} //Whether the storage is loading
                    isSaving={isSaving} //Whether the storage is saving
                    value={value} //The current value entered for the storage
                    save={save} //A function to save the current value
                    reset={reset} //A function to reset the stored value
                    onChange={onChange} //A function to call when the text value changes
                    success={success} //Determines whether saving was successful
                    {...this.props} //Pass all other props
                />
```

With this we create a simple form on web and mobile, our higher order component uses our cross platform api to record events,
<img src="http://g.recordit.co/t1bqzCFFfe.gif"/>
