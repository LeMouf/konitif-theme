float volumetricFog(vec2 uv,float depth){float center=1.0-length(uv-0.5);return smoothstep(0.0,1.0,center)*depth;}
