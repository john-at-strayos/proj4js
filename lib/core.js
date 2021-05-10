import proj from './Proj';
import transform from './transform';
var wgs84 = proj('WGS84');

function transformer(from, to, coords) {
  var transformedArray, out;
  if (Array.isArray(coords)) {
    transformedArray = transform(from, to, coords) || {x: NaN, y: NaN};
    if (coords.length > 2) {
      if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
        out=coords.slice();
        out[0]=transformedArray.x;
        out[1]=transformedArray.y;
        if (typeof transformedArray.z === 'number'){
          out[2]=transformedArray.z;
        }
        return out;
      } else {
	    out=coords.slice();
        out[0]=transformedArray.x;
        out[1]=transformedArray.y;
        return out;
      }
    } else {
      return [transformedArray.x, transformedArray.y];
    }
  } else {
    out = transform(from, to, coords);
	if(out && from.name!=='geocent' && to.name!=='geocent')
		out.z=coords.z;
	return out;
  }
}

function checkProj(item) {
  if (item instanceof proj) {
    return item;
  }
  if (item.oProj) {
    return item.oProj;
  }
  return proj(item);
}

function proj4(fromProj, toProj, coord) {
  fromProj = checkProj(fromProj);
  var single = false;
  var obj;
  if (typeof toProj === 'undefined') {
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  } else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
    coord = toProj;
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  }
  toProj = checkProj(toProj);
  if (coord) {
    return transformer(fromProj, toProj, coord);
  } else {
    obj = {
      forward: function (coords) {
        return transformer(fromProj, toProj, coords);
      },
      inverse: function (coords) {
        return transformer(toProj, fromProj, coords);
      }
    };
    if (single) {
      obj.oProj = toProj;
    }
    return obj;
  }
}
export default proj4;