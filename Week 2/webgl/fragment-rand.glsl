precision mediump float;
varying vec3 fragColor;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))*
    43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/vec2(1000, 1000);
    st *= 10.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    // vec2 fpos = fract(st);  // get the fractional coords
    // Assign a random value based on the integer coord
    vec3 color = vec3(random( ipos ));
    gl_FragColor = vec4(color,1.0);
}