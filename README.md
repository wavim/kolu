### Overview

This is an attempt to render 3D scenes in HTMLCanvas without the use of WebGL.

The use of coordinate frames and perspective projection etc. are roughly standard.  
The main difference from WebGL is the use of
[painter's algorithm](https://en.wikipedia.org/wiki/Painter's_algorithm) to sort meshes (mesh-wise
instead of pixel-wise, which would use a z-buffer).  
The use of this obsolete naive algorithm is primarily for performance and ease of implementation.

### Demo

A demo is available at [Kolu Demo](https://carbonicsoda.github.io/kolu/):

- Move w.r.t the camera with WASD and Q/E.
- Change fov with I/O.
- Toggle wireframe rendering with F.

### Notes

This is not actively maintained as it is only meant to be an interesting toy but not for practical
uses.
