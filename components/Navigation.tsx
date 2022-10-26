import ActiveLink from './ActiveLink'
//import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs';

//const publicUrl = getPublicUrl();

const Navigation = (): JSX.Element => {

  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-2">
      <nav className="my-2 my-md-0 mr-md-3">
        <ActiveLink href="/" activeClassName="text-gray-100">
          <a className="p-2 text-m text-gray-400 hover:duration-500 hover:text-white">{'Viewer'}</a>
        </ActiveLink>
        <ActiveLink href="/mint_token_id" activeClassName="text-gray-100">
          <a className="p-2 text-gray-400 hover:duration-500 hover:text-white">{'Mint (With TokenId)'}</a>
        </ActiveLink>
        <ActiveLink href="/mint" activeClassName="text-gray-100">
          <a className="p-2 text-gray-400 hover:duration-500 hover:text-white">{'Mint (Without TokenId)'}</a>
        </ActiveLink>
        <ActiveLink href="/util" activeClassName="text-gray-100">
          <a className="p-2 text-gray-400 hover:duration-500 hover:text-white">{'Util'}</a>
        </ActiveLink>
      </nav>
    </div>
  );
};

export default Navigation;