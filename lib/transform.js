import {D2R, R2D, PJD_3PARAM, PJD_7PARAM} from './constants/values';
import datum_transform from './datum_transform';
import adjust_axis from './adjust_axis';
import proj from './Proj';
import toPoint from './common/toPoint';
import checkSanity from './checkSanity';

function checkNotWGS(source, dest) {
	return (
		(
			(source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM)
			&& dest.datumCode !== 'WGS84'
		)
		|| (
			(dest.datum.datum_type === PJD_3PARAM || dest.datum.datum_type === PJD_7PARAM)
			&& source.datumCode !== 'WGS84'
		)
	);
}

export default function transform(source, dest, p) {
	var wgs84;
	if (Array.isArray(p)) {
		p = toPoint(p);
	}else{
		var q=new (Object.getPrototypeOf(p).constructor)();
		for(var key in p)
			q[key]=p[key];
		p=q;
	}

	checkSanity(p);

	// Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
	if(source.datum && dest.datum && checkNotWGS(source, dest)) {
		wgs84 = new proj('WGS84');
		p = transform(source, wgs84, p);
		source = wgs84;
	}

	// DGR, 2010/11/12
	if (source.axis !== 'enu') {
		p = adjust_axis(source, false, p);
	}
	// Transform source points to long/lat, if they aren't already.
	if (source.projName === 'longlat') {
		p.x*=D2R;
		p.y*=D2R;
	} else {
		if(source.to_meter){
			p.x*=source.to_meter;
			p.y*=source.to_meter;
		}
		p=source.inverse(p); // Convert Cartesian to longlat
		if(!p)
			return;
	}
	// Adjust for the prime meridian if necessary
	if(source.from_greenwich)
		p.x += source.from_greenwich;

	// Convert datums if needed, and if possible.
	p = datum_transform(source.datum, dest.datum, p);
	if(!p)
		return;

	// Adjust for the prime meridian if necessary
	if(dest.from_greenwich)
		p.x-=dest.from_greenwich;

	if(dest.projName === 'longlat'){
		p.x*=R2D;
		p.y*=R2D;
	} else { // else project
		p = dest.forward(p);
		if (dest.to_meter) {
			p.x/=dest.to_meter;
			p.y/=dest.to_meter;
		}
	}

	// DGR, 2010/11/12
	if(dest.axis !== 'enu')
		return adjust_axis(dest, true, p);

	return p;
}
