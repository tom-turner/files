import {ReactComponent as DefaultAvatar}  from '../assets/avatar.svg';

export function Avatar({ type, className }) {

	switch(type) {
	    case 'foo':
	      return 'bar';
	    default:
	      return <DefaultAvatar className={className} />;
	  
	}

}