import {ReactComponent as Avatar}  from '../assets/avatar.svg';

export function UserAvatar({userId, className}){
  return (
    <div className={`flex rounded-full ${className}`}> 
      <Avatar className='p-2' />
    </div>
  )
}