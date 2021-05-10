var mapCsrToAxis={
	e: {axis: 'x', multiplier: 1},
	w: {axis: 'x', multiplier: -1},
	n: {axis: 'y', multiplier: 1},
	s: {axis: 'y', multiplier: -1},
	u: {axis: 'z', multiplier: 1},
	d: {axis: 'z', multiplier: -1},
};

export default function(crs, denorm, point){
	var v=[
		point.x,
		point.y,
		point.z,		
	];
	for(var i=0;i<3;++i){
		if(v[i]!==undefined){
			var m=mapCsrToAxis[crs.axis[i]];
			point[m.axis]=v[i]*m.multiplier;
		}
	}
	return point;
}

/*export default function(crs, denorm, point) {
  var xin = point.x,
    yin = point.y,
    zin = point.z || 0.0;
  var v, t, i;
  var out = {};
  for (i = 0; i < 3; i++) {
    if (denorm && i === 2 && point.z === undefined) {
      continue;
    }
    if (i === 0) {
      v = xin;
      if ("ew".indexOf(crs.axis[i]) !== -1) {
        t = 'x';
      } else {
        t = 'y';
      }

    }
    else if (i === 1) {
      v = yin;
      if ("ns".indexOf(crs.axis[i]) !== -1) {
        t = 'y';
      } else {
        t = 'x';
      }
    }
    else {
      v = zin;
      t = 'z';
    }
    switch (crs.axis[i]) {
    case 'e':
      out[t] = v;
      break;
    case 'w':
      out[t] = -v;
      break;
    case 'n':
      out[t] = v;
      break;
    case 's':
      out[t] = -v;
      break;
    case 'u':
      if (point[t] !== undefined) {
        out.z = v;
      }
      break;
    case 'd':
      if (point[t] !== undefined) {
        out.z = -v;
      }
      break;
    default:
      //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
      return null;
    }
  }
  return out;
}*/
