This project is an attempt to render 3D scenes in HTMLCanvas, without the use of WebGL.

Maths used are perspective projection, relative coordinate frames and some other linear algebra stuff.

Algorithm used for culling is the [painter's algorithm](https://en.wikipedia.org/wiki/Painter's_algorithm).
This is for performance since everything in Kolu is rendered by the CPU.

A demo is available at [GitHub Page](https://carbonicsoda.github.io/kolu/).
To play with the demo clone the repository, edit /index.html and use Vite.

This project is discontinued as my original expectations are (roughly) met.  
And that continue working on it may not be worth it and might even trash performance.

Of course, this is only meant to be a fun toy anyways,
as probably everyone would choose to use 3.js or something similar nowadays.

But I guess learning a lot during building this project is all that matters. ^\_^
