This project is an attempt to render 3D scenes in HTMLCanvas, without the use of
WebGL.

Perspective projection, relative coordinate frames and some other linear algebra
stuff are used. The
[painter's algorithm](https://en.wikipedia.org/wiki/Painter's_algorithm) is used
for culling for performance since everything in Kolu is rendered primarily by
the CPU.

A demo is available at the [GitHub Page](https://carbonicsoda.github.io/kolu/):

- Move along the x-/y-axis with WASD
- Change FOV with I(n)/O(ut)

To play with the demo's options clone the repository, edit src/index.ts and run
`npx vite watch`.

This project is discontinued as my original expectations are (roughly) met, and
that continue working on it may not be worth it and might even trash
performance. Of course, this is only meant to be a fun toy anyways, as probably
everyone would choose to use more functional libraries like 3.js or something
similar to utilize WebGL/WebGPU nowadays.
