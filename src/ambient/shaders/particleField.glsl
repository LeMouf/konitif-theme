float particleField(vec2 uv,float time){float v=0.0;for(int i=0;i<8;i++){vec2 p=fract(uv*float(i+3)+time*.01*float(i+1));v+=smoothstep(.995,1.0,1.0-length(p-.5));}return v;}
