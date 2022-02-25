## SICK PIM60 Web Interface

This is an updated implementation of the part which shows content and send/recieve commands from/to SICK Inspector PIM60 via http protocol.

Folders:
- InspectorWebToolkit: old jQuery version from SICK site;
- InspectorReactWebToolkit: just own attempt to transfer SICK Web Framework to React platform.

Folder structure:
/src - main source folder;
    /core - common used things;
        /config - api.config.ts - ip addresses;
        /services - http.ts axios wrapper;
                /inspector - api http implementation;
        /store - some useless local storage (just try to save some info direct in browser);
        /utils - usefull utils;
/components
            /atoms - just simple elements like buttons, checkbox and etc. Styled with mui;
            /molecules - also simple combinations like imagebox, tabs;
            /organism - complex components ready for pages (view images, toolbox);
            /pages - PWA (also contains jquery pages from old project);
/style - global style;
/webpack - webpack dev/prod configs;

TODO:
- [x] Show current live image (interval);
- [ ] Support all tools;
- [x] Change recipes;
- [x] Change mode;
- [x] Show log images;

**Full documentation:**
[![forthebadge made-with-javascript](http://ForTheBadge.com/images/badges/made-with-javascript.svg)](https://github.com/WildEgor/InspectorPIM60/tree/main/documentation)

```
npm install - install all node_modules;
npm run dev - running application in dev mode (change ./src/core/config/api.config.ts inspectorDevices ip to real cam ip address);
npm run build - build application (all files appears in ./src/build folder);
npm run start - run app as if we run it on camera.
```
