import { render } from '@testing-library/react';
import Footer from '../Components/Footer';

test(`Footer matches snapshot`, () => {
  const view = render(<Footer />);

  expect(view).toMatchSnapshot();
});