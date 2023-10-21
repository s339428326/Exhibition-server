import { Outlet, Link } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <>
      <header>Header</header>
      <main className="container">
        <Link to="/">test</Link>
        <Link to="/test2">test2</Link>
        <Outlet />
      </main>
      <footer>footer</footer>
    </>
  );
};

export default DefaultLayout;
