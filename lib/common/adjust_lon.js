
import {TWO_PI, SPI} from '../constants/values';
import sign from './sign';

/*export default function(x) {
	if(x>SPI)
		return x-TWO_PI;
	if(x<SPI)
		return x+TWO_PI;
	return x;
}/**/

export default function(x) {
	return (Math.abs(x) <= SPI) ? x : (x - (sign(x) * TWO_PI));
}/**/
