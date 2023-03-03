uniform sampler2D envMap;
uniform vec2 resolution;

varying vec3 worldNormal;
varying vec3 viewDirection;

void main() {
	// get screen coordinates
	vec2 uv = gl_FragCoord.xy / resolution;

	vec3 normal = worldNormal;
	// calculate refraction and add to the screen coordinates
	vec3 refracted = refract(eyeVector, normal, 1.0/ior);
	uv += refracted.xy;
	
	// sample the background texture
	vec4 tex = texture2D(envMap, uv);

	vec4 output = tex;
	gl_FragColor = vec4(output.rgb, 1.0);
}